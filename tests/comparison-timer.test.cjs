const assert = require('node:assert/strict');
const fs = require('node:fs');
const { stripTypeScriptTypes } = require('node:module');
const vm = require('node:vm');
const { test } = require('node:test');

// Run the actual game logic with a minimal DOM and controllable timers.
const source = ['src/game-types.ts', 'src/game-data.ts', 'src/main.ts']
  .map(path => fs.readFileSync(path, 'utf8').replace(/^import[\s\S]*?;\r?\n/gm, '').replace(/^export /gm, ''))
  .join('\n');
const script = stripTypeScriptTypes(source);

function setup(matched) {
  const pending = new Map();
  let nextId = 0;
  const element = {
    addEventListener() {},
    close() { this.open = false; },
    dataset: {},
    open: false,
    querySelector() { return null; },
    replaceChildren() {},
    showModal() { this.open = true; },
    focus() {},
  };
  const context = vm.createContext({
    FormData: class {
      get(name) {
        const values = {
          theme: 'food',
          player: 'blue',
          boardSize: '4x4',
          layout: 'light',
        };
        return values[name] ?? null;
      }
    },
    document: {
      createElement() { return { ...element }; },
      querySelector() { return { ...element }; },
      querySelectorAll() { return []; },
    },
    window: {
      setTimeout(callback) {
        pending.set(++nextId, callback);
        return nextId;
      },
      clearTimeout(id) { pending.delete(id); },
    },
  });
  vm.runInContext(script, context);
  const run = (code) => vm.runInContext(code, context);
  run(`
    deck = createDeck({ theme: "food", boardSize: "4x4" });
    const first = deck[0];
    const second = deck.find(card => card.id !== first.id &&
      (card.pairId === first.pairId) === ${matched});
    handleCardClick(first.id);
    handleCardClick(second.id);
  `);
  assert.equal(pending.size, 1);
  return {
    run,
    pending,
    flush() {
      for (const [id, callback] of pending) {
        pending.delete(id);
        callback();
      }
    },
  };
}

test('exit confirmation cancels a pending comparison', () => {
  const game = setup(false);
  game.run('confirmExit()');
  assert.equal(game.pending.size, 0);
  game.flush();
  assert.equal(game.run('scores.blue + scores.orange'), 0);
  assert.equal(game.run('activePlayer'), 'blue');
});

test('exit dialog prevents another card selection', () => {
  const game = setup(false);
  game.run(`
    cancelComparison();
    boardLocked = false;
    flippedCards = [];
    for (const card of deck) card.isFlipped = false;
    openExitDialog();
    handleCardClick(deck[0].id);
  `);
  assert.equal(game.run('flippedCards.length'), 0);
});

test('canceling the exit dialog continues a pending comparison', () => {
  const game = setup(false);
  game.run('openExitDialog(); continueGame()');
  assert.equal(game.pending.size, 1);
  game.flush();
  assert.equal(game.run('activePlayer'), 'orange');
  assert.equal(game.run('boardLocked'), false);
});

test('last pair can finish while the exit dialog is open', () => {
  const game = setup(true);
  game.run(`
    for (const card of deck) {
      if (!card.isFlipped) card.isMatched = true;
    }
    RESULT_DIALOG.close();
    openExitDialog();
  `);
  game.flush();
  assert.equal(game.run('RESULT_DIALOG.open'), true);
  assert.equal(game.run('exitDialogOpen'), true);
  game.run('continueGame()');
  assert.equal(game.run('exitDialogOpen'), false);
});

for (const matched of [true, false]) {
  const kind = matched ? 'matching pair' : 'different cards';

  test(`${kind}: leaving cancels the comparison`, () => {
    const game = setup(matched);
    game.run('showScreen("home")');
    assert.equal(game.pending.size, 0);
    game.flush();
    assert.equal(game.run('scores.blue + scores.orange'), 0);
    assert.equal(game.run('activePlayer'), 'blue');
  });

  test(`${kind}: restarting protects the new round`, () => {
    const game = setup(matched);
    game.run(`
      resetGameState("orange");
      deck = createDeck({ theme: "food", boardSize: "4x4" });
      handleCardClick(deck[0].id);
    `);
    game.flush();
    assert.equal(game.run('scores.blue + scores.orange'), 0);
    assert.equal(game.run('activePlayer'), 'orange');
    assert.equal(game.run('flippedCards.length'), 1);
    assert.equal(game.run('deck.filter(card => card.isFlipped).length'), 1);
    assert.equal(game.run('deck.some(card => card.isMatched)'), false);
  });

  test(`${kind}: normal comparison still completes`, () => {
    const game = setup(matched);
    game.flush();
    assert.equal(game.run('scores.blue'), matched ? 1 : 0);
    assert.equal(game.run('activePlayer'), matched ? 'blue' : 'orange');
    assert.equal(game.run('deck.filter(card => card.isMatched).length'), matched ? 2 : 0);
    assert.equal(game.run('flippedCards.length'), 0);
    assert.equal(game.run('boardLocked'), false);
    assert.equal(game.run('comparisonTimer'), null);
  });
}

for (const layout of ['light', 'dark']) {
  for (const player of ['blue', 'orange']) {
    test(`${player} starts with the ${layout} layout`, () => {
      const game = setup(false);
      game.run(`resetGameState("${player}")`);
      assert.equal(game.run('activePlayer'), player);
      assert.equal(game.run('scores.blue + scores.orange'), 0);
    });
  }
}

test('result text distinguishes a win from a draw', () => {
  const game = setup(false);
  game.run('scores = { blue: 5, orange: 3 }; updateResultText()');
  assert.equal(game.run('RESULT_TITLE.textContent'), 'Blue player');
  game.run('scores = { blue: 4, orange: 4 }; updateResultText()');
  assert.equal(game.run('RESULT_TITLE.textContent'), 'Draw');
});

test('game over shows the final score before the winner', () => {
  const game = setup(false);
  game.run('cancelComparison(); scores = { blue: 5, orange: 3 }; finishGame()');
  assert.equal(game.run('RESULT_DIALOG.dataset.stage'), 'game-over');
  assert.equal(game.run('FINAL_BLUE_SCORE.textContent'), '5');
  assert.equal(game.run('FINAL_ORANGE_SCORE.textContent'), '3');
  game.flush();
  assert.equal(game.run('RESULT_DIALOG.dataset.stage'), 'winner');
});
