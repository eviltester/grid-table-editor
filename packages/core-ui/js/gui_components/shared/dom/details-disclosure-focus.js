function setDetailsContentVisibility({ detailsElement, contentElement } = {}) {
  if (!detailsElement || !contentElement) {
    return;
  }

  if (detailsElement.open) {
    contentElement.removeAttribute('aria-hidden');
    contentElement.removeAttribute('inert');
    contentElement.inert = false;
    return;
  }

  contentElement.setAttribute('aria-hidden', 'true');
  contentElement.setAttribute('inert', '');
  contentElement.inert = true;
}

function bindDetailsContentVisibility({ detailsElement, contentElement } = {}) {
  setDetailsContentVisibility({ detailsElement, contentElement });

  if (!detailsElement) {
    return () => {};
  }

  const handleToggle = () => setDetailsContentVisibility({ detailsElement, contentElement });
  detailsElement.addEventListener('toggle', handleToggle);

  return () => {
    detailsElement.removeEventListener('toggle', handleToggle);
  };
}

export { bindDetailsContentVisibility, setDetailsContentVisibility };
