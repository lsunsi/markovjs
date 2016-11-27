// @flow
export type MemoryState = {
  values: { [string]: number },
  initial: number,
};

const key = <A, G>(game: G, action: A): string =>
  [game, action].toString();

const init = (initial: number): MemoryState =>
  ({ initial, values: {} });

const rater = <A, G>(
  { initial, values }: MemoryState,
  game: G,
): (A=> number) => (action: A): number => {
  const k = key(game, action);
  return k in values ? values[k] : initial;
};

const update = <A, G>(// eslint-disable-line arrow-parens
  { initial, values }: MemoryState,
  game: G,
  action: A,
  updater: number=>number,
): MemoryState => {
  const k = key(game, action);
  const value = k in values ? values[k] : initial;
  return { initial, values: { ...values, [k]: updater(value) } };
};

export {
  init,
  rater,
  update,
};
