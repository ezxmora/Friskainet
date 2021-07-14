const { SlotSymbol } = require('slot-machine');

const banana = new SlotSymbol('banana', {
  display: '🍌',
  points: 10,
  weight: 100,
});

const apple = new SlotSymbol('apple', {
  display: '🍎',
  points: 15,
  weight: 80,
});

const orange = new SlotSymbol('orange', {
  display: '🍊',
  points: 20,
  weight: 60,
});

const grape = new SlotSymbol('grape', {
  display: '🍇',
  points: 25,
  weight: 40,
});

const money = new SlotSymbol('money', {
  display: '💰',
  points: 100,
  weight: 5,
  wildcard: true,
});

module.exports = { slotSymbols: [banana, apple, orange, grape, money] };
