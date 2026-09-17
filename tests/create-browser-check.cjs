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
  const closeGame = () => { find('#exit-button').click(); find('#confirm-exit-button').click(); };
  const matchPair = async pair => { pair[0].click(); pair[1].click(); await wait(500); };
  const switchPlayer = async (firstPair, secondPair) => { firstPair[0].click(); secondPair[0].click(); await wait(1000); };
  const start = (theme, layout, size, player) => {
    find('#play-button').click();
    choose('theme', theme); choose('layout', layout); choose('boardSize', size); choose('player', player);
    const hoverTheme = theme === 'gaming' ? 'food' : 'gaming';
    find('[data-preview-theme="' + hoverTheme + '"]').dispatchEvent(new MouseEvent('mouseenter'));
    assert(find('#settings-preview').dataset.theme === hoverTheme, 'theme hover preview');
    assert(find('input[name="theme"][value="' + theme + '"]').checked, 'hover keeps selection');
    find('[data-preview-theme="' + hoverTheme + '"]').dispatchEvent(new MouseEvent('mouseleave'));
    assert(find('#settings-preview').dataset.theme === theme, 'hover preview resets');
    const previewInput = find('input[name="theme"][value="' + hoverTheme + '"]');
    previewInput.focus();
    assert(find('#settings-preview').dataset.theme === hoverTheme, 'keyboard focus preview');
    previewInput.blur();
    assert(find('#settings-preview').dataset.theme === theme, 'keyboard preview resets');
    previewInput.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch' }));
    previewInput.click();
    assert(previewInput.checked && find('#settings-preview').dataset.theme === hoverTheme, 'touch selection');
    choose('theme', theme);
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

    for (const layout of ['light', 'dark']) {
      for (const player of ['blue', 'orange']) {
        start('food', layout, '4x4', player);
        assert(find('#current-player').classList.contains('score--' + player), 'starting player ' + layout + ' ' + player);
        closeGame();
      }
    }

    start('food', 'light', '4x4', 'blue');
    let groups = [...Map.groupBy(cards(), motif).values()];
    cards()[0].click();
    cards().find(card => motif(card) !== motif(cards()[0])).click();
    find('#exit-button').click();
    find('#exit-dialog').dispatchEvent(new Event('cancel', { cancelable: true }));
    assert(!find('#exit-dialog').open && !find('#game-screen').hidden, 'escape returns to game');
    await wait(1000);
    assert(find('#current-player').classList.contains('score--orange'), 'comparison continues after escape');
    closeGame();

    start('food', 'light', '4x4', 'blue');
    groups = [...Map.groupBy(cards(), motif).values()];
    await matchPair(groups[0]); await matchPair(groups[1]);
    await switchPlayer(groups[2], groups[3]);
    await matchPair(groups[2]); await matchPair(groups[3]);
    await switchPlayer(groups[4], groups[5]);
    await matchPair(groups[4]); await matchPair(groups[5]);
    await switchPlayer(groups[6], groups[7]);
    await matchPair(groups[6]); await matchPair(groups[7]);
    assert(find('#final-blue-score').textContent === '4', 'draw blue score');
    assert(find('#final-orange-score').textContent === '4', 'draw orange score');
    assert(find('#result-title').textContent.includes('draw'), 'draw result');
    find('#result-home-button').click();

    start('food', 'light', '4x4', 'blue');
    groups = [...Map.groupBy(cards(), motif).values()];
    for (const pair of groups.slice(0, -1)) await matchPair(pair);
    const lastPair = groups.at(-1);
    lastPair[0].click(); lastPair[1].click(); find('#exit-button').click();
    await wait(500);
    assert(find('#exit-dialog').open && !find('#result-overlay').hidden, 'last pair behind exit dialog');
    find('#exit-dialog').dispatchEvent(new Event('cancel', { cancelable: true }));
    assert(document.activeElement === find('#new-round-button'), 'result focus after escape');
    find('#result-home-button').click();

    find('#play-button').click();
    find('input[name="theme"]:checked').checked = false;
    find('#settings-form').requestSubmit();
    assert(find('#game-screen').hidden && find('#settings-feedback').textContent.length > 0, 'invalid settings rejected');
    document.body.textContent = 'PASS: ' + results.length + ' combinations; mouse, keyboard, touch, both players, win, draw, escape, last pair';
  } catch (error) {
    document.body.textContent = 'FAIL after ' + results.length + ' combinations: ' + error.message;
  }
});
`;
fs.writeFileSync('dist/browser-check.html', html.replace('</body>', '<script>' + check + '</script></body>'));
