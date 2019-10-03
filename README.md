# Shabad OS Desktop

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

In development, the backend app runs on port `42425` by default.

### Packaging with Electron

Windows? You must install [windows-build-tools](!https://www.npmjs.com/package/windows-build-tools), by running `npm install --global --production windows-build-tools` in an administrator Powershell.

Run `npm run pack` to generate the binaries to test for your platform, and `npm run dist` to build an installer.

Electron-builder is used internally.

The backend will then run on port 42424.

### Contributing Guidelines

We're happy to accept suggestions and pull requests!

Checkout out our [Contributing Guidelines](CONTRIBUTING.md) for more information.