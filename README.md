# markovjs

###### npm install markovjs

[![Release](https://img.shields.io/badge/Release-0.1.0-blue.svg?style=flat-square)](https://github.com/lsunsi/markovjs/releases)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://github.com/lsunsi/markovjs/blob/master/LICENSE)

This is a reference implementation of a basic reinforcement learning environment.
It is intended as a playground for anyone interested in this field.

My goal is to provide a minimal and clean implementation of the main concepts, so you can:
- Plug in some problem you want to try to solve and play around
- Understand what's going on and how does the agent learn
- Extend functionality via custom data types or functions

What's inside:
- Basic TD(0) value iteration algorithm
- Basic memory implementation
- Common policies

## Getting Started
This package exports a function that provides the environment you'll need to try your own problems.

There are three components required for the learning to start:
- a game implementation
- a memory implementation
- policies for the agent to follow

The environment provides helpful methods to set those up, train an agent and replay its findings within your game.
This example shows a basic usage of this package, and each step will be explained in its own section in order.

```javascript
import markov from 'markovjs'
import {egreedy} from 'markovjs/policies'
import * as memory from 'markovjs/memory'
import * as game './game'

const α = 0.1 // learning rate
const γ = 0.9 // discount factor
const ε = 0.1 // exploration rate

markov() // creates an environment
  .game(game, game.initial) // sets up the game
  .memory(memory, memory.init(0.0)) // sets up the memory
  .policies(egreedy(ε)) // sets up the policies
  .train(100, α, γ) // train for one hundred episodes
  .play(episode => { /* play time! */ })
```

### **.game** *(game: Game<G>, initialGameState: G)*
*sets up the game for the learning environment*

It takes the game **implementation** as its first argument and the game **initial state** as the second one.
This initial game state will be used in all game simulations and can only be changed by calling this method again.

The game implementation should be implemented by you following this interface:

```javascript
// A: Action type
// G: Game state type
type Game<A, G> = {
  actions: G=> Array<A>, // what are the allowed actions for given state?
  act: (G, A) => G, // what state leads given state taken given action?
  reward: (G, G) => number, // what is the reward from going to state from state?
  final: G=> boolean // is the given state final?
}
```

This is generally all you need to implement in order to use this package.

*That's not to say you shouldn't mess around anywhere else if you feel like it.*

###### tips
- Need an example? grid-world *(coming soon)* and n-armed-bandit *(coming soon)*
- The way you model your problem affects the agent's ability to learn it. State is what your agent sees and the reward is what it seeks!
- There might be restraints on your state implementation depending on the memory implementation you use. Check out the memory section for more info

### **.memory** *(memory: Memory<M>, initialMemoryState: M)*
*sets up the memory for the learning environment*

This method is analogous to `.game`.
It takes the memory **implementation** as its first argument and the memory **initial state** as the second one.

This package provides a basic implementation for the memory that can be used out of the box.
It includes both required functions and an extra `init` one, that returns an empty memory state.
The `init` function takes a number to be used as the initial value for all unset state-action pairs.

```javascript
import * as memory from 'markovjs/memory'

const m0 = memory.init(0.1) // this means all values are defaulted to 0.1
const m1 = memory.update(m0, 0, 1, v => v + 2.0) // updates the value for G=0 A=1
const rater = memory.rater(m1, 0) // gets rater for G=0
rater(0) // rates G=0 A=0, which gives out 0.1
rater(1) // rates G=0 A=1, which gives out 2.1
```

**This memory implementation relies on `toString` method to compare your game states.**
This means that for this memory to work correctly, you need to make sure the string returned by `toString` for your game state really represents it.

###### tips
- You might have to implement a custom `toString` method for your state type. Need an example? grid-world *(coming soon)*
- Don't feel like implementing the `toString` method? Check out this memory implementation *(coming soon)*
- Most of the heavy work is lifted by the memory. Want to speed things up? Roll up your own faster memory implementation!

### **.policies** *(move: Policy, learn: Policy = move, play: Policy = learn)*
*sets up the policies to be followed by the agent in the learning environment*

It takes one required policy (move) and two optional ones (learn and play).
If one policy is omitted, it is defaulted to the previous one.
The policies are used by the agent as follows:

- move: the one followed while learning
- learn: the one expected to be learned
- play: the one followed while playing

This package provides the implementation of the most popular policies used in this type of learning algorithm.
```javascript
import * as policies from 'markovjs/policies'

policies.random // always chooses random action
policies.greedy // always chooses the action with higher expected return
policies.egreedy(0.1) // acts random with 0.1 chance and greedy with 0.9 chance
```

###### tips
- Use the greedy policy carefully, since it can lead to infinite loops on training or playing
- If your agent follows and learns the same policy during training, call it [SARSA](https://en.wikipedia.org/wiki/State-Action-Reward-State-Action)
- If your agent follows one policy while learning the greedy one, call it [Q-Learning](https://en.wikipedia.org/wiki/Q-learning)

### **.train** *(sessions: number, alpha: number, gamma: number)*
*trains an agent using the game, memory and policies previously set*

It takes the number of episode **sessions** to train your agent for as its first argument.
The second and third ones are the **learning rate** and **discount factor** parameters.

This method will mutate the environment's memory to reflect the agent's learning.
How long it takes for this method to run will depend both on your game's episode length and agent's performance.

*Meaning it will not take forever unless your agent is both really stubborn and really disciplined.*

###### tips
- Both the **learning rate** and **discount rate** are problem specific.
- How many sessions it takes to learn the problem? Great question.

### **.play** *(callback: Episode => void)*
*generates a playing episode using current game, memory and policy settings*

The only parameter taken by this function is a callback to pass the resulting episode.

An episode is a javascript **iterator** of `Transitions`.

```javascript
export type Transition<A, G> = {|
  gameState: G, // state the agent was at
  action: A, // the action it took
  nextGameState: G, // where the action led
  reward: number // what the agent got out of it
|}
```

###### tips
- The episode isn't guaranteed to be finite *(specially if you're agent is too greedy)*
- The reward sum is what your agent is trying to maximize!

## Going Deeper
Not satisfied with the included memory implementation?
Want to try out a custom policy?
This training environment is too simple for you?

This section will expose the main data types and abstractions adopted in this package.

*Let me know if you code something awesome with them.*

### Memory
The included memory implementation is supposed to be basic and easy to understand.
Other implementations might focus on performance or even new functionality.

If you want to implement your own, here's what you need to code:
```javascript
// A: Action type
// G: Game state type
// M: Memory type
export type Memory<A, G, M> = {
  update: (M, G, A, number=> number)=> M, // maps memory value for (G, A) pair using given function
  rater: (M, G) => (A) => number // returns a function that rates actions for state G
}
```

### Policy
If you want to implement your own policies, it is just as easy as writing a simple function.
You probably won't need to, since the ones included should get you covered.
*I sure won't stop you though, so here is the expected signature:*

```javascript
export type Policy <A> = (
  Array <A>, // the array of actions to choose from
  A=> number // a function that returns the expected return of an action
) => A // chosen action
```

### Misc
In order to implement the learning environment I found useful to code these two primitives:
- **Move**: makes a step from given game state following given policy using given memory state.
- **Learn**: updates the memory using a 1-step value iteration function, simulating the next move in given game with given policy and memory.

You might find these functions useful to code your own extensions, so here are their signatures:

```javascript
export type Move<A, G, M> = (
  Game<A, G>,
  G,
  Memory<A, G, M>,
  M,
  Policy<A>
)=> Transition<A, G>
```
```javascript
export type Learn<A, G, M> = (
  Game<A, G>,
  Transition<A, G>,
  Memory<A, G, M>,
  M,
  Policy<A>
)=> M
```

## Coming soon
- immutable memory implementation
- grid-world game example
- n-armed-bandit game example
- eligibility traces support
- function approximation support

## Thanks
Seriously, for reading this whole doc.

*You're awesome.*
