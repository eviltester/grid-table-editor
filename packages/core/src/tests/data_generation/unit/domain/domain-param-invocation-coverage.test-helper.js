import { DOMAIN_KEYWORDS, executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../js/domain/domain-keyword-parser.js';
import { sampleValueForKeywordArg, valueToInvocationLiteral } from './domain-keyword-sample-values.test-helper.js';

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
