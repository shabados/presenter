# Contributing to Presenter

Thank you for your interest in participating!

There are many ways to contribute, beyond writing code or programming, by: logging bugs, reporting issues, and creating suggestions. To do so, please [create a ticket](https://github.com/shabados/presenter/issues/new) in our issue tracker. (See other ways to [Contribute](README.md#Contributing) or give [Feedback](README.md#Feedback).

This document is for developers or programmers contributing to the source code of Presenter.

**Table of Contents**

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Build](#build)
  - [Start](#start)
  - [Run](#run)
  - [Package](#package)
- [Codebase Overview](#codebase-overview)
- [Workflow](#workflow)
  - [Coding Guidelines](#coding-guidelines)
  - [Scope](#scope)
- [Thank you](#thank-you)

## Getting Started

If you wish to better understand how Presenter works or want to debug an issue: get the source, build it, and run it locally.

### Prerequisites

In order to download necessary tools, clone the repository, and install dependencies, you'll need network access.

You'll need the following:

- [Git](https://git-scm.com/)
- [Node.JS](https://nodejs.org) (If you need to manage multiple Node.JS versions, [use a node version manager](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install)

Get the source code of `presenter` repo:

```shell
gh repo fork shabados/presenter --clone=true
```

**PROTIP**: Use the [`gh` cli tool from GitHub](https://cli.github.com/) to fork the repo to your GitHub account (if not already), clone it to your local machine, and set the appropriate remotes for origin and upstream with the above command.

<!-- #### Prerequisites for compile tool chain

Currently, the program uses precompiled binaries. If a need to compile native Node modules arises in the future, the following prerequisites would be needed.

**PROTIP**: The following instructions are **not** required to build, run, package, or distribute Shabad OS Presenter.

- [Python](https://www.python.org/downloads/release/python-2715/), at least version 2.7 (version 3 is not supported).

**PROTIP**: Windows users will automatically install Python 2.7 when installing `windows-build-tools` npm module (see below)

- A C/C++ compiler tool chain for your platform:
  - **Windows**
    - **NOTE**: Make sure your profile path only contains ASCII letters, otherwise it can lead to node-gyp usage problems ([nodejs/node-gyp issue #297](https://github.com/nodejs/node-gyp/issues/297))
    - **NOTE**: If you have Visual Studio 2019 installed, you may face issues when using the default version of `node-gyp`. You may need to follow the solutions in [nodejs/node-gyp issue #1747](https://github.com/nodejs/node-gyp/issues/1747).
    - Start Powershell as Administrator.
    - Run `npm install --global windows-build-tools --vs2015`. (Try the `--debug` flag or check [Windows Build Tools](https://github.com/felixrieseberg/windows-build-tools) if you encounter any problems.)
    - Restart your computer.
  - **macOS**
    - [Xcode](https://developer.apple.com/xcode/downloads/) can be used to install Command Line Tools containing `gcc` and the related tool-chain containing `make`.
    - Open a terminal and run `xcode-select --install`.
  - **Linux**
    - `make`, `pkg-config`, GCC or another compile tool-chain
    - Building packages has not been tested, so requirements are unknown -->

### Build

Run `npm i` in the root directory.

### Start

```shell
npm start
```

Use the above command to spin up development servers. It will launch a frontend server on [port `3000`](https://localhost:3000) and a backend server on [port `42425`](https://localhost:42425). Any changes to the backend will result in the server restarting. A manual restart can be triggered by entering `rs` into the terminal.

### Run

Usage:

```shell
npm run <command>
```

The commands are:

```shell
lint                   # ESLint all files
lint:backend           # ESLint files in app/
lint:frontend          # ESLint files in app/frontend/
start:backend          # Start app/
start:frontend         # Start app/frontend/
start:electron         # Start electron in app/
build                  # Use react-app-rewired to build in app/frontend
install-deps           # Run npm install for entire project
install-deps:backend   # Run npm install in app/
install-deps:frontend  # Run npm install in app/frontend/
pack                   # Create a binary
dist                   # Create an installer
release                # Create an installer (duplicate)
```

Run `npm run` or open the `package.json` file(s) for a full list of commands.

To produce a tree-map of the bundle and look for potential bloat, run `npm run build` at least once, and then `npm run analyze`.

### Package

Electron-builder is used to generate binaries. Run `npm run pack` for the binaries to test on your platform, and `npm run dist` to build an installer. The production builds launch a frontend server on port `1699` and backend server port `42424`.

## Codebase Overview

The `app` folder contains the Electron wrapper, the backend Node application, and the frontend React application.

The frontend is using `create-react-app`, websockets for synchronizing clients, and API for search.

The backend is using proposed ES+ modules with the `esm` shim module.

## Workflow

The workflow of development (or Git Flow) is to [choose/create an issue](https://github.com/shabados/presenter/issues) to work on, [create a feature branch](https://github.com/shabados/.github/wiki/How-to-Contribute#branches), and [submit a pull request](https://github.com/shabados/.github/wiki/How-to-Contribute#pull-requests).

**PROTIP**: Read more about our workflow (issue tracking, branching, and pull requests) in the [How To Contribute wiki article](https://github.com/shabados/.github/wiki/How-to-Contribute).

### Coding Guidelines

Please see the [wiki](https://github.com/shabados/.github/wiki/How-to-Contribute#coding-guidelines) for Coding Guidelines ([Names](https://github.com/shabados/.github/wiki/How-to-Contribute#41-names), [Comments](https://github.com/shabados/.github/wiki/How-to-Contribute#42-comments), [Style](https://github.com/shabados/.github/wiki/How-to-Contribute#43-style), [Linting](https://github.com/shabados/.github/wiki/How-to-Contribute#44-linting), and [Commit Messages](https://github.com/shabados/.github/wiki/How-to-Contribute#45-commit-messages)).

### Scope

To be used in [commit messages](https://github.com/shabados/.github/wiki/How-to-Contribute#45-commit-messages).

Usage:

```shell
<type>(<scope>): <subject>
```

The scopes are:

```shell
backend
frontend/controller
frontend/overlay
frontend/presenter
frontend/settings
```

## Thank you

Your contributions to open source, large or small, make great projects like this possible. Thank you for taking the time to participate in this project.
