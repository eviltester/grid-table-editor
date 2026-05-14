import {
  amendFromTextSpecAndData,
  generateFromTextSpec,
  streamFromTextSpec,
  SUPPORTED_FORMATS,
} from '@anywaydata/core';
import { normalizeAndValidateFormat, sanitizeCliOptionsForFormat } from './format-options.js';

function writeLine(output, text = '') {
  output(`${text}\n`);
}

function formatCanonicalErrors(errors = []) {
  const safeErrors = Array.isArray(errors) ? errors : [];
  return safeErrors.map((error) => {
    if (!error || typeof error !== 'object') {
      return String(error ?? '');
    }
    const code = String(error.code || 'error');
    const message = String(error.message || '');
    const column = error.column != null ? ` column=${error.column}` : '';
    const line = Number.isInteger(error.line) ? ` line=${error.line}` : '';
    return `[${code}] ${message}${column}${line}`.trim();
  });
}

export async function runCliCommand({ options, platform }) {
  const progress = (message) => {
    if (options.showProgress) {
      writeLine(platform.stdout, message);
    }
  };

  const { format: normalizedFormat, isSupported } = normalizeAndValidateFormat(options.format);
  if (!isSupported) {
    writeLine(platform.stderr, `outputFormat must be one of: ${SUPPORTED_FORMATS.join(', ')}`);
    return 1;
  }
  const outputFormat = normalizedFormat;
  const formatterOptions = sanitizeCliOptionsForFormat(outputFormat, options.formatOptions);

  if (!options.inputFile) {
    writeLine(platform.stderr, 'Missing required argument: input file (use -i or --schema-file)');
    return 1;
  }

  if (options.command === 'amend') {
    if (!options.dataFile) {
      writeLine(platform.stderr, 'Missing required argument: --data-file');
      return 1;
    }
    if (!options.inputFormat) {
      writeLine(platform.stderr, 'Missing required argument: --input-format');
      return 1;
    }
  } else if (!Number.isInteger(options.rowCount) || options.rowCount < 0) {
    writeLine(platform.stderr, 'Missing required argument: -n/--numberOfLines');
    return 1;
  }

  let textSpec = '';
  try {
    textSpec = await platform.readText(options.inputFile);
  } catch (error) {
    writeLine(platform.stderr, `Unable to read input file: ${error.message}`);
    return 1;
  }

  progress(`> Processing Input File ${options.inputFile}`);
  if (options.command === 'amend') {
    let inputData = '';
    try {
      inputData = await platform.readText(options.dataFile);
    } catch (error) {
      writeLine(platform.stderr, `Unable to read data file: ${error.message}`);
      return 1;
    }

    if (options.shouldStream || options.pairwise) {
      progress('WARNING: Streaming and pairwise flags are ignored for amend mode.');
    }

    const result = amendFromTextSpecAndData({
      textSpec,
      inputData,
      inputFormat: options.inputFormat,
      rowCount: options.rowCount,
      outputFormat,
      options: formatterOptions,
      unsafeFakerExpressions: options.unsafeFakerExpressions,
      stream: options.shouldStream,
    });

    if (!result.ok) {
      writeLine(platform.stderr, formatCanonicalErrors(result.errors).join('\n'));
      return 1;
    }

    if (Array.isArray(result.diagnostics?.warnings)) {
      for (const warning of result.diagnostics.warnings) {
        progress(`WARNING: ${warning}`);
      }
    }
    if (options.outputFile) {
      await platform.writeText(options.outputFile, result.rendered);
      progress(`> Writing output to ${options.outputFile}`);
    } else {
      platform.stdout(`${result.rendered}\n`);
    }
    return 0;
  }

  if (options.testMode) {
    progress('> Operating in Test Mode - generating 1 entry');
  }
  const useStreamMode = options.shouldStream && !options.pairwise;
  if (options.pairwise && options.shouldStream) {
    if (options.testMode) {
      progress('WARNING: Streaming is ignored when pairwise generation is enabled; using buffered mode.');
    }
  }

  if (useStreamMode && ['csv', 'jsonl', 'dsv', 'json', 'xml'].includes(outputFormat)) {
    const streamedLines = [];
    const writer = options.outputFile ? platform.createLineWriter(options.outputFile) : null;
    let writerClosed = false;
    try {
      const streamResult = await streamFromTextSpec({
        textSpec,
        rowCount: options.rowCount,
        outputFormat,
        options: formatterOptions,
        pairwise: options.pairwise,
        unsafeFakerExpressions: options.unsafeFakerExpressions,
        onChunk: async (chunk) => {
          if (writer) {
            await writer.writeLine(chunk);
          } else {
            streamedLines.push(chunk);
          }
        },
      });

      if (!streamResult.ok) {
        writeLine(platform.stderr, formatCanonicalErrors(streamResult.errors).join('\n'));
        return 1;
      }

      progress(streamResult.diagnostics.report);
      if (Array.isArray(streamResult.diagnostics?.warnings)) {
        for (const warning of streamResult.diagnostics.warnings) {
          progress(`WARNING: ${warning}`);
        }
      }
      if (options.testMode && streamResult.diagnostics.firstRow) {
        progress('e.g.');
        progress(JSON.stringify(streamResult.diagnostics.firstRow));
      }

      if (writer) {
        await writer.close();
        writerClosed = true;
        progress(`> Wrote ${options.rowCount} lines to ${options.outputFile} using stream mode`);
      } else {
        platform.stdout(`${streamedLines.join('\n')}\n`);
      }
    } catch (error) {
      writeLine(platform.stderr, `Streaming generation failed: ${error.message}`);
      return 1;
    } finally {
      if (writer && !writerClosed) {
        try {
          await writer.close();
        } catch (_error) {
          // Ignore secondary close errors; primary failure is already reported.
        }
      }
    }

    return 0;
  }

  const result = generateFromTextSpec({
    textSpec,
    rowCount: options.rowCount,
    outputFormat,
    options: formatterOptions,
    pairwise: options.pairwise,
    unsafeFakerExpressions: options.unsafeFakerExpressions,
  });

  if (!result.ok) {
    writeLine(platform.stderr, formatCanonicalErrors(result.errors).join('\n'));
    return 1;
  }

  progress(result.diagnostics.report);
  if (Array.isArray(result.diagnostics.warnings)) {
    for (const warning of result.diagnostics.warnings) {
      progress(`WARNING: ${warning}`);
    }
  }
  if (options.testMode && result.rows.length > 0) {
    progress('e.g.');
    progress(JSON.stringify(result.rows[0]));
  }

  if (options.outputFile) {
    await platform.writeText(options.outputFile, result.rendered);
    progress(`> Writing output to ${options.outputFile}`);
  } else {
    platform.stdout(`${result.rendered}\n`);
  }

  return 0;
}
