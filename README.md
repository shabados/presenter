# ShabadOS-Core

Contains the standalone frontend and backend applications for ShabadOS, with an Electron wrapper.

## Development

The `app` folder contains the Electron wrapper, the backend Node application, and the frontend React application.

To install dependencies, run `npm install`, which will also install the dependencies for the frontend and backend. 

To spin up the development servers, run `npm run dev`, which will launch a frontend server on `https://localhost:3000`, and a backend server on `https://localhost:8080`.

If you'd prefer to use docker-compose, `docker-compose up` will install the dependencies and spin up the backend and frontend.

### Frontend

Using `create-react-app`. Websockets for synchronising clients. API for search.

In development, the frontend app runs on port `3000` by default.

### Backend

Using proposed ES+ modules with the `esm` shim module.
Any changes to the backend when running using `docker-compose`,
or `npm run dev` will result in the server restarting.

In development, the backend app runs on port `8080` by default.

### Packaging with Electron

Windows? You must install [windows-build-tools](!https://www.npmjs.com/package/windows-build-tools), by running `npm install --global --production windows-build-tools` in an administrator Powershell.

Run `npm run pack` to generate the binaries to test for your platform, and `npm run dist` to build an installer.

Electron-builder is used internally.

The backend will then run on port 42424.