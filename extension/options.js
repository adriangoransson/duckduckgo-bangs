/* eslint-disable no-use-before-define, no-param-reassign */
const { lighterhtml: { render, html } } = window;

function save(settings) {
  browser.storage.sync.set({ settings });
}

function restore() {
  return browser.storage.sync.get('settings');
}

restore().then(({ settings }) => {
  options(document.body, settings);
});

function options(node, settings) {
  const { length } = settings.bangs;
  const rerender = () => options(node, settings);

  render(node, html`
    <h2>Behaviour</h2>

    <table>
      <tr>
        <td>
          <label for="check-new-tab">
            Open search in new tab
          </label>
          </td>
          <td>
            <input checked=${settings.newTab} onchange=${toggleNewTab} id="check-new-tab" type="checkbox">
          </td>
      </tr>

      <tr>
        <td>
          <label for="check-tab-background">
            ↪ Open new tab in background
          </label>
          </td>
          <td>
            <input checked=${settings.backgroundTab} onchange=${toggleBackgroundTab} id="check-tab-background" type="checkbox">
          </td>
      </tr>
    </table>

    <h2>Context menu bangs</h2>

    <table>
      <tr>
        <th>Display name</th>
        <th>DDG bang</th>
      </tr>

      ${settings.bangs.map(({ display, bang }, i) => html`
        <tr>
          <td><input oninput=${(e) => update(i, 'display', e.target.value)} value=${display} required></td>
          <td><input oninput=${(e) => update(i, 'bang', e.target.value)} value=${bang}></td>
          <td><button onclick=${() => moveUp(i)} disabled=${i === 0}>⬆</button></td>
          <td><button onclick=${() => moveDown(i)} disabled=${i === length - 1}>⬇</button></td>
          <td><button disabled=${length === 1} onclick=${() => remove(i)}>Remove</button></td>
        </tr>
      `)}

    </table>

    <p>
      <button onclick=${add}>Add</button>
    </p>
  `);

  function toggleNewTab() {
    settings.newTab = !settings.newTab;
    rerender();
  }

  function toggleBackgroundTab() {
    settings.backgroundTab = !settings.backgroundTab;
    rerender();
  }

  function update(i, key, value) {
    settings.bangs[i][key] = value;
    rerender();
  }

  function move(oldIndex, newIndex) {
    const temp = settings.bangs[oldIndex];
    settings.bangs[oldIndex] = settings.bangs[newIndex];
    settings.bangs[newIndex] = temp;
    rerender();
  }

  function moveUp(i) {
    move(i, i - 1);
  }

  function moveDown(i) {
    move(i, i + 1);
  }

  function remove(i) {
    settings.bangs.splice(i, 1);
    rerender();
  }

  function add() {
    const bangs = settings.bangs.filter(({ display }) => display);
    bangs.push({ display: '', bang: '' });

    settings.bangs = bangs;
    rerender();
  }

  // Save on every render
  save(settings);
}
