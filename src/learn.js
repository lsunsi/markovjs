// @flow
import type { Game, Memory, Policy, Transition } from './types';

const learning =
  (gamma: number, reward: number, nextQ: number) =>
  (alpha: number, trace: number) =>
  (Q: number) =>
    (Q + (alpha * trace * ((reward - Q) + (gamma * nextQ))));

export default function<A, G, M> (
  alpha: number,
  gamma: number,
  game: Game<A, G>,
  transition: Transition<A, G>,
  memory: Memory<A, G, M>,
  memoryState: M,
  policy: Policy<A>,
): M {
  const { gameState, nextGameState, reward, action } = transition;
  const actions = game.actions(nextGameState);
  const rater = memory.rater(memoryState, nextGameState);
  const nextAction = policy(actions, rater);
  const updater = learning(gamma, reward, rater(nextAction))(alpha, 1);
  return memory.update(memoryState, gameState, action, updater);
}
