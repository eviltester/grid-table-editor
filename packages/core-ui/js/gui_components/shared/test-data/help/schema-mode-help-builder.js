function buildSchemaModeHelpHtml({ inTextMode, supplementalLinkUrl = '', supplementalLinkText = '' } = {}) {
  const trimmedSupplementalLinkUrl = String(supplementalLinkUrl || '').trim();
  const trimmedSupplementalLinkText = String(supplementalLinkText || '').trim();

  if (inTextMode) {
    return `
      <p><strong>Edit as Schema</strong></p>
      <p>You are currently editing as text. Click <strong>Edit as Schema</strong> to return to row-based editing.</p>
      <p>Text schema uses name/rule pairs, for example:</p>
      <pre>First Name
person.firstName

Status
active,inactive,pending</pre>
      <button type="button" class="shared-schema-sample-button">Insert Example Schema</button>
    `;
  }

  const supplementalLinkHtml =
    trimmedSupplementalLinkUrl && trimmedSupplementalLinkText
      ? `<p><a class="helplink" href="${trimmedSupplementalLinkUrl}" target="_blank" rel="noopener noreferrer">${trimmedSupplementalLinkText}</a></p>`
      : '';

  return `
    <p><strong>Edit as Text</strong></p>
    <p>You are currently using row-based schema editing. Click <strong>Edit as Text</strong> to switch to text schema mode.</p>
    ${supplementalLinkHtml}
    <button type="button" class="shared-schema-sample-button">Insert Example Schema</button>
  `;
}

export { buildSchemaModeHelpHtml };
