const assert = require('node:assert/strict');
const fs = require('node:fs');
const { stripTypeScriptTypes } = require('node:module');
const vm = require('node:vm');
const { test } = require('node:test');

// Run the actual game logic with a minimal DOM and controllable timers.
const source = ['src/game-types.ts', 'src/game-data.ts', 'src/main.ts']
  .map(path => fs.readFileSync(path, 'utf8').replace(/^import .*;\r?$/gm, '').replace(/^export /gm, ''))
  .join('\n');
const script = stripTypeScriptTypes(source);

function setup(matched) {
  const pending = new Map();
  let nextId = 0;
  const element = {
    addEventListener() {},
    querySelector() { return null; },
    focus() {},
  };
  const context = vm.createContext({
    document: { querySelector() { return { ...element }; } },
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
