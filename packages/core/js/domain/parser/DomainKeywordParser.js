import { getDomainKeywordByAlias } from '../domain-keywords.js';
import { ArgumentParser } from './ArgumentParser.js';

class DomainKeywordParser {
  parseKeywordInvocation(rawValue) {
    const value = String(rawValue || '').trim();
    if (!value) {
      return { keyword: '', args: [], errors: ['Keyword invocation is required'] };
    }

    const openIndex = value.indexOf('(');
    const closeIndex = value.lastIndexOf(')');

    if (openIndex === -1 && closeIndex !== -1) {
      return { keyword: '', args: [], errors: ['Invalid keyword invocation: missing opening parenthesis'] };
    }
    if (openIndex !== -1 && closeIndex === -1) {
      return { keyword: '', args: [], errors: ['Invalid keyword invocation: missing closing parenthesis'] };
    }
    if (openIndex !== -1 && closeIndex !== -1 && closeIndex < openIndex) {
      return { keyword: '', args: [], errors: ['Invalid keyword invocation: missing opening parenthesis'] };
    }

    let keyword = value;
    let args = [];

    if (openIndex !== -1) {
      const trailing = value.slice(closeIndex + 1).trim();
      if (trailing.length > 0) {
        return { keyword: '', args: [], errors: ['Invalid keyword invocation: unexpected trailing content'] };
      }

      keyword = value.slice(0, openIndex).trim();
      if (!keyword) {
        return { keyword: '', args: [], errors: ['Invalid keyword invocation: missing keyword'] };
      }

      const argsBody = value.slice(openIndex + 1, closeIndex);
      if (argsBody.trim().length > 0) {
        const parseResult = this.parseArgumentList(argsBody);
        if (!parseResult.ok) {
          return { keyword, args: [], errors: [parseResult.error] };
        }

        const keywordMetadata = getDomainKeywordByAlias(keyword);
        const mappedResult = this.mapParsedArguments(parseResult.arguments, keywordMetadata);
        if (!mappedResult.ok) {
          if (!keywordMetadata) {
            return { keyword, args: [], errors: [`Unknown keyword: ${keyword}`] };
          }
          return { keyword, args: [], errors: [mappedResult.error] };
        }
        args = mappedResult.args;
      }
    }

    if (!getDomainKeywordByAlias(keyword)) {
      return { keyword, args, errors: [`Unknown keyword: ${keyword}`] };
    }

    return { keyword, args, errors: [] };
  }

  parseArgumentList(source) {
    const parser = new ArgumentParser(source);
    return parser.parse();
  }

  mapParsedArguments(argumentsList, keywordMetadata) {
    const schema = Array.isArray(keywordMetadata?.help?.args) ? keywordMetadata.help.args : [];
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

    if (Object.keys(named).length === 0) {
      return { ok: true, args: positional };
    }

    if (positional.length > schema.length) {
      return {
        ok: false,
        error: `Invalid keyword arguments: too many positional arguments. Expected at most ${schema.length}, received ${positional.length}`,
      };
    }

    const schemaByName = new Map(schema.map((entry, index) => [entry.name, index]));
    const resolved = new Array(schema.length);

    for (let index = 0; index < positional.length; index += 1) {
      resolved[index] = positional[index];
    }

    for (const [name, value] of Object.entries(named)) {
      if (!schemaByName.has(name)) {
        return { ok: false, error: `Invalid keyword arguments: unknown named argument "${name}"` };
      }
      const schemaIndex = schemaByName.get(name);
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
}

export { DomainKeywordParser };
