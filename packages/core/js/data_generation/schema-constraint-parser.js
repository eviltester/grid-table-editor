import { SchemaParsingErrors } from './schema-parsing-errors.js';

function isWhitespace(char) {
  return /\s/.test(char);
}

function isDigit(char) {
  return /[0-9]/.test(char);
}

function isIdentifierStart(char) {
  return /[A-Za-z_]/.test(char);
}

function isIdentifierPart(char) {
  return /[A-Za-z0-9_]/.test(char);
}

function createToken(type, value, start, end, line) {
  return { type, value, start, end, line };
}

function lexConstraintText(sourceText, { startLine = 1 } = {}) {
  const source = String(sourceText ?? '');
  const tokens = [];
  const errors = [];
  let index = 0;
  let line = startLine;

  while (index < source.length) {
    const char = source[index];

    if (char === '\r') {
      index += 1;
      continue;
    }
    if (char === '\n') {
      line += 1;
      index += 1;
      continue;
    }
    if (isWhitespace(char)) {
      index += 1;
      continue;
    }
    if (char === '[') {
      const openIndex = index;
      index += 1;
      let parameterValue = '';
      while (index < source.length && source[index] !== ']') {
        if (source[index] === '\n') {
          errors.push(SchemaParsingErrors.invalidConstraintSyntax('Unterminated parameter name.', line));
          return { ok: false, tokens, errors };
        }
        parameterValue += source[index];
        index += 1;
      }
      if (source[index] !== ']') {
        errors.push(SchemaParsingErrors.invalidConstraintSyntax('Unterminated parameter name.', line));
        return { ok: false, tokens, errors };
      }
      index += 1;
      tokens.push(createToken('PARAMETER', parameterValue.trim(), openIndex, index, line));
      continue;
    }
    if (char === '"' || char === "'") {
      const quote = char;
      const tokenLine = line;
      const tokenStart = index;
      index += 1;
      let value = '';
      while (index < source.length) {
        const nextChar = source[index];
        if (nextChar === '\r') {
          index += 1;
          continue;
        }
        if (nextChar === '\n') {
          line += 1;
        }
        if (nextChar === '\\' && index + 1 < source.length) {
          const escaped = source[index + 1];
          value += escaped;
          index += 2;
          continue;
        }
        if (nextChar === quote) {
          index += 1;
          tokens.push(createToken('STRING', value, tokenStart, index, tokenLine));
          value = null;
          break;
        }
        value += nextChar;
        index += 1;
      }
      if (value !== null) {
        errors.push(SchemaParsingErrors.invalidConstraintSyntax('Unterminated string literal.', tokenLine));
        return { ok: false, tokens, errors };
      }
      continue;
    }
    if (char === '(') {
      tokens.push(createToken('LPAREN', char, index, index + 1, line));
      index += 1;
      continue;
    }
    if (char === ')') {
      tokens.push(createToken('RPAREN', char, index, index + 1, line));
      index += 1;
      continue;
    }
    if (char === '{') {
      tokens.push(createToken('LBRACE', char, index, index + 1, line));
      index += 1;
      continue;
    }
    if (char === '}') {
      tokens.push(createToken('RBRACE', char, index, index + 1, line));
      index += 1;
      continue;
    }
    if (char === ',') {
      tokens.push(createToken('COMMA', char, index, index + 1, line));
      index += 1;
      continue;
    }
    if (char === ';') {
      tokens.push(createToken('SEMICOLON', char, index, index + 1, line));
      index += 1;
      continue;
    }
    if (char === '<' && source[index + 1] === '>') {
      tokens.push(createToken('RELATION', '<>', index, index + 2, line));
      index += 2;
      continue;
    }
    if (char === '>' || char === '<') {
      if (source[index + 1] === '=') {
        tokens.push(createToken('RELATION', `${char}=`, index, index + 2, line));
        index += 2;
        continue;
      }
      tokens.push(createToken('RELATION', char, index, index + 1, line));
      index += 1;
      continue;
    }
    if (char === '=') {
      tokens.push(createToken('RELATION', char, index, index + 1, line));
      index += 1;
      continue;
    }
    if (char === '-' ? isDigit(source[index + 1]) : isDigit(char)) {
      const tokenStart = index;
      const tokenLine = line;
      let numberText = '';
      if (char === '-') {
        numberText += '-';
        index += 1;
      }
      while (index < source.length && isDigit(source[index])) {
        numberText += source[index];
        index += 1;
      }
      if (source[index] === '.') {
        numberText += '.';
        index += 1;
        while (index < source.length && isDigit(source[index])) {
          numberText += source[index];
          index += 1;
        }
      }
      tokens.push(createToken('NUMBER', Number(numberText), tokenStart, index, tokenLine));
      continue;
    }
    if (isIdentifierStart(char)) {
      const tokenStart = index;
      const tokenLine = line;
      let identifier = char;
      index += 1;
      while (index < source.length && isIdentifierPart(source[index])) {
        identifier += source[index];
        index += 1;
      }
      const upperIdentifier = identifier.toUpperCase();
      const keywordTypes = new Set([
        'IF',
        'THEN',
        'AND',
        'OR',
        'NOT',
        'LIKE',
        'IN',
        'ENDIF',
        'ISNEGATIVE',
        'ISPOSITIVE',
      ]);
      if (keywordTypes.has(upperIdentifier)) {
        tokens.push(createToken(upperIdentifier, identifier, tokenStart, index, tokenLine));
      } else {
        tokens.push(createToken('IDENTIFIER', identifier, tokenStart, index, tokenLine));
      }
      continue;
    }

    errors.push(SchemaParsingErrors.invalidConstraintSyntax(`Unexpected token "${char}".`, line));
    return { ok: false, tokens, errors };
  }

  tokens.push(createToken('EOF', '', index, index, line));
  return { ok: errors.length === 0, tokens, errors };
}

class ConstraintTokenStream {
  constructor(tokens) {
    this.tokens = Array.isArray(tokens) ? tokens : [];
    this.index = 0;
  }

  peek(offset = 0) {
    return this.tokens[this.index + offset] || this.tokens[this.tokens.length - 1];
  }

  consume() {
    const token = this.peek();
    this.index += 1;
    return token;
  }

  match(type) {
    if (this.peek()?.type === type) {
      return this.consume();
    }
    return null;
  }

  expect(type, message) {
    const token = this.peek();
    if (token?.type !== type) {
      throw SchemaParsingErrors.invalidConstraintSyntax(message, token?.line);
    }
    return this.consume();
  }
}

function collectReferencedParameters(astNode, names = new Set()) {
  if (!astNode || typeof astNode !== 'object') {
    return names;
  }
  if (astNode.kind === 'parameter') {
    names.add(astNode.name);
    return names;
  }
  if (astNode.kind === 'set') {
    astNode.values.forEach((value) => {
      collectReferencedParameters(value, names);
    });
    return names;
  }
  Object.values(astNode).forEach((value) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        collectReferencedParameters(item, names);
      });
      return;
    }
    collectReferencedParameters(value, names);
  });
  return names;
}

function parseConstraint(tokens, { sourceText = '' } = {}) {
  const stream = new ConstraintTokenStream(tokens);

  function parseValue() {
    const token = stream.peek();
    if (token?.type === 'STRING') {
      stream.consume();
      return { kind: 'value', valueType: 'string', value: token.value, line: token.line };
    }
    if (token?.type === 'NUMBER') {
      stream.consume();
      return { kind: 'value', valueType: 'number', value: token.value, line: token.line };
    }
    throw SchemaParsingErrors.invalidConstraintSyntax('Expected a string or number value.', token?.line);
  }

  function parseValueSet() {
    const values = [parseValue()];
    while (stream.match('COMMA')) {
      values.push(parseValue());
    }
    return values;
  }

  function parseParameterReference() {
    const token = stream.expect('PARAMETER', 'Expected a parameter reference like [Column Name].');
    return { kind: 'parameter', name: String(token.value || '').trim(), line: token.line };
  }

  function parseTerm() {
    const token = stream.peek();
    if (token?.type === 'ISNEGATIVE' || token?.type === 'ISPOSITIVE') {
      const functionToken = stream.consume();
      stream.expect('LPAREN', `Expected "(" after ${functionToken.value}.`);
      const parameter = parseParameterReference();
      stream.expect('RPAREN', `Expected ")" after ${functionToken.value} parameter.`);
      return {
        kind: 'function',
        functionName: functionToken.type,
        parameter,
        line: functionToken.line,
      };
    }

    const left = parseParameterReference();
    if (stream.match('NOT')) {
      if (stream.match('LIKE')) {
        return {
          kind: 'like',
          negated: true,
          left,
          pattern: parseValue(),
          line: token?.line,
        };
      }
      if (stream.match('IN')) {
        stream.expect('LBRACE', 'Expected "{" after NOT IN.');
        const values = parseValueSet();
        stream.expect('RBRACE', 'Expected "}" after value set.');
        return {
          kind: 'in',
          negated: true,
          left,
          right: { kind: 'set', values },
          line: token?.line,
        };
      }
      throw SchemaParsingErrors.invalidConstraintSyntax('Expected LIKE or IN after NOT.', stream.peek()?.line);
    }
    if (stream.match('LIKE')) {
      return {
        kind: 'like',
        negated: false,
        left,
        pattern: parseValue(),
        line: token?.line,
      };
    }
    if (stream.match('IN')) {
      stream.expect('LBRACE', 'Expected "{" after IN.');
      const values = parseValueSet();
      stream.expect('RBRACE', 'Expected "}" after value set.');
      return {
        kind: 'in',
        negated: false,
        left,
        right: { kind: 'set', values },
        line: token?.line,
      };
    }

    const relation = stream.expect('RELATION', 'Expected a comparison operator.').value;
    const nextToken = stream.peek();
    const right = nextToken?.type === 'PARAMETER' ? parseParameterReference() : parseValue();
    return {
      kind: 'comparison',
      relation,
      left,
      right,
      line: token?.line,
    };
  }

  function parseClause() {
    if (stream.match('LPAREN')) {
      const expression = parsePredicate();
      stream.expect('RPAREN', 'Expected ")" to close grouped predicate.');
      return expression;
    }
    if (stream.match('NOT')) {
      return {
        kind: 'logical-not',
        operand: parseClause(),
      };
    }
    return parseTerm();
  }

  function parseAndPredicate() {
    let left = parseClause();
    while (stream.peek()?.type === 'AND') {
      const operator = stream.consume();
      const right = parseClause();
      left = {
        kind: 'logical',
        operator: operator.type,
        left,
        right,
        line: operator.line,
      };
    }
    return left;
  }

  function parsePredicate() {
    let left = parseAndPredicate();
    while (stream.peek()?.type === 'OR') {
      const operator = stream.consume();
      const right = parseAndPredicate();
      left = {
        kind: 'logical',
        operator: operator.type,
        left,
        right,
        line: operator.line,
      };
    }
    return left;
  }

  const ifToken = stream.expect('IF', 'Constraint must start with IF.');
  const condition = parsePredicate();
  stream.expect('THEN', 'Constraint must include THEN.');
  const consequence = parsePredicate();
  let terminator = null;
  if (stream.match('SEMICOLON')) {
    terminator = ';';
  } else if (stream.match('ENDIF')) {
    terminator = 'ENDIF';
  } else {
    throw SchemaParsingErrors.invalidConstraintSyntax(
      'Constraint must terminate with ";" or ENDIF.',
      stream.peek()?.line
    );
  }
  stream.expect('EOF', 'Unexpected content after constraint terminator.');

  const ast = {
    kind: 'if-then-constraint',
    condition,
    consequence,
    terminator,
    sourceText: String(sourceText || ''),
    line: ifToken.line,
  };
  return {
    ok: true,
    ast,
    terminator,
    referencedParameters: [...collectReferencedParameters(ast)],
  };
}

function parseConstraintText(sourceText, { startLine = 1 } = {}) {
  const lexed = lexConstraintText(sourceText, { startLine });
  if (!lexed.ok) {
    return {
      ok: false,
      ast: null,
      terminator: null,
      referencedParameters: [],
      errors: lexed.errors,
    };
  }
  try {
    const parsed = parseConstraint(lexed.tokens, { sourceText });
    return {
      ...parsed,
      errors: [],
    };
  } catch (error) {
    return {
      ok: false,
      ast: null,
      terminator: null,
      referencedParameters: [],
      errors: [error],
    };
  }
}

export { parseConstraintText };
