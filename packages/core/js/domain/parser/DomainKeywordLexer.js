class DomainKeywordLexer {
  tokenize(input) {
    const source = String(input || '');
    const tokens = [];
    let index = 0;

    while (index < source.length) {
      const ch = source[index];

      if (this.isWhitespace(ch)) {
        index += 1;
        continue;
      }

      if (ch === '(') {
        tokens.push(this.token('LPAREN', ch, index, index + 1));
        index += 1;
        continue;
      }
      if (ch === ')') {
        tokens.push(this.token('RPAREN', ch, index, index + 1));
        index += 1;
        continue;
      }
      if (ch === '[') {
        tokens.push(this.token('LBRACKET', ch, index, index + 1));
        index += 1;
        continue;
      }
      if (ch === ']') {
        tokens.push(this.token('RBRACKET', ch, index, index + 1));
        index += 1;
        continue;
      }
      if (ch === ',') {
        tokens.push(this.token('COMMA', ch, index, index + 1));
        index += 1;
        continue;
      }
      if (ch === '=') {
        tokens.push(this.token('EQUALS', ch, index, index + 1));
        index += 1;
        continue;
      }

      if (ch === '"' || ch === "'") {
        const parsed = this.readString(source, index);
        if (!parsed.ok) {
          return { ok: false, error: 'Invalid keyword arguments: unbalanced expression' };
        }
        tokens.push(this.token('STRING', parsed.value, index, parsed.nextIndex));
        index = parsed.nextIndex;
        continue;
      }

      if (ch === '-' || this.isDigit(ch)) {
        const numberToken = this.tryReadNumber(source, index);
        if (numberToken) {
          tokens.push(numberToken.token);
          index = numberToken.nextIndex;
          continue;
        }
      }

      const identifier = this.readIdentifier(source, index);
      if (!identifier.ok) {
        return { ok: false, error: 'Invalid keyword arguments: unbalanced expression' };
      }
      tokens.push(this.token('IDENT', identifier.value, index, identifier.nextIndex));
      index = identifier.nextIndex;
    }

    tokens.push(this.token('EOF', '', source.length, source.length));
    return { ok: true, tokens };
  }

  token(type, value, start, end) {
    return { type, value, start, end };
  }

  readString(source, startIndex) {
    const quote = source[startIndex];
    let value = '';
    let index = startIndex + 1;

    while (index < source.length) {
      const ch = source[index];
      if (ch === '\\') {
        if (index + 1 >= source.length) {
          return { ok: false };
        }
        const escaped = source[index + 1];
        if (escaped === quote || escaped === '\\') {
          value += escaped;
        } else {
          value += `\\${escaped}`;
        }
        index += 2;
        continue;
      }

      if (ch === quote) {
        return { ok: true, value, nextIndex: index + 1 };
      }

      value += ch;
      index += 1;
    }

    return { ok: false };
  }

  tryReadNumber(source, startIndex) {
    let index = startIndex;
    if (source[index] === '-') {
      if (!this.isDigit(source[index + 1])) {
        return null;
      }
      index += 1;
    }

    const intStart = index;
    while (index < source.length && this.isDigit(source[index])) {
      index += 1;
    }
    if (index === intStart) {
      return null;
    }

    if (source[index] === '.') {
      const decimalStart = index + 1;
      index += 1;
      while (index < source.length && this.isDigit(source[index])) {
        index += 1;
      }
      if (index === decimalStart) {
        return null;
      }
    }

    const boundary = source[index];
    if (!this.isEndOrDelimiter(boundary)) {
      return null;
    }

    const raw = source.slice(startIndex, index);
    return { token: this.token('NUMBER', Number(raw), startIndex, index), nextIndex: index };
  }

  readIdentifier(source, startIndex) {
    let index = startIndex;
    while (index < source.length && !this.isDelimiter(source[index])) {
      index += 1;
    }

    if (index === startIndex) {
      return { ok: false };
    }

    return { ok: true, value: source.slice(startIndex, index), nextIndex: index };
  }

  isDelimiter(ch) {
    return this.isWhitespace(ch) || ch === '(' || ch === ')' || ch === '[' || ch === ']' || ch === ',' || ch === '=';
  }

  isEndOrDelimiter(ch) {
    return typeof ch === 'undefined' || this.isDelimiter(ch);
  }

  isWhitespace(ch) {
    return ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r';
  }

  isDigit(ch) {
    return ch >= '0' && ch <= '9';
  }
}

export { DomainKeywordLexer };
