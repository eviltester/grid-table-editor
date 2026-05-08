import { generateFromTextSpec, streamFromTextSpec, SUPPORTED_FORMATS } from '@anywaydata/core';

function writeLine(output, text = '') {
  output(`${text}\n`);
}

export async function runCliCommand({ options, platform }) {
  const progress = (message) => {
    if (options.showProgress) {
      writeLine(platform.stdout, message);
    }
  };

  if (!SUPPORTED_FORMATS.includes(options.format)) {
    writeLine(platform.stderr, `outputFormat must be one of: ${SUPPORTED_FORMATS.join(', ')}`);
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
  if (options.testMode) {
    progress('> Operating in Test Mode - generating 1 entry');
  }

  if (options.shouldStream && (options.format === 'csv' || options.format === 'jsonl')) {
    const streamedLines = [];
    const writer = options.outputFile ? platform.createLineWriter(options.outputFile) : null;
    let writerClosed = false;
    try {
      const streamResult = await streamFromTextSpec({
        textSpec,
        rowCount: options.rowCount,
        outputFormat: options.format,
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
        writeLine(platform.stderr, streamResult.errors.join('\n'));
        return 1;
      }

      progress(streamResult.diagnostics.report);
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
    outputFormat: options.format,
    unsafeFakerExpressions: options.unsafeFakerExpressions,
  });

  if (!result.ok) {
    writeLine(platform.stderr, result.errors.join('\n'));
    return 1;
  }

  progress(result.diagnostics.report);
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
