// @flow
export type Game<A, G> = {
  actions: G=> Array<A>,
  act: (G, A) => G,
  reward: (G, G) => number,
  final: G=> boolean,
}

export type Memory<A, G, M> = {
  update: (M, G, A, number=> number)=> M,
  rater: (M, G) => (A) => number,
};

export type Transition<A, G> = {|
  gameState: G,
  nextGameState: G,
  action: A,
  reward: number,
|};

export type Policy <A> = (
  Array <A>,
  A=> number,
) => A;

export type Move<A, G, M> = (
  Game<A, G>, G,
  Memory<A, G, M>, M,
  Policy<A>,
)=> Transition<A, G>;

export type Learn<A, G, M> = (
  Game<A, G>,
  Transition<A, G>,
  Memory<A, G, M>, M,
  Policy<A>,
)=> M;

export type Episode<A, G> = Iterator<Transition<A, G>>;
export type Trainment<M> = Iterator<M>;
