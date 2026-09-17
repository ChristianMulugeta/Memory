const fs = require('node:fs');
const html = fs.readFileSync('dist/index.html', 'utf8');
const check = `
window.addEventListener('load', async () => {
  const results = [];
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const find = selector => document.querySelector(selector);
  const cards = () => [...document.querySelectorAll('#game-board .memory-card')];
  const motif = card => card.querySelector('img')?.getAttribute('src') || card.querySelector('.memory-card__front').textContent;
  const choose = (name, value) => { const input = find('input[name="' + name + '"][value="' + value + '"]'); input.checked = true; input.dispatchEvent(new Event('change', { bubbles: true })); };
  const start = (theme, layout, size, player) => {
    find('#play-button').click();
    choose('theme', theme); choose('layout', layout); choose('boardSize', size); choose('player', player);
    const hoverTheme = theme === 'gaming' ? 'food' : 'gaming';
    find('[data-preview-theme="' + hoverTheme + '"]').dispatchEvent(new MouseEvent('mouseenter'));
    assert(find('#settings-preview').dataset.theme === hoverTheme, 'theme hover preview');
    assert(find('input[name="theme"][value="' + theme + '"]').checked, 'hover keeps selection');
    find('[data-preview-theme="' + hoverTheme + '"]').dispatchEvent(new MouseEvent('mouseleave'));
    assert(find('#settings-preview').dataset.theme === theme, 'hover preview resets');
    find('#settings-form').requestSubmit();
  };
  try {
    for (const theme of ['code-vibes', 'gaming', 'da-projects', 'food']) {
      for (const layout of ['light', 'dark']) {
        for (const [size, count] of [['4x4', 16], ['4x6', 24], ['6x6', 36]]) {
          const player = layout === 'dark' ? 'orange' : 'blue';
          start(theme, layout, size, player);
          assert(!find('#game-screen').hidden && cards().length === count, 'board ' + size);
          assert(document.documentElement.scrollWidth <= window.innerWidth, 'no horizontal overflow');
          assert(cards().every(card => card.getAttribute('aria-label') === 'Verdeckte Memory-Karte'), 'concealed labels');
          for (const [preview, game] of [['#settings-preview', '#game-screen'], ['.settings-preview__status', '.game-status'], ['.preview-card--back', '.memory-card__back'], ['.preview-card--front', '.memory-card__front']]) {
            assert(getComputedStyle(find(preview)).background === getComputedStyle(find(game)).background, 'appearance ' + theme + ' ' + layout + ' ' + game);
          }
          await wait(1000);
          assert(cards().every(card => card.querySelector('img').naturalWidth > 0), 'image loaded');
          assert(cards().every(card => card.querySelector('img').alt.length > 0), 'image alt');
          const first = cards()[0];
          const other = cards().find(card => motif(card) !== motif(first));
          first.click(); other.click();
          cards().find(card => card !== first && card !== other).click();
          assert(cards().filter(card => card.classList.contains('memory-card--flipped')).length === 2, 'click lock');
          await wait(1000);
          assert(!first.classList.contains('memory-card--flipped'), 'mismatch hides');
          const scoringPlayer = player === 'blue' ? 'orange' : 'blue';
          const groups = Map.groupBy(cards(), motif);
          for (const pair of groups.values()) {
            assert(pair.length === 2, 'exact pair');
            pair[0].click(); pair[1].click();
            assert(pair[0].getAttribute('aria-label').includes(': '), 'revealed label');
            await wait(500);
            assert(pair.every(card => card.disabled), 'matched cards disabled');
          }
          assert(!find('#result-overlay').hidden, 'result visible');
          assert(Number(find('#final-' + scoringPlayer + '-score').textContent) === count / 2, 'final score');
          find('#new-round-button').click();
          assert(find('#result-overlay').hidden && cards().length === count, 'restart');
          assert(find('#blue-score').textContent === '0' && find('#orange-score').textContent === '0', 'reset scores');
          find('#exit-button').click();
          assert(find('#exit-dialog').open, 'exit dialog opens');
          find('#back-to-game-button').click();
          assert(!find('#exit-dialog').open && !find('#game-screen').hidden, 'back to game');
          find('#exit-button').click();
          find('#confirm-exit-button').click();
          assert(!find('#exit-dialog').open && !find('#settings-screen').hidden, 'exit to settings');
          results.push(theme + ' / ' + layout + ' / ' + size);
        }
      }
    }
    find('#play-button').click();
    find('input[name="theme"]:checked').checked = false;
    find('#settings-form').requestSubmit();
    assert(find('#game-screen').hidden && find('#settings-feedback').textContent.length > 0, 'invalid settings rejected');
    document.body.textContent = 'PASS: ' + results.length + ' combinations; rendering, colors, images, labels, turns, completion, restart, exit dialog, validation';
  } catch (error) {
    document.body.textContent = 'FAIL after ' + results.length + ' combinations: ' + error.message;
  }
});
`;
fs.writeFileSync('dist/browser-check.html', html.replace('</body>', '<script>' + check + '</script></body>'));
