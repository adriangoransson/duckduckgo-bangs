const URL = 'https://duckduckgo.com/?q=';

const defaultSettings = {
  newTab: true,
  backgroundTab: false,
  bangs: [
    {
      display: 'DuckDuckGo',
      bang: '',
    },
    {
      display: 'DuckDuckGo (I am feeling ducky)',
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

function search(query, { newTab, backgroundTab, bang }) {
  const url = `${URL}${encodeURIComponent(`${bang} ${query}`)}`;

  if (newTab) {
    browser.tabs.create({ url, active: !backgroundTab });
  } else {
    browser.tabs.update({ url });
  }
}

function createMenus({ newTab, backgroundTab, bangs }) {
  browser.contextMenus.removeAll();

  bangs.forEach(({ display, bang }) => {
    browser.contextMenus.create({
      title: display,
      contexts: ['selection'],
      onclick(e) {
        search(e.selectionText.trim(), { newTab, backgroundTab, bang });
      },
    });
  });
}

function create() {
  browser.storage.sync.get('settings').then((data) => {
    if (Object.prototype.hasOwnProperty.call(data, 'settings')) {
      createMenus(data.settings);
    }
  });
}

create();
browser.storage.onChanged.addListener(create);

browser.runtime.onInstalled.addListener(async ({ reason }) => {
  // first run
  if (reason === 'install') {
    await browser.storage.sync.set({ settings: defaultSettings });

    browser.runtime.openOptionsPage();
  }
});
