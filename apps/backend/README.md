# Presenter Backend

This is the Shabad OS presenter backend app, which can run in isolation from the `electron` and `frontend` apps.

Generally speaking, it carries out the following:

- Shared state management across websockets
- Pushing out data to other services (Zoom)
- Hot-updating of the `@shabados/database` module
