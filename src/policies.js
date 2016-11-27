// @flow
import type { Policy } from './types';

type RatedAction<A> = {| action: A, rate: number |};

const random = <A>(actions: Array<A>): A =>
  actions[Math.floor(Math.random() * actions.length)];

const greedy = <A>(actions: Array<A>, rate: A=> number): A =>
  actions
    .map((action: A): RatedAction<A> => ({ action, rate: rate(action) }))
    .sort((ra1: RatedAction<A>, ra2: RatedAction<A>): number => ra1.rate - ra2.rate)
    .pop()
    .action;

const egreedy = <A>(
  epsilon: number,
): Policy<A> => (
  actions: Array<A>,
  rate: A=> number,
): A => (Math.random() < epsilon ? random : greedy)(actions, rate);

export {
  random,
  greedy,
  egreedy,
};
