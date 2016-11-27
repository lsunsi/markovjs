import { expect } from 'chai'; // eslint-disable-line import/no-extraneous-dependencies
import { describe, it } from 'mocha'; // eslint-disable-line import/no-extraneous-dependencies
import * as memory from '../src/memory';

describe('memory', () => {
  const initial = 1.23;

  const m0 = memory.init(initial);
  const m1 = memory.update(m0, 1, 1, () => 1);
  const m2 = memory.update(m1, 1, 2, () => 3);
  const m3 = memory.update(m2, 2, 1, () => 3);
  const m4 = memory.update(m3, 2, 1, v => v - 2);
  const m5 = memory.update(m4, 2, 2, v => v - initial);

  const rater1 = memory.rater(m5, 1);
  const rater2 = memory.rater(m5, 2);
  const rater3 = memory.rater(m5, 3);

  it('should retrieve set values', () => {
    expect(rater1(1)).to.equal(1);
    expect(rater1(2)).to.equal(3);
  });

  it('should respect default value', () => {
    expect(rater2(3)).to.equal(initial);
    expect(rater3(1)).to.equal(initial);
  });

  it('should pass current value to updater', () => {
    expect(rater2(1)).to.equal(1);
    expect(rater2(2)).to.equal(0);
  });
});
