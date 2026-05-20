/*
 * Responsibilities:
 * - Applies test-data grid editor layout sizing and spacing.
 * - Keeps controller focused on flow rather than DOM style mutation.
 */

function applyTestDataGridLayout({ gridDiv, textEdit, zone, hasGridApi }) {
  const editorPaneHeight = '220px';
  gridDiv.style.height = editorPaneHeight;
  gridDiv.style.width = '70%';

  textEdit.style.width = hasGridApi ? '30%' : '100%';
  textEdit.style.paddingTop = '0';
  textEdit.style.height = editorPaneHeight;
  textEdit.style.display = 'flex';
  textEdit.style.flexDirection = 'column';

  const textHeading = textEdit.querySelector('p');
  if (textHeading) {
    textHeading.style.margin = '0 0 0.4rem 0';
  }

  const textArea = textEdit.querySelector('textarea');
  if (textArea) {
    textArea.style.flex = '1';
    textArea.style.width = '100%';
    textArea.style.height = '100%';
    textArea.style.boxSizing = 'border-box';
  }

  zone.style.height = editorPaneHeight;
  zone.style.display = 'flex';
  zone.style.alignItems = 'flex-start';
  zone.style.gap = '0.75rem';
}

export { applyTestDataGridLayout };
