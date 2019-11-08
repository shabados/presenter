# Shabad OS Desktop

<div align="center">

Next generation Gurbani presentation software for searching, navigating, and presenting shabads.

[![CircleCI](https://img.shields.io/circleci/project/github/ShabadOS/desktop.svg?style=flat)](https://circleci.com/gh/ShabadOS/desktop)
[![Github All Releases](https://img.shields.io/github/downloads/ShabadOS/desktop/total.svg?style=flat)](https://github.com/ShabadOS/desktop/releases)
[![license](https://img.shields.io/github/license/ShabadOS/desktop.svg?style=flat)]()
<br/>
[![Email](https://img.shields.io/badge/Email-team%40shabados.com-blue.svg)](mailto:team@shabados.com) [![WhatsApp](https://img.shields.io/badge/WhatsApp-%2B1--516--619--6059-brightgreen.svg)](https://wa.me/15166196059) [![Slack](https://img.shields.io/badge/Slack-join%20the%20conversation-B649AB.svg)](https://slack.shabados.com)
<br/>
</div>

Contains the standalone frontend and backend applications for ShabadOS, with an Electron wrapper.

## Development

The `app` folder contains the Electron wrapper, the backend Node application, and the frontend React application.

Requirements:
* [Node](https://nodejs.org/en/download/)
* On macOS, you will need Xcode Tools via `xcode-select --install` and the latest npm via `npm install --global npm`.

To install dependencies, run `npm install`, which will also install the dependencies for the frontend and backend.

To spin up the development servers, run `npm start`, which will launch a frontend server on `https://localhost:3000`, and a backend server on `https://localhost:42425`.

If you'd prefer to use docker-compose, `docker-compose up` will install the dependencies and spin up the backend and frontend.

### Frontend

Using `create-react-app`. Websockets for synchronising clients. API for search.

Run `npm run analyze` to produce a treemap of the bundle and see where bloat is coming from. Make sure you've run `npm run build` first.

### Backend

Using proposed ES+ modules with the `esm` shim module.
Any changes to the backend when running using `docker-compose`,
or `npm start` will result in the server restarting.

In development, the backend app runs on port `42425` by default and the frontend on port `3000`.

### Packaging with Electron

Windows? You must install [windows-build-tools](!https://www.npmjs.com/package/windows-build-tools), by running `npm install --global --production windows-build-tools --vs2015` in an administrator Powershell.

Run `npm run pack` to generate the binaries to test for your platform, and `npm run dist` to build an installer.

Electron-builder is used internally.

The backend will then run on port 42424.

### Contributing Guidelines

We're happy to accept suggestions and pull requests!

Checkout out our [Contributing Guidelines](CONTRIBUTING.md) for more information.