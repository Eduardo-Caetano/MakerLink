// Testes de comportamento sem dependências. O DOM simulado não substitui a revisão visual.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const sessionKey = 'makerlink.session.v1';
const accountsKey = 'makerlink.accounts.v1';

function boot(storage = new Map(), blocked = false) {
  const elements = new Map();
  const listeners = {};
  function element(id) {
    if (!elements.has(id)) elements.set(id, {
      id, value: '', checked: false, textContent: '', innerHTML: '', hidden: false, type: 'password', dataset: {}, attributes: {},
      setAttribute(key, value) { this.attributes[key] = value; },
      removeAttribute(key) { delete this.attributes[key]; },
      classList: { toggle() {}, contains() { return false; } },
      focus() { this.focused = true; },
      reset() {}, addEventListener() {}, replaceChildren() {},
      querySelector(selector) { return element(`${id} ${selector}`); },
      querySelectorAll() { return []; },
      showModal() { this.open = true; }, close() { this.open = false; }
    });
    return elements.get(id);
  }
  const context = {
    Date, console, setTimeout() {}, clearTimeout() {},
    localStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem(key, value) { if (blocked) throw Error('Storage unavailable'); storage.set(key, value); },
      removeItem: key => storage.delete(key)
    },
    location: { hash: '', reload() {} },
    document: {
      getElementById: element, querySelector: element, querySelectorAll() { return []; },
      addEventListener(type, handler) { listeners[`document:${type}`] = handler; },
      createElement() { return {}; }, activeElement: { tagName: 'BODY' }
    },
    window: { matchMedia() { return { addEventListener() {} }; }, scrollTo() {}, addEventListener(type, handler) { listeners[type] = handler; } }
  };
  context.history = { replaceState(a, b, hash) { context.location.hash = hash; } };
  vm.createContext(context);
  for (const file of ['data.js', 'auth.js', 'onboarding.js', 'content.js', 'feed.js', 'profiles.js', 'app.js']) vm.runInContext(fs.readFileSync(path.join(root, 'js', file), 'utf8'), context);
  const auth = context.window.MakerLinkAuth;
  const submit = id => auth.submit({ target: element(id), preventDefault() {} }, message => { context.feedback = message; });
  const click = (selector, target = {}) => auth.click({ target: { closest: value => value === selector ? target : null } }, message => { context.feedback = message; }, (title, text) => { context.modal = { title, text }; });
  return { context, auth, element, submit, click, storage, navigate(route) { context.location.hash = `#${route}`; listeners.hashchange(); } };
}
function registration(app, overrides = {}) {
  const values = { 'full-name': 'Ana Maker', username: 'ana_maker', email: 'ana@example.com', password: 'Maker123!', 'confirm-password': 'Maker123!', ...overrides };
  Object.entries(values).forEach(([key, value]) => { app.element(key).value = value; });
  app.element('terms').checked = true;
  app.element('privacy').checked = true;
}


module.exports = { boot, registration };
