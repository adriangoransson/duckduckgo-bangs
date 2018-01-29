const ID_PREFIX = 'ddg-bangs';
const URL = 'https://duckduckgo.com/?q=';

let bangs;
let newTab;

function search(info) {
  if (info.menuItemId.startsWith(ID_PREFIX)) {
    const url = `${URL + info.menuItemId.substr(ID_PREFIX.length + 1)} ${encodeURIComponent(info.selectionText.trim())}`;
    if (newTab) {
      browser.tabs.create({ url });
    } else {
      browser.tabs.update({ url });
    }
  }
}

function createMenus() {
  browser.contextMenus.removeAll();
  bangs.forEach((element) => {
    browser.contextMenus.create({
      id: `${ID_PREFIX}-${element.bang}`,
      title: element.display,
      contexts: ['selection'],
    });

    if (!browser.contextMenus.onClicked.hasListener(search)) {
      browser.contextMenus.onClicked.addListener(search);
    }
  });
}

function getSettings() {
  browser.storage.sync.get('settings').then((data) => {
    if (Object.prototype.hasOwnProperty.call(data, 'settings')) {
      ({ newTab, bangs } = data.settings);

      createMenus();
    }
  });
}

getSettings();
browser.storage.onChanged.addListener(getSettings);
