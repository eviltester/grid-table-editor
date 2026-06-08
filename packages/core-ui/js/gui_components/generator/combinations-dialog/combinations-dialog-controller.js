import {
  CombinationAlgorithm,
  getAvailableStrengths,
  getStrategiesForStrength,
  getStrategyById,
} from '../generation/n-wise-generation-options.js';

class CombinationsDialogController {
  constructor({ props = {}, callbacks = {} } = {}) {
    this.callbacks = callbacks;
    const enumColumnCount = Number.parseInt(props.enumColumnCount, 10) || 0;
    const enumValueCounts = Array.isArray(props.enumValueCounts) ? [...props.enumValueCounts] : [];
    const strengths = getAvailableStrengths(enumColumnCount);
    const selectedStrength = strengths.includes(props.selectedStrength) ? props.selectedStrength : strengths[0] || 2;
    const strategies = getStrategiesForStrength(selectedStrength, { valueCounts: enumValueCounts });
    const selectedAlgorithm = strategies.some((strategy) => strategy.id === props.selectedAlgorithm)
      ? props.selectedAlgorithm
      : strategies[0]?.id || CombinationAlgorithm.PAIRWISE;

    this.state = {
      open: false,
      enumColumnCount,
      enumValueCounts,
      strengths,
      selectedStrength,
      selectedAlgorithm,
      strategies,
    };
  }

  getState() {
    return {
      ...this.state,
      strengths: [...this.state.strengths],
      enumValueCounts: [...this.state.enumValueCounts],
      strategies: [...this.state.strategies],
    };
  }

  open(props = {}) {
    const enumColumnCount = Number.parseInt(props.enumColumnCount ?? this.state.enumColumnCount, 10) || 0;
    const enumValueCounts = Array.isArray(props.enumValueCounts)
      ? [...props.enumValueCounts]
      : this.state.enumValueCounts;
    const strengths = getAvailableStrengths(enumColumnCount);
    const requestedStrength = Number.parseInt(props.selectedStrength ?? this.state.selectedStrength, 10);
    const selectedStrength = strengths.includes(requestedStrength) ? requestedStrength : strengths[0] || 2;
    const strategies = getStrategiesForStrength(selectedStrength, { valueCounts: enumValueCounts });
    const requestedAlgorithm = props.selectedAlgorithm ?? this.state.selectedAlgorithm;
    const selectedAlgorithm = strategies.some((strategy) => strategy.id === requestedAlgorithm)
      ? requestedAlgorithm
      : strategies[0]?.id || CombinationAlgorithm.PAIRWISE;

    this.state = {
      open: true,
      enumColumnCount,
      enumValueCounts,
      strengths,
      selectedStrength,
      selectedAlgorithm,
      strategies,
    };
  }

  close() {
    this.state.open = false;
    this.callbacks.onCancel?.();
  }

  setStrength(strength) {
    const parsedStrength = Number.parseInt(strength, 10);
    if (!this.state.strengths.includes(parsedStrength)) {
      return;
    }
    const strategies = getStrategiesForStrength(parsedStrength, { valueCounts: this.state.enumValueCounts });
    const selectedAlgorithm = strategies.some((strategy) => strategy.id === this.state.selectedAlgorithm)
      ? this.state.selectedAlgorithm
      : strategies[0]?.id || CombinationAlgorithm.PAIRWISE;
    this.state.selectedStrength = parsedStrength;
    this.state.strategies = strategies;
    this.state.selectedAlgorithm = selectedAlgorithm;
  }

  setAlgorithm(algorithm) {
    if (this.state.strategies.some((strategy) => strategy.id === algorithm)) {
      this.state.selectedAlgorithm = algorithm;
    }
  }

  getSelectedStrategy() {
    return getStrategyById(this.state.selectedAlgorithm);
  }

  submit() {
    if (!this.state.strengths.includes(this.state.selectedStrength)) {
      return;
    }
    this.state.open = false;
    this.callbacks.onSubmit?.({
      strength: this.state.selectedStrength,
      algorithm: this.state.selectedAlgorithm,
    });
  }
}

export { CombinationsDialogController };
