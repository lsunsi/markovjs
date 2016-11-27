// @flow
import type { Game, Memory, Policy, Episode, Trainment } from './types';
import learn from './learn';
import move from './move';

function* play<A, G, M>(
  game: Game<A, G>,
  initialGameState: G,
  memory: Memory<A, G, M>,
  memoryState: M,
  policy: Policy<A>,
): Episode<A, G> {
  let gameState = initialGameState;
  while (!game.final(gameState)) {
    const transition = move(game, gameState, memory, memoryState, policy);
    gameState = transition.nextGameState;
    yield (transition);
  }
}

function* train<A, G, M>(
  alpha: number,
  gamma: number,
  game: Game<A, G>,
  initialGameState: G,
  memory: Memory<A, G, M>,
  initialMemoryState: M,
  movePolicy: Policy<A>,
  learnPolicy: Policy<A>,
): Trainment<M> {
  let memoryState = initialMemoryState;
  for (;;) {
    let gameState = initialGameState;
    while (!game.final(gameState)) {
      const transition = move(
        game, gameState,
        memory, memoryState,
        movePolicy,
      );

      memoryState = learn(
        alpha, gamma,
        game, transition,
        memory, memoryState,
        learnPolicy,
      );

      gameState = transition.nextGameState;
    } yield (memoryState);
  }
}

export { play, train };
