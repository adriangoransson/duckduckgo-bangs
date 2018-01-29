const { domvm } = window;
const el = domvm.defineElement;

function save(settings) {
  browser.storage.sync.set({ settings });
}

function restore() {
  return browser.storage.sync.get('settings');
}

const defaultData = {
  newTab: true,
  bangs: [
    {
      display: 'DuckDuckGo',
      bang: '',
    },
    {
      display: 'DuckDuckGo (I feel ducky)',
      bang: '!',
    },
    {
      display: 'Google',
      bang: '!g',
    },
    {
      display: 'Wikipedia',
      bang: '!w',
    },
  ],
};

function ListView(vm, data) {
  const settings = data;

  function toggleNewTab() {
    settings.newTab = !settings.newTab;
    save(settings);
  }

  function delItem(i) {
    settings.bangs.splice(i, 1);
    save(settings);
    vm.redraw();
  }

  function addItem() {
    const display = vm.refs.newDisplay.el;
    const bang = vm.refs.newBang.el;

    if (display.value !== '') {
      settings.bangs.push({ display: display.value, bang: bang.value });
      display.value = '';
      bang.value = '';
      save(settings);
      vm.redraw();
    }
  }

  function updateItem(i, bang, display) {
    settings.bangs[i] = { bang, display };
    save(settings);
    vm.redraw();
  }

  function updateDisplay(i, bang, e, node) {
    updateItem(i, bang, node.el.value);
  }

  function updateBang(i, display, e, node) {
    updateItem(i, node.el.value, display);
  }

  return () =>
    el('div', [
      el('h2', 'Preferences'),

      el('p.browser-style', [
        el('input#new-tab', { type: 'checkbox', checked: data.newTab, onchange: [toggleNewTab] }),
        el('label', { for: 'new-tab' }, 'Open search in new tab'),
      ]),

      el('h2', 'DuckDuckGo bangs'),

      el('table', [
        el('tr', [
          el('th', 'Display Name'),
          el('th', 'DDG Bang'),
          el('th', 'Action'),
        ]),

        settings.bangs.map((item, i) => el('tr', [
          el('td.browser-style', [
            el('input', { value: item.display, onkeyup: [updateDisplay, i, item.bang] }),
          ]),
          el('td.browser-style', [
            el('input', { value: item.bang, onkeyup: [updateBang, i, item.display] }),
          ]),
          el('td', [
            el('button.browser-style', { onclick: [delItem, i] }, 'Remove'),
          ]),
        ])),

        el('tr', [
          el('td.browser-style', [
            el('input', { _ref: 'newDisplay' }),
          ]),
          el('td.browser-style', [
            el('input', { _ref: 'newBang' }),
          ]),
          el('td', [
            el('button.browser-style', { onclick: addItem }, 'Add'),
          ]),
        ]),
      ]),
    ]);
}

restore().then((data) => {
  let settings;
  if (Object.prototype.hasOwnProperty.call(data, 'settings')) {
    ({ settings } = data);
  } else {
    settings = defaultData;
  }

  domvm.createView(ListView, settings).mount(document.body);
});
