class ArgumentParser {
  constructor(source) {
    this.source = String(source || '');
    this.index = 0;
  }

  parse() {
    const argumentsList = [];
    this.skipWhitespace();

    while (!this.atEnd()) {
      if (this.peek() === ',') {
        return { ok: false, error: 'Invalid keyword arguments: missing argument after comma' };
      }

      const parsedArgument = this.parseArgument();
      if (!parsedArgument.ok) {
        return parsedArgument;
      }
      argumentsList.push(parsedArgument.argument);

      this.skipWhitespace();
      if (this.atEnd()) {
        break;
      }

      if (this.peek() !== ',') {
        return { ok: false, error: 'Invalid keyword arguments: unbalanced expression' };
      }

      this.consume();
      this.skipWhitespace();
      if (this.atEnd()) {
        return { ok: false, error: 'Invalid keyword arguments: missing argument after comma' };
      }
    }

    return { ok: true, arguments: argumentsList };
  }

  parseArgument() {
    const start = this.index;
    const maybeName = this.tryParseIdentifier();

    if (maybeName.ok) {
      const checkpoint = this.index;
      this.skipWhitespace();
      if (this.peek() === '=') {
        this.consume();
        this.skipWhitespace();
        if (this.atEnd()) {
          return {
            ok: false,
            error: `Invalid keyword arguments: missing value for named argument "${maybeName.value}"`,
          };
        }
        const parsedValue = this.parseValue();
        if (!parsedValue.ok) {
          return parsedValue;
        }
        return { ok: true, argument: { kind: 'named', name: maybeName.value, value: parsedValue.value } };
      }
      this.index = checkpoint;
      this.index = start;
    }

    const parsedValue = this.parseValue();
    if (!parsedValue.ok) {
      return parsedValue;
    }
    return { ok: true, argument: { kind: 'positional', value: parsedValue.value } };
  }

  parseValue() {
    this.skipWhitespace();
    if (this.atEnd()) {
      return { ok: false, error: 'Invalid keyword arguments: unbalanced expression' };
    }

    const ch = this.peek();
    if (ch === '"' || ch === "'") {
      return this.parseString();
    }
    if (ch === '[') {
      return this.parseArray();
    }
    if (ch === '-' || this.isDigit(ch)) {
      return this.parseNumberOrBareword();
    }

    return this.parseIdentifierLikeValue();
  }

  parseString() {
    const quote = this.consume();
    let value = '';

    while (!this.atEnd()) {
      const ch = this.consume();
      if (ch === '\\') {
        if (this.atEnd()) {
          return { ok: false, error: 'Invalid keyword arguments: unbalanced expression' };
        }
        const escaped = this.consume();
        if (escaped === quote || escaped === '\\') {
          value += escaped;
        } else {
          value += `\\${escaped}`;
        }
        continue;
      }

      if (ch === quote) {
        return { ok: true, value };
      }

      value += ch;
    }

    return { ok: false, error: 'Invalid keyword arguments: unbalanced expression' };
  }

  parseArray() {
    this.consume();
    const values = [];
    this.skipWhitespace();

    if (this.peek() === ']') {
      this.consume();
      return { ok: true, value: values };
    }

    while (!this.atEnd()) {
      if (this.peek() === ',') {
        return { ok: false, error: 'Invalid keyword arguments: missing argument after comma' };
      }

      const parsedValue = this.parseValue();
      if (!parsedValue.ok) {
        return parsedValue;
      }
      values.push(parsedValue.value);

      this.skipWhitespace();
      if (this.peek() === ']') {
        this.consume();
        return { ok: true, value: values };
      }

      if (this.peek() !== ',') {
        return { ok: false, error: 'Invalid keyword arguments: unbalanced expression' };
      }

      this.consume();
      this.skipWhitespace();
      if (this.peek() === ']') {
        return { ok: false, error: 'Invalid keyword arguments: missing argument after comma' };
      }
    }

    return { ok: false, error: 'Invalid keyword arguments: unbalanced expression' };
  }

  parseNumberOrBareword() {
    const start = this.index;
    if (this.peek() === '-') {
      this.consume();
    }

    let sawDigit = false;
    while (!this.atEnd() && this.isDigit(this.peek())) {
      sawDigit = true;
      this.consume();
    }

    if (!this.atEnd() && this.peek() === '.') {
      this.consume();
      while (!this.atEnd() && this.isDigit(this.peek())) {
        sawDigit = true;
        this.consume();
      }
    }

    const candidate = this.source.slice(start, this.index);
    if (sawDigit && /^-?\d+(\.\d+)?$/.test(candidate)) {
      return { ok: true, value: Number(candidate) };
    }

    this.index = start;
    return this.parseIdentifierLikeValue();
  }

  parseIdentifierLikeValue() {
    const parsed = this.tryParseIdentifier();
    if (!parsed.ok) {
      return { ok: false, error: 'Invalid keyword arguments: unbalanced expression' };
    }

    if (parsed.value === 'true') return { ok: true, value: true };
    if (parsed.value === 'false') return { ok: true, value: false };
    if (parsed.value === 'null') return { ok: true, value: null };

    return { ok: true, value: parsed.value };
  }

  tryParseIdentifier() {
    this.skipWhitespace();
    const start = this.index;
    while (!this.atEnd()) {
      const ch = this.peek();
      if (this.isIdentifierBoundary(ch)) {
        break;
      }
      this.consume();
    }

    const raw = this.source.slice(start, this.index).trim();
    if (!raw) {
      return { ok: false };
    }

    return { ok: true, value: raw };
  }

  isIdentifierBoundary(ch) {
    return ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r' || ch === ',' || ch === '=' || ch === ']';
  }

  isDigit(ch) {
    return ch >= '0' && ch <= '9';
  }

  skipWhitespace() {
    while (!this.atEnd()) {
      const ch = this.peek();
      if (ch !== ' ' && ch !== '\t' && ch !== '\n' && ch !== '\r') {
        break;
      }
      this.consume();
    }
  }

  peek() {
    return this.source[this.index];
  }

  consume() {
    const ch = this.source[this.index];
    this.index += 1;
    return ch;
  }

  atEnd() {
    return this.index >= this.source.length;
  }
}

export { ArgumentParser };
