import { buildDocsUrl } from '@anywaydata/site-config';

const DEFAULT_UNSAFE_FAKER_HELP_HTML = `<p>Allows expression-style Faker helper arguments such as functions in helper data objects. Example: <code>helpers.mustache("Hi {{name}}", { name: () => this.person.firstName() })</code>.</p><p>Only use schemas you trust. See <a href="${buildDocsUrl('test-data/faker/helpers')}">Faker Helpers</a>.</p>`;

class PopulationActionsController {
  constructor({ props = {}, callbacks = {} } = {}) {
    this.callbacks = callbacks;
    this.state = {
      pairwiseVisible: props.pairwiseVisible === true,
      generateBusy: props.generateBusy === true,
      generatePairwiseBusy: props.generatePairwiseBusy === true,
      generateSchemaBusy: props.generateSchemaBusy === true,
      generateLabel: props.generateLabel || 'Generate',
      generatePairwiseLabel: props.generatePairwiseLabel || 'Generate Pairwise',
      generateSchemaLabel: props.generateSchemaLabel || 'Grid to Enum Schema',
      generateHelpHtml: props.generateHelpHtml || '',
      generatePairwiseHelpHtml: props.generatePairwiseHelpHtml || '',
      generateSchemaHelpHtml: props.generateSchemaHelpHtml || '',
      generateHelpLabel: props.generateHelpLabel || 'Show generate help',
      generatePairwiseHelpLabel: props.generatePairwiseHelpLabel || 'Show pairwise generation help',
      generateSchemaHelpLabel: props.generateSchemaHelpLabel || 'Show grid to schema help',
      generateSchemaVisible: props.generateSchemaVisible !== false,
      unsafeFakerExpressionsVisible: props.unsafeFakerExpressionsVisible === true,
      unsafeFakerExpressions: props.unsafeFakerExpressions === true,
      unsafeFakerExpressionsLabel: props.unsafeFakerExpressionsLabel || 'allow unsafe faker',
      unsafeFakerExpressionsHelpHtml: props.unsafeFakerExpressionsHelpHtml || DEFAULT_UNSAFE_FAKER_HELP_HTML,
      unsafeFakerExpressionsHelpLabel: props.unsafeFakerExpressionsHelpLabel || 'Show unsafe Faker help',
      generationSettingsOpen: props.generationSettingsOpen === true,
      generationSettingsLabel: props.generationSettingsLabel || 'Generation settings',
      statusVisible: props.statusVisible === true,
      roleNames: {
        generateButton: props.roleNames?.generateButton || 'generate-button',
        generatePairwiseButton: props.roleNames?.generatePairwiseButton || 'generate-pairwise-button',
        generatePairwiseWrapper: props.roleNames?.generatePairwiseWrapper || 'generate-pairwise-button-wrapper',
        generateSchemaButton: props.roleNames?.generateSchemaButton || 'generate-schema-button',
        status: props.roleNames?.status || 'population-status',
      },
    };
  }

  updateProps(nextProps = {}) {
    this.state = {
      ...this.state,
      pairwiseVisible: nextProps.pairwiseVisible ?? this.state.pairwiseVisible,
      generateBusy: nextProps.generateBusy ?? this.state.generateBusy,
      generatePairwiseBusy: nextProps.generatePairwiseBusy ?? this.state.generatePairwiseBusy,
      generateSchemaBusy: nextProps.generateSchemaBusy ?? this.state.generateSchemaBusy,
      generateLabel: nextProps.generateLabel ?? this.state.generateLabel,
      generatePairwiseLabel: nextProps.generatePairwiseLabel ?? this.state.generatePairwiseLabel,
      generateSchemaLabel: nextProps.generateSchemaLabel ?? this.state.generateSchemaLabel,
      generateHelpHtml: nextProps.generateHelpHtml ?? this.state.generateHelpHtml,
      generatePairwiseHelpHtml: nextProps.generatePairwiseHelpHtml ?? this.state.generatePairwiseHelpHtml,
      generateSchemaHelpHtml: nextProps.generateSchemaHelpHtml ?? this.state.generateSchemaHelpHtml,
      generateHelpLabel: nextProps.generateHelpLabel ?? this.state.generateHelpLabel,
      generatePairwiseHelpLabel: nextProps.generatePairwiseHelpLabel ?? this.state.generatePairwiseHelpLabel,
      generateSchemaHelpLabel: nextProps.generateSchemaHelpLabel ?? this.state.generateSchemaHelpLabel,
      generateSchemaVisible: nextProps.generateSchemaVisible ?? this.state.generateSchemaVisible,
      unsafeFakerExpressionsVisible:
        nextProps.unsafeFakerExpressionsVisible ?? this.state.unsafeFakerExpressionsVisible,
      unsafeFakerExpressions: nextProps.unsafeFakerExpressions ?? this.state.unsafeFakerExpressions,
      unsafeFakerExpressionsLabel: nextProps.unsafeFakerExpressionsLabel ?? this.state.unsafeFakerExpressionsLabel,
      unsafeFakerExpressionsHelpHtml:
        nextProps.unsafeFakerExpressionsHelpHtml ?? this.state.unsafeFakerExpressionsHelpHtml,
      unsafeFakerExpressionsHelpLabel:
        nextProps.unsafeFakerExpressionsHelpLabel ?? this.state.unsafeFakerExpressionsHelpLabel,
      generationSettingsOpen: nextProps.generationSettingsOpen ?? this.state.generationSettingsOpen,
      generationSettingsLabel: nextProps.generationSettingsLabel ?? this.state.generationSettingsLabel,
      statusVisible: nextProps.statusVisible ?? this.state.statusVisible,
      roleNames: nextProps.roleNames
        ? {
            ...this.state.roleNames,
            ...nextProps.roleNames,
          }
        : this.state.roleNames,
    };
  }

  getState() {
    return { ...this.state };
  }

  handleGenerate() {
    this.callbacks.onGenerate?.();
  }

  handleGeneratePairwise() {
    this.callbacks.onGeneratePairwise?.();
  }

  handleGenerateSchemaFromGrid() {
    this.callbacks.onGenerateSchemaFromGrid?.();
  }

  handleUnsafeFakerExpressionsChange(isEnabled) {
    this.state = {
      ...this.state,
      unsafeFakerExpressions: isEnabled === true,
    };
    this.callbacks.onUnsafeFakerExpressionsChange?.(this.state.unsafeFakerExpressions);
  }

  toggleGenerationSettings() {
    this.state = {
      ...this.state,
      generationSettingsOpen: !this.state.generationSettingsOpen,
    };
  }

  closeGenerationSettings() {
    this.state = {
      ...this.state,
      generationSettingsOpen: false,
    };
  }
}

export { PopulationActionsController };
