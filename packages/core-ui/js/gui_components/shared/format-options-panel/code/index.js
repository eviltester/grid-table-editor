import { csharpDefinition } from './csharp-definition.js';
import { javaDefinition } from './java-definition.js';
import { javascriptDefinition } from './javascript-definition.js';
import { kotlinDefinition } from './kotlin-definition.js';
import { perlDefinition } from './perl-definition.js';
import { phpDefinition } from './php-definition.js';
import { pythonDefinition } from './python-definition.js';
import { rubyDefinition } from './ruby-definition.js';
import { typescriptDefinition } from './typescript-definition.js';

const CODE_FORMAT_ORDER = ['csharp', 'java', 'javascript', 'kotlin', 'perl', 'php', 'python', 'ruby', 'typescript'];

const CODE_FORMAT_OPTION_DEFINITIONS = {
  csharp: csharpDefinition,
  java: javaDefinition,
  javascript: javascriptDefinition,
  kotlin: kotlinDefinition,
  perl: perlDefinition,
  php: phpDefinition,
  python: pythonDefinition,
  ruby: rubyDefinition,
  typescript: typescriptDefinition,
};

export { CODE_FORMAT_OPTION_DEFINITIONS, CODE_FORMAT_ORDER };
