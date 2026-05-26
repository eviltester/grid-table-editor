import { DOMAIN_KEYWORDS, executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../js/domain/domain-keyword-parser.js';

function setDeepMethod(root, target, fn) {
  const parts = String(target || '')
    .split('.')
    .filter((part) => part.length > 0);

  let node = root;
  for (let index = 0; index < parts.length - 1; index += 1) {
    const part = parts[index];
    node[part] = node[part] || {};
    node = node[part];
  }

  node[parts[parts.length - 1]] = fn;
}

function sampleValueForType(typeName) {
  const types = String(typeName || '')
    .split('|')
    .map((entry) => entry.trim());

  if (types.includes('number') || types.includes('integer')) {
    return 7;
  }
  if (types.includes('regexp')) {
    return '[A-Z]';
  }
  if (types.includes('boolean')) {
    return true;
  }
  if (types.includes('array')) {
    return ['x', 'y'];
  }
  if (types.includes('object')) {
    return { key: 'value' };
  }
  return 'sample';
}

function sampleValueForKeywordArg(keywordName, argName, typeName) {
  void keywordName;
  if (argName === 'from') return 1577836800000;
  if (argName === 'to') return 1580428800000;
  if (argName === 'refDate') return 1716110400000;
  if (argName === 'count') return 3;
  if (argName === 'min') return 1;
  if (argName === 'max') return 10;
  if (argName === 'length') return 8;
  if (argName === 'precision') return 2;
  if (argName === 'multipleOf') return 1;
  if (argName === 'separator') return '-';
  if (argName === 'protocol') return 'https';
  if (argName === 'countryCode') return 'GB';
  if (argName === 'mimeType') return 'image/png';
  if (argName === 'network') return 'private';
  if (argName === 'cidrBlock') return '192.168.0.0/24';
  if (argName === 'types') return ['smiley'];
  if (argName === 'header') return { alg: 'HS256', typ: 'JWT' };
  if (argName === 'payload') return { iss: 'Acme' };
  if (argName === 'pattern') return '[A-Z]';
  if (argName === 'mode') return 'age';
  if (argName === 'strategy') return 'any-length';
  if (argName === 'sex') return 'female';
  if (argName === 'style') return 'human';

  return sampleValueForType(typeName);
}

function valueToInvocationLiteral(value) {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (value && typeof value === 'object') {
    return JSON.stringify(value);
  }
  throw new Error(`Unsupported literal type for invocation: ${typeof value}`);
}

function addDomainParamInvocationCoverageTests(domainName) {
  const keywords = DOMAIN_KEYWORDS.filter(
    (keyword) =>
      keyword.delegate?.type === 'faker' &&
      keyword.keyword.startsWith(`${domainName}.`) &&
      Array.isArray(keyword.help?.args) &&
      keyword.help.args.length > 0
  );

  for (const keyword of keywords) {
    test(`${keyword.keyword} supports equivalent positional and named documented params`, () => {
      const sampleArgs = keyword.help.args.map((arg) => sampleValueForKeywordArg(keyword.keyword, arg.name, arg.type));

      const positionalInvocation = `${keyword.keyword}(${sampleArgs.map(valueToInvocationLiteral).join(', ')})`;
      const namedInvocation = `${keyword.keyword}(${keyword.help.args
        .map((arg, index) => `${arg.name}=${valueToInvocationLiteral(sampleArgs[index])}`)
        .join(', ')})`;

      const parsedPositional = parseKeywordInvocation(positionalInvocation);
      const parsedNamed = parseKeywordInvocation(namedInvocation);

      expect(parsedPositional.errors).toEqual([]);
      expect(parsedNamed.errors).toEqual([]);
      expect(parsedNamed.args).toEqual(parsedPositional.args);

      const callArgs = [];
      const fakeFaker = {};
      setDeepMethod(fakeFaker, keyword.delegate.target, (...receivedArgs) => {
        callArgs.push(receivedArgs);
        return 'ok';
      });

      executeDomainKeyword(parsedPositional.keyword, { faker: fakeFaker, args: parsedPositional.args });
      executeDomainKeyword(parsedNamed.keyword, { faker: fakeFaker, args: parsedNamed.args });

      expect(callArgs).toHaveLength(2);
      expect(callArgs[1]).toEqual(callArgs[0]);
    });
  }
}

export { addDomainParamInvocationCoverageTests };
