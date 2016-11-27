// @flow
import type { Game, Memory, Policy, Episode } from './types';
import { play, train } from './tasks';

export default <A, G, M>() => Object.create({
  game(game: Game<A, G>, gameState: G) {
    this.game = game;
    this.gameState = gameState;
    return this;
  },
  memory(memory: Memory<A, G, M>, memoryState: M) {
    this.memory = memory;
    this.memoryState = memoryState;
    return this;
  },
  policies(move: Policy<A>, learn: Policy<A> = move, show: Policy<A> = learn) {
    this.movePolicy = move;
    this.learnPolicy = learn;
    this.playPolicy = show;
    return this;
  },
  train(n: number, alpha: number, gamma: number) {
    const trainment = train(
      alpha, gamma,
      this.game, this.gameState,
      this.memory, this.memoryState,
      this.movePolicy,
      this.learnPolicy,
    );

    for (let i = 0; i < n; i += 1) {
      this.memoryState = trainment.next().value;
    } return this;
  },
  play(cb: Episode<A, G> => void) {
    cb(play(
      this.game, this.gameState,
      this.memory, this.memoryState,
      this.playPolicy,
    ));
    return this;
  },
});
