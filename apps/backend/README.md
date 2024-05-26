ha# Presenter Backend

This is the Shabad OS presenter backend app, which can run in isolation from the `electron` and `frontend` apps.

Generally speaking, it carries out the following:

- Content retrieval
- State management
- Shared state synchronisation, over websockets
- Pushing out data to other services (Zoom)
- Hot-updating of the `@shabados/database` module
- Searching

## Usage

`npm run dev` to spin up the backend in development mode, with file watching.

If you'd like to run unit tests in watcher mode, `npm run test -- --watch`.

### REPL

There is also a script to act as a websocket client to the backend that you can connect via `npm run connect`. This is a REPL that can be used to send commands and receive data back, which can be very useful for testing. Press `tab` for a list of methods available.

## Architecture

The backend is effectively a state machine. We make use of reactive data architecture so that other parts of the app can respond to changes to data. This allows for the modular, split-by-concern approach that you'll see looking in the `src` directory, or app modules.

This is with the exception of the `services` and `helpers` folders, used to store cross-cutting concerns.

Generally speaking, singleton modules are avoided in this backend - they've previously caused order race conditions, and there is more clarity through the explicit initialisation in the entrypoint of the app, `index.ts`, which should only be concerned with initialising modules.
