# Contributing

Anyone providing assistance to the future of this project is considered a contributor. If you wish to play a part in this project, then thank you! This document outlines some of the ways to help.

The easiest way to communicate is via [GitHub issues](https://github.com/shabados/presenter/issues). Please search for similar issues regarding your concerns before opening a new issue. For everything else we ask to chat about it on [GitHub Discussions](https://github.com/orgs/shabados/discussions) or [Slack](https://chat.shabados.com/).

## Build & Run

You'll need the following:

- [Git](https://git-scm.com/)
- [Node.JS](https://nodejs.org) (If you need to manage multiple Node.JS versions, [use a node version manager](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install)
- Source code of `presenter` repo

E.g.

```shell
gh repo fork shabados/presenter --clone=true
```

- Run `npm i` in the root directory.
- `npm start`

The above command spins up development servers. It launches a frontend on [port `3000`](https://localhost:3000) and backend on [port `42425`](https://localhost:42425). Any changes to the backend will result in a restart. A manual restart can be triggered by entering `rs` into the terminal.

Produce a tree-map of the bundle and look for potential bloat with at least one `npm run build` and then as many `npm run analyze` commands.

## Package

Electron-builder is used to generate binaries. Run `npm run pack` for the binaries to test on your platform, and `npm run dist` to build an installer. The production builds launch a frontend server on port `1699` and backend server port `42424`.

## Codebase Overview

The `app` folder contains the Electron wrapper, the backend Node application, and the frontend React application.

The frontend is using `create-react-app`, websockets for synchronizing clients, and API for search.

The backend is using proposed ES+ modules with the `esm` shim module.

## Workflow & Coding Guidelines

Please see [our docs for coding guidelines](https://www.shabados.com/docs/community/coding-guidelines/).

**Scopes**

- backend
- frontend/controller
- frontend/overlay
- frontend/presenter
- frontend/settings

## Thank You

Your contributions to open source (large or small!) make great projects like this possible. Thank you for taking the time to participate in this project.
