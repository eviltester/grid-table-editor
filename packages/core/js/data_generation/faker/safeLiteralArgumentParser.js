function isWhitespace(char) {
  return /\s/.test(char);
}

function isIdentifierStart(char) {
  return /[A-Za-z_$]/.test(char);
}

function isIdentifierPart(char) {
  return /[A-Za-z0-9_$]/.test(char);
}

class LiteralArgsParser {
  constructor(input) {
    this.input = input;
    this.index = 0;
  }

  parseArgumentList() {
    this.skipWhitespace();
    this.expect('(');
    this.skipWhitespace();

    const args = [];
    if (this.peek() === ')') {
      this.index += 1;
      this.skipWhitespace();
      this.expectEnd();
      return args;
    }

    while (this.index < this.input.length) {
      args.push(this.parseValue());
      this.skipWhitespace();

      const next = this.peek();
      if (next === ',') {
        this.index += 1;
        this.skipWhitespace();
        if (this.peek() === ')') {
          this.index += 1;
          this.skipWhitespace();
          this.expectEnd();
          return args;
        }
        continue;
      }

      if (next === ')') {
        this.index += 1;
        this.skipWhitespace();
        this.expectEnd();
        return args;
      }

      throw new Error(`Unexpected token '${next || 'EOF'}' in argument list`);
    }

    throw new Error('Unterminated argument list');
  }

  parseValue() {
    this.skipWhitespace();
    const char = this.peek();

    if (char === '"' || char === "'") {
      return this.parseString();
    }
    if (char === '[') {
      return this.parseArray();
    }
    if (char === '{') {
      return this.parseObject();
    }
    if (char === '-' || /[0-9]/.test(char || '')) {
      return this.parseNumber();
    }
    if (this.input.startsWith('true', this.index)) {
      this.index += 4;
      return true;
    }
    if (this.input.startsWith('false', this.index)) {
      this.index += 5;
      return false;
    }
    if (this.input.startsWith('null', this.index)) {
      this.index += 4;
      return null;
    }

    throw new Error(`Unsupported literal value starting at '${char || 'EOF'}'`);
  }

  parseString() {
    const quote = this.peek();
    this.index += 1;
    let result = '';

    while (this.index < this.input.length) {
      const char = this.input[this.index];
      if (char === '\\') {
        const next = this.input[this.index + 1];
        if (next === undefined) {
          throw new Error('Unterminated escape sequence in string literal');
        }
        result += this.decodeEscape(next);
        this.index += 2;
        continue;
      }
      if (char === quote) {
        this.index += 1;
        return result;
      }
      result += char;
      this.index += 1;
    }

    throw new Error('Unterminated string literal');
  }

  decodeEscape(char) {
    switch (char) {
      case 'n':
        return '\n';
      case 'r':
        return '\r';
      case 't':
        return '\t';
      case '\\':
        return '\\';
      case '"':
        return '"';
      case "'":
        return "'";
      default:
        return char;
    }
  }

  parseArray() {
    this.expect('[');
    this.skipWhitespace();
    const values = [];

    if (this.peek() === ']') {
      this.index += 1;
      return values;
    }

    while (this.index < this.input.length) {
      values.push(this.parseValue());
      this.skipWhitespace();
      const next = this.peek();
      if (next === ',') {
        this.index += 1;
        this.skipWhitespace();
        if (this.peek() === ']') {
          this.index += 1;
          return values;
        }
        continue;
      }
      if (next === ']') {
        this.index += 1;
        return values;
      }
      throw new Error(`Unexpected token '${next || 'EOF'}' in array literal`);
    }

    throw new Error('Unterminated array literal');
  }

  parseObject() {
    this.expect('{');
    this.skipWhitespace();
    const value = {};

    if (this.peek() === '}') {
      this.index += 1;
      return value;
    }

    while (this.index < this.input.length) {
      const key = this.parseObjectKey();
      this.skipWhitespace();
      this.expect(':');
      this.skipWhitespace();
      value[key] = this.parseValue();
      this.skipWhitespace();
      const next = this.peek();
      if (next === ',') {
        this.index += 1;
        this.skipWhitespace();
        if (this.peek() === '}') {
          this.index += 1;
          return value;
        }
        continue;
      }
      if (next === '}') {
        this.index += 1;
        return value;
      }
      throw new Error(`Unexpected token '${next || 'EOF'}' in object literal`);
    }

    throw new Error('Unterminated object literal');
  }

  parseObjectKey() {
    const char = this.peek();
    if (char === '"' || char === "'") {
      return this.parseString();
    }

    if (!isIdentifierStart(char || '')) {
      throw new Error(`Unsupported object key starting at '${char || 'EOF'}'`);
    }

    const start = this.index;
    this.index += 1;
    while (isIdentifierPart(this.peek() || '')) {
      this.index += 1;
    }
    return this.input.slice(start, this.index);
  }

  parseNumber() {
    const remaining = this.input.slice(this.index);
    const match = remaining.match(/^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/);
    if (!match) {
      throw new Error(`Invalid numeric literal at '${remaining.slice(0, 10)}'`);
    }
    this.index += match[0].length;
    return Number(match[0]);
  }

  expect(char) {
    if (this.peek() !== char) {
      throw new Error(`Expected '${char}' but found '${this.peek() || 'EOF'}'`);
    }
    this.index += 1;
  }

  expectEnd() {
    if (this.index !== this.input.length) {
      throw new Error(`Unexpected trailing content starting at '${this.input.slice(this.index)}'`);
    }
  }

  skipWhitespace() {
    while (isWhitespace(this.peek() || '')) {
      this.index += 1;
    }
  }

  peek() {
    return this.input[this.index];
  }
}

export function parseFakerLiteralArguments(argString) {
  if (!argString || String(argString).trim() === '()') {
    return [];
  }

  const trimmed = String(argString).trim();
  if (!trimmed.startsWith('(') || !trimmed.endsWith(')')) {
    throw new Error('Invalid argument format: must be enclosed in parentheses');
  }

  const parser = new LiteralArgsParser(trimmed);
  return parser.parseArgumentList();
}

export function hasSafeFakerLiteralArguments(ruleLine) {
  const openParen = String(ruleLine || '').indexOf('(');
  if (openParen === -1) {
    return true;
  }

  const trimmed = String(ruleLine || '').trim();
  try {
    parseFakerLiteralArguments(trimmed.slice(openParen));
    return true;
  } catch {
    return false;
  }
}
