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
      schemaDefinitionRootId: props.schemaDefinitionRootId || props.ids?.schemaDefinitionRoot || '',
      schemaDefinitionProps: props.schemaDefinitionProps || {},
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
      schemaDefinitionRootId:
        nextProps.schemaDefinitionRootId ?? nextProps.ids?.schemaDefinitionRoot ?? this.state.schemaDefinitionRootId,
      schemaDefinitionProps: nextProps.schemaDefinitionProps
        ? { ...this.state.schemaDefinitionProps, ...nextProps.schemaDefinitionProps }
        : this.state.schemaDefinitionProps,
      useTimedSchemaErrorDisplay: nextProps.useTimedSchemaErrorDisplay ?? this.state.useTimedSchemaErrorDisplay,
      schemaErrorTimeoutMs: nextProps.schemaErrorTimeoutMs ?? this.state.schemaErrorTimeoutMs,
    };
  }

  getState() {
    return {
      ...this.state,
      schemaDefinitionProps: { ...this.state.schemaDefinitionProps },
    };
  }
}

export { SchemaPanelController };
