class SchemaPanelController {
  constructor({ props = {} } = {}) {
    this.state = {
      className: props.className || 'shared-schema-panel',
      sectionId: props.sectionId || '',
      sectionOrder: props.sectionOrder || '',
      ariaLabel: props.ariaLabel || '',
      ariaLabelledBy: props.ariaLabelledBy || '',
      rootDataRole: props.rootDataRole || 'schema-panel-root',
      schemaDefinitionRootDataRole: props.schemaDefinitionRootDataRole || 'schema-definition-root',
      storedSchemasRootDataRole: props.storedSchemasRootDataRole || 'stored-schemas-manager-root',
      schemaDefinitionRootId: props.schemaDefinitionRootId || props.ids?.schemaDefinitionRoot || '',
      schemaDefinitionProps: props.schemaDefinitionProps || {},
      storedSchemasEnabled: props.storedSchemasEnabled === true,
      storedSchemasProps: props.storedSchemasProps || {},
      useTimedSchemaErrorDisplay: props.useTimedSchemaErrorDisplay === true,
      schemaErrorTimeoutMs: props.schemaErrorTimeoutMs || 5000,
    };
  }

  updateProps(nextProps = {}) {
    this.state = {
      ...this.state,
      className: nextProps.className ?? this.state.className,
      sectionId: nextProps.sectionId ?? this.state.sectionId,
      sectionOrder: nextProps.sectionOrder ?? this.state.sectionOrder,
      ariaLabel: nextProps.ariaLabel ?? this.state.ariaLabel,
      ariaLabelledBy: nextProps.ariaLabelledBy ?? this.state.ariaLabelledBy,
      rootDataRole: nextProps.rootDataRole ?? this.state.rootDataRole,
      schemaDefinitionRootDataRole: nextProps.schemaDefinitionRootDataRole ?? this.state.schemaDefinitionRootDataRole,
      storedSchemasRootDataRole: nextProps.storedSchemasRootDataRole ?? this.state.storedSchemasRootDataRole,
      schemaDefinitionRootId:
        nextProps.schemaDefinitionRootId ?? nextProps.ids?.schemaDefinitionRoot ?? this.state.schemaDefinitionRootId,
      schemaDefinitionProps: nextProps.schemaDefinitionProps
        ? { ...this.state.schemaDefinitionProps, ...nextProps.schemaDefinitionProps }
        : this.state.schemaDefinitionProps,
      storedSchemasEnabled: nextProps.storedSchemasEnabled ?? this.state.storedSchemasEnabled,
      storedSchemasProps: nextProps.storedSchemasProps
        ? { ...this.state.storedSchemasProps, ...nextProps.storedSchemasProps }
        : this.state.storedSchemasProps,
      useTimedSchemaErrorDisplay: nextProps.useTimedSchemaErrorDisplay ?? this.state.useTimedSchemaErrorDisplay,
      schemaErrorTimeoutMs: nextProps.schemaErrorTimeoutMs ?? this.state.schemaErrorTimeoutMs,
    };
  }

  getState() {
    return {
      ...this.state,
      schemaDefinitionProps: { ...this.state.schemaDefinitionProps },
      storedSchemasProps: { ...this.state.storedSchemasProps },
    };
  }
}

export { SchemaPanelController };
