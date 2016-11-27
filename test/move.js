import { expect } from 'chai'; // eslint-disable-line import/no-extraneous-dependencies
import { describe, it } from 'mocha'; // eslint-disable-line import/no-extraneous-dependencies
import * as memory from '../src/memory';
import move from '../src/move';

const game = {
  actions: () => ['+10', '-10'],
  reward: (s2, s1) => (s2 > s1 ? 1 : -1),
  final: s => s >= 1000,
  act: (s, a) => ({
    '+10': s + 10,
    '-10': s - 10,
  }[a]),
};

describe('move', () => {
  it('should reward based on transition', () => {
    const t1 = move(
      game, 0,
      memory, memory.init(0.0),
      () => '+10',
    );

    const t2 = move(
      game, 0,
      memory, memory.init(0.0),
      () => '-10',
    );

    expect(t1.reward).to.equal(+1);
    expect(t2.reward).to.equal(-1);
  });

  it('should act following policy', () => {
    const t = move(
      game, 0,
      memory, memory.init(0.0),
      () => 'X',
    );

    expect(t.action).to.equal('X');
  });
});
