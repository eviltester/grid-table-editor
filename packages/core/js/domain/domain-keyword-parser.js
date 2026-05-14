import { DomainKeywordParser } from './parser/DomainKeywordParser.js';

const DOMAIN_KEYWORD_PARSER = new DomainKeywordParser();

function parseKeywordInvocation(rawValue) {
  return DOMAIN_KEYWORD_PARSER.parseKeywordInvocation(rawValue);
}

export { DomainKeywordParser, parseKeywordInvocation };
