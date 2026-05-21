import { JSDOM } from 'jsdom';

function installDomGlobals(html = '<!doctype html><html><body></body></html>') {
  const dom = new JSDOM(html, { pretendToBeVisual: true });
  global.window = dom.window;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;
  global.HTMLElement = dom.window.HTMLElement;
  global.Node = dom.window.Node;
  global.Event = dom.window.Event;
  global.CustomEvent = dom.window.CustomEvent;
  global.KeyboardEvent = dom.window.KeyboardEvent;
  global.MouseEvent = dom.window.MouseEvent;
  global.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
  dom.window.updateHelpHints = () => {};
  dom.window.tippy = { hideAll: () => {} };
  return dom;
}

function cleanupDomGlobals(dom) {
  dom?.window?.close?.();
  delete global.window;
  delete global.document;
  delete global.navigator;
  delete global.HTMLElement;
  delete global.Node;
  delete global.Event;
  delete global.CustomEvent;
  delete global.KeyboardEvent;
  delete global.MouseEvent;
  delete global.getComputedStyle;
}

export { installDomGlobals, cleanupDomGlobals };
