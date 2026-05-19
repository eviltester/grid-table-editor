class DomainKeywordTokenStream {
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
    const token = this.peek();
    if (!token || token.type !== type) {
      return false;
    }
    this.consume();
    return true;
  }
}

export { DomainKeywordTokenStream };
