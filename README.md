# ShabadOS-Core

Contains the standalone frontend and backend web application for ShabadOS.

## Development

There are two methods:

(1) Node / npm

    # Dependencies node >= 8 and npm >= 5
    git clone https://github.com/ShabadOS/core.git
    cd core/backend
    npm install
    cd frontend
    npm install

    # Now run both servers in two terminals
    # backend at localhost:8080
    npm run dev

    # frontend at localhost:3000
    npm run start

(2) Docker

* Install `docker`
* Run `docker-compose up` to start both the frontend and backend servers.

### Frontend

Using `create-react-app`. Websockets for synchronising clients. API for search.

In development, the frontend app runs on port `3000` by default.

### Backend

Using proposed ES+ modules with the `@std/esm` shim module.
Any changes to the backend when running using `docker-compose`,
or `npm run dev` will result in the server restarting.

In development, the backend app runs on port `8080` by default.
