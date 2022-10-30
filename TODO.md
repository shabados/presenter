# Presenter Major Refactor

## General

- [ ] Recursion of data types aren't quite right. There's an extra layer of RecursiveHelper (see setShabadId)
- [ ] Extract stuff in transformers (zoom + FE utils)
- [ ] Ensure performance of selecting by line ID vs next line/previous line is good
- [ ] Ensure performance of loading large bani is good
- [ ] Ensure startup time is good (use ASAR etc)
- [ ] Bundle **compiled** code
- [ ] Get clear on paths
- [ ] ESLint root package dependency usage

## Backend

- [ ] Sort out state
- [ ] Sort out history
- [ ] Settings typings
- [ ] Wire up server backend with state
- [ ] Sort out structure of entrypoint/server
- [ ] Confirm socket server doesn't conk out if all middleware isn't registered in time
- [ ] Lifted/centralised error handling
  - [ ] Expected errors concept, how can/should we retain log scope?

## Frontend

- [ ] Separate out line jump into per file
- [ ] Convert to TS

## Electron

- [ ] Start dev BE server with Electon headless and remove "bridging dev" code
- [ ] Sort out index entrypoint

## Bonus

- [ ] Add analytics
- [ ] Add Sentry performance monitoring
- [ ] Investigate newrelic/add
