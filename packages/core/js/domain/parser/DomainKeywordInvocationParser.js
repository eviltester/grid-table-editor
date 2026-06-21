import { DomainKeywordLexer } from './DomainKeywordLexer.js';
import { DomainKeywordTokenStream } from './DomainKeywordTokenStream.js';

class DomainKeywordInvocationParser {
  constructor() {
    this.lexer = new DomainKeywordLexer();
  }

  parse(invocation) {
    const lexed = this.lexer.tokenize(invocation);
    if (!lexed.ok) {
      return lexed;
    }

    const stream = new DomainKeywordTokenStream(lexed.tokens);

    const keywordToken = stream.peek();
    if (keywordToken.type !== 'IDENT') {
      return { ok: false, error: 'Invalid keyword invocation: missing keyword' };
    }
    const keyword = stream.consume().value;

    if (stream.peek().type === 'EOF') {
      return { ok: true, keyword, arguments: [] };
    }

    if (!stream.match('LPAREN')) {
      if (this.hasToken(stream, 'RPAREN')) {
        return this.invalid(keyword, 'Invalid keyword invocation: missing opening parenthesis');
      }
      return this.invalid(keyword, 'Invalid keyword invocation: unexpected trailing content');
    }

    if (stream.peek().type === 'RPAREN') {
      stream.consume();
      if (stream.peek().type !== 'EOF') {
        return this.invalid(keyword, 'Invalid keyword invocation: unexpected trailing content');
      }
      return { ok: true, keyword, arguments: [] };
    }

    const parsedArgs = this.parseArgumentList(stream);
    if (!parsedArgs.ok) {
      return this.invalid(keyword, parsedArgs.error);
    }

    if (!stream.match('RPAREN')) {
      return this.invalid(keyword, 'Invalid keyword invocation: missing closing parenthesis');
    }

    if (stream.peek().type !== 'EOF') {
      return this.invalid(keyword, 'Invalid keyword invocation: unexpected trailing content');
    }

    return { ok: true, keyword, arguments: parsedArgs.arguments };
  }

  invalid(keyword, error) {
    return { ok: false, keyword, error };
  }

  parseArgumentList(stream) {
    const argumentsList = [];

    while (true) {
      if (stream.peek().type === 'COMMA') {
        return { ok: false, error: 'Invalid keyword arguments: missing argument after comma' };
      }

      const parsedArg = this.parseArgument(stream);
      if (!parsedArg.ok) {
        return parsedArg;
      }
      argumentsList.push(parsedArg.argument);

      if (!stream.match('COMMA')) {
        break;
      }

      if (stream.peek().type === 'RPAREN' || stream.peek().type === 'EOF') {
        return { ok: false, error: 'Invalid keyword arguments: missing argument after comma' };
      }
    }

    return { ok: true, arguments: argumentsList };
  }

  parseArgument(stream) {
    const current = stream.peek();
    const next = stream.peek(1);

    if (current.type === 'IDENT' && next.type === 'EQUALS') {
      const name = stream.consume().value;
      stream.consume();
      const parsedValue = this.parseValue(stream);
      if (!parsedValue.ok) {
        return parsedValue;
      }
      return { ok: true, argument: { kind: 'named', name, value: parsedValue.value } };
    }

    const parsedValue = this.parseValue(stream);
    if (!parsedValue.ok) {
      return parsedValue;
    }

    return { ok: true, argument: { kind: 'positional', value: parsedValue.value } };
  }

  parseValue(stream) {
    const token = stream.peek();

    if (token.type === 'STRING') {
      stream.consume();
      return { ok: true, value: token.value };
    }

    if (token.type === 'NUMBER') {
      stream.consume();
      return { ok: true, value: token.value };
    }

    if (token.type === 'IDENT') {
      stream.consume();
      if (token.value === 'true') return { ok: true, value: true };
      if (token.value === 'false') return { ok: true, value: false };
      return { ok: false, error: 'Invalid keyword arguments: bare values are not allowed; wrap strings in quotes' };
    }

    if (token.type === 'LBRACKET') {
      return this.parseArray(stream);
    }
    if (token.type === 'LBRACE') {
      return this.parseObject(stream);
    }

    if (token.type === 'RPAREN' || token.type === 'COMMA' || token.type === 'EOF' || token.type === 'RBRACKET') {
      return { ok: false, error: 'Invalid keyword arguments: unbalanced expression' };
    }

    return { ok: false, error: 'Invalid keyword arguments: unbalanced expression' };
  }

  parseArray(stream) {
    if (!stream.match('LBRACKET')) {
      return { ok: false, error: 'Invalid keyword arguments: unbalanced expression' };
    }

    const values = [];

    if (stream.match('RBRACKET')) {
      return { ok: true, value: values };
    }

    while (true) {
      if (stream.peek().type === 'COMMA') {
        return { ok: false, error: 'Invalid keyword arguments: missing argument after comma' };
      }

      const parsedValue = this.parseValue(stream);
      if (!parsedValue.ok) {
        return parsedValue;
      }
      values.push(parsedValue.value);

      if (stream.match('RBRACKET')) {
        return { ok: true, value: values };
      }

      if (!stream.match('COMMA')) {
        return { ok: false, error: 'Invalid keyword arguments: unbalanced expression' };
      }

      if (stream.peek().type === 'RBRACKET' || stream.peek().type === 'EOF') {
        return { ok: false, error: 'Invalid keyword arguments: missing argument after comma' };
      }
    }
  }

  parseObject(stream) {
    if (!stream.match('LBRACE')) {
      return { ok: false, error: 'Invalid keyword arguments: unbalanced expression' };
    }

    const value = Object.create(null);

    if (stream.match('RBRACE')) {
      return { ok: true, value };
    }

    while (true) {
      const keyToken = stream.peek();
      if (keyToken.type !== 'STRING' && keyToken.type !== 'IDENT') {
        return { ok: false, error: 'Invalid keyword arguments: unbalanced expression' };
      }
      const key = String(stream.consume().value);
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        return { ok: false, error: `Invalid keyword arguments: unsafe object key "${key}" is not allowed` };
      }

      if (!stream.match('COLON')) {
        return { ok: false, error: 'Invalid keyword arguments: unbalanced expression' };
      }

      const parsedValue = this.parseValue(stream);
      if (!parsedValue.ok) {
        return parsedValue;
      }
      value[key] = parsedValue.value;

      if (stream.match('RBRACE')) {
        return { ok: true, value };
      }

      if (!stream.match('COMMA')) {
        return { ok: false, error: 'Invalid keyword arguments: unbalanced expression' };
      }

      if (stream.peek().type === 'RBRACE' || stream.peek().type === 'EOF') {
        return { ok: false, error: 'Invalid keyword arguments: missing argument after comma' };
      }
    }
  }

  hasToken(stream, type) {
    let offset = 0;
    while (stream.peek(offset).type !== 'EOF') {
      if (stream.peek(offset).type === type) {
        return true;
      }
      offset += 1;
    }
    return false;
  }
}

export { DomainKeywordInvocationParser };
