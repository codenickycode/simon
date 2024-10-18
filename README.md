# Simon

This is a case study in application architecture for the classic memory game Simon. The game requires the user to play back a computer generated sequence of notes that increases in length each turn.

Play now! https://simon.codenickycode.com

## Architecture

![architecture diagram](./docs/simon-arch.png)

### Front End

This application uses [React](https://react.dev) to separate data, logic, and visual elements into separate components. State is maintained via React hooks, and UI is rendered as html via jsx. Musical sequencing and synthesis is made possible by [Tone.js](https://tonejs.github.io/), an abstraction over the Web Audio API. It is deployed via [Cloudflare Pages](https://developers.cloudflare.com/pages/).

#### [Root](./client/src/simon.tsx)

The parent function that orchestrates all other components to fetch data, maintain state, and render UI. This is the root of our React application.

#### [API](./client//src/services/api.high-score.ts)

A service to retrieve and update the global high score from our back end API. This component stores the pending, success, and error states of all requests.

#### [Game State](./client/src/components/use-game-machine.ts)

A finite state machine that maintains the status of the game: New Game, Computer Turn, User Turn, Game Over. It uses the [state reducer pattern](https://kentcdodds.com/blog/the-state-reducer-pattern-with-react-hooks), accepting a single action to transition state and update the user's current score.

#### [Pad Controller](./client/src/components/use-pad-controller.ts)

A stateful hook that controls the "active" status of each pad and provides methods for accepting user and computer pad input.

#### [Melody Player](./client/src/services/melody-player.ts)

Preset melodies to play when entering the game over state.

#### [Sequencer](./client/src/services/sequencer.ts)

Builds a sequence of notes as the game progresses. These are the notes the user must repeat in order to continue playing. The sequencer plays tones using a synth and is observed by the pad controller to set the current playing pad as active.

#### Synths

These are `Tone.Synth` instances that receive input from the pad controller, melody player, and sequencer to emit tones to the audio device. See [Tone.js | Class Synth](https://tonejs.github.io/docs/15.0.4/classes/Synth.html)

### Back End

The back end is a simple [Hono](https://hono.dev/) REST API on [Cloudflare Workers](https://developers.cloudflare.com/workers/) and a [Cloudflare KV](https://developers.cloudflare.com/kv/) database. It exposes retrieving and updating a global high score.

# Development

## Getting Started

### Pre-requisites

1. [pnpm](https://pnpm.io/installation) v9 and above
2. [node](https://nodejs.org/en/download/package-manager/current) v22.9.0 and above

### Installation

1. Ensure you're using the correct version of Node:

   ```sh
   nvm use 22.9.0
   ```

2. If necessary, install the correct version of pnpm:

   ```sh
   npm i -g pnpm@9
   ```

3. Install dependencies

   ```sh
   pnpm i
   ```

4. Start local dev server

   ```sh
   pnpm run dev
   ```

### Deployment Configuration

1. Follow instructions in [README.cloudflare](./README.cloudflare/README.cloudflare.md)

2. Follow instructions in [README.sentry](./README.sentry/README.sentry.md)

### Deploying a branch to stage

1. Click the "Actions" tab
2. Select the "stage" workflow
3. Open the dropdown for "Run workflow" and select the branch you wish to deploy
4. Choose your deploy target (client, server, both)
5. Click "Run workflow"

The client app will deploy to the preview url, and the server will deploy to your staging worker.

## Scripts

- `pnpm run dev`: Start the development server
- `pnpm run lint`: Run ESLint
- `pnpm run test`: Run unit tests with Vitest
- `pnpm run typecheck`: Run TypeScript type checking
- `pnpm run format`: Format code with Prettier
- `pnpm run e2e`: Run end-to-end tests with Playwright

Some convenience scripts for shortcuts:

- `pnpm run clean`: Execute a clean install of package dependencies
- `pnpm run client <script>`: Run a script within the client package only
- `pnpm run server <script>`: Run a script within the server package only

## Debug

### Server starts on wrong port locally

Sometimes the server fails to shutdown, leaving an instance listening to port 8787. The next time you run `pnpm run server dev`, it will start a new instance and listen to a random port. Running `killall workerd` does not seem to fix it. Instead, get any `workerd` process ID listening to port 8787 (there may be several) and kill it. On macOS:

```sh
lsof -i :8787
kill -9 <pid>
```

## References

- [React](https://react.dev) SPA for the client-side application
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Tanstack Query](https://tanstack.com/query/latest) for client http request state management
- [Hono](https://hono.dev/) server-side api framework
- [Prettier](https://prettier.io/) for code formatting
- [ESLint](https://eslint.org/) for linting
- [Vitest](https://vitest.dev/) for unit testing
- [Playwright](https://playwright.dev/) for end-to-end testing
- [TypeScript](https://www.typescriptlang.org/) for type checking
- [Cloudflare](https://cloudflare.com) Pages for hosting the client, Worker with KV storage for hosting the server
- [GitHub](https://github.com) workflows for CI and staging deployment
- [Sentry](https://sentry.io/) integration for client-side error tracking
- [pnpm](https://pnpm.io) for performant monorepo package management
