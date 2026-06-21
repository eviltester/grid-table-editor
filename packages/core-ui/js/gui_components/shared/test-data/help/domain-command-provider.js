/*
 * Responsibilities:
 * - Re-export the shared metadata-driven domain command visibility helpers for UI consumers.
 */

import {
  isDomainCommandVisibleByDefault,
  getVisibleDomainCommands,
} from '@anywaydata/core/domain/domain-command-visibility.js';

export { isDomainCommandVisibleByDefault, getVisibleDomainCommands };
