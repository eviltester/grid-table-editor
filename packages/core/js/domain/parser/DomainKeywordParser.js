import { getDomainKeywordByAlias } from '../domain-keywords.js';
import { DomainKeywordInvocationParser } from './DomainKeywordInvocationParser.js';

class DomainKeywordParser {
  constructor() {
    this.invocationParser = new DomainKeywordInvocationParser();
  }

  parseKeywordInvocation(rawValue) {
    const value = String(rawValue || '').trim();
    if (!value) {
      return { keyword: '', args: [], errors: ['Keyword invocation is required'] };
    }

    const parsed = this.invocationParser.parse(value);
    if (!parsed.ok) {
      return {
        keyword: String(parsed?.keyword || '').trim(),
        args: [],
        errors: [parsed.error],
      };
    }

    const keyword = parsed.keyword;
    const keywordMetadata = getDomainKeywordByAlias(keyword);
    const mappedResult = this.mapParsedArguments(parsed.arguments, keywordMetadata);

    if (!mappedResult.ok) {
      if (!keywordMetadata) {
        return { keyword, args: [], errors: [`Unknown keyword: ${keyword}`] };
      }
      return { keyword, args: [], errors: [mappedResult.error] };
    }

    if (!keywordMetadata) {
      return { keyword, args: mappedResult.args, errors: [`Unknown keyword: ${keyword}`] };
    }

    return { keyword, args: mappedResult.args, errors: [] };
  }

  mapParsedArguments(argumentsList, keywordMetadata) {
    const schema = Array.isArray(keywordMetadata?.help?.args) ? keywordMetadata.help.args : [];
    const variadicIndex = schema.findIndex((entry) => entry?.variadic === true);
    const hasVariadicTail = variadicIndex >= 0 && variadicIndex === schema.length - 1;
    const usesOptionsFromHelpArgs = keywordMetadata?.delegate?.argTransform === 'optionsFromHelpArgs';
    const positional = [];
    const named = {};
    let seenNamed = false;

    for (const item of argumentsList) {
      if (item.kind === 'named') {
        seenNamed = true;
        if (Object.prototype.hasOwnProperty.call(named, item.name)) {
          return { ok: false, error: `Invalid keyword arguments: duplicate named argument "${item.name}"` };
        }
        named[item.name] = item.value;
        continue;
      }

      if (seenNamed) {
        return {
          ok: false,
          error: 'Invalid keyword arguments: positional arguments must come before named arguments',
        };
      }

      positional.push(item.value);
    }

    if (
      keywordMetadata &&
      usesOptionsFromHelpArgs &&
      positional.length === 1 &&
      Object.keys(named).length === 0 &&
      positional[0] &&
      typeof positional[0] === 'object' &&
      !Array.isArray(positional[0])
    ) {
      const providedObject = positional[0];
      const schemaByName = new Map(schema.map((entry, index) => [entry.name, index]));
      const resolved = new Array(schema.length);

      for (const [name, value] of Object.entries(providedObject)) {
        if (!schemaByName.has(name)) {
          return { ok: false, error: `Invalid keyword arguments: unknown named argument "${name}"` };
        }
        resolved[schemaByName.get(name)] = value;
      }

      return { ok: true, args: resolved };
    }

    if (keywordMetadata && !hasVariadicTail && positional.length > schema.length) {
      return {
        ok: false,
        error: `Invalid keyword arguments: too many positional arguments. Expected at most ${schema.length}, received ${positional.length}`,
      };
    }

    if (Object.keys(named).length === 0) {
      return { ok: true, args: positional };
    }

    const schemaByName = new Map(schema.map((entry, index) => [entry.name, index]));
    const resolved = new Array(schema.length);

    for (let index = 0; index < positional.length; index += 1) {
      resolved[index] = positional[index];
    }

    for (const [name, value] of Object.entries(named)) {
      const schemaIndex = this.resolveNamedArgumentIndex(name, schemaByName, keywordMetadata);
      if (schemaIndex < 0) {
        return { ok: false, error: `Invalid keyword arguments: unknown named argument "${name}"` };
      }

      if (typeof resolved[schemaIndex] !== 'undefined') {
        return {
          ok: false,
          error: `Invalid keyword arguments: argument "${name}" is already set by positional value`,
        };
      }

      resolved[schemaIndex] = value;
    }

    return { ok: true, args: resolved };
  }

  resolveNamedArgumentIndex(name, schemaByName, keywordMetadata) {
    if (schemaByName.has(name)) {
      return schemaByName.get(name);
    }
    if (keywordMetadata?.keyword === 'datatype.enum' && name === 'csv' && schemaByName.has('values')) {
      return schemaByName.get('values');
    }
    return -1;
  }
}

export { DomainKeywordParser };
