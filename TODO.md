# Presenter Major Refactor

## General

- [ ] Recursion of data types aren't quite right. There's an extra layer of RecursiveHelper (see setShabadId)
- [ ] Extract stuff in transformers (zoom + FE utils)
- [x] Ensure performance of selecting by line ID vs next line/previous line is good
- [ ] Ensure performance of loading large bani is good
- [ ] Ensure startup time is good (use ASAR etc)
- [ ] Bundle **compiled** code
- [x] Get clear on paths
- [x] ESLint root package dependency usage
- [x] Move themes to `packages/themes`

## Backend

- [ ] Sort out history state
- [ ] Sort out zoom module
- [x] Sort out content state
- [x] Sort out search and actions
- [x] Sort out status
- [x] Sort out updater
- [x] Load global settings properly
- [x] Settings typings
- [ ] Do we need to **remove** settings on disconnection? See TODO in index-old
- [x] Ensure app folders, per module
- [x] Wire up server backend with state
- [x] Sort out structure of entrypoint/server
- [x] Confirm socket server doesn't conk out if all middleware isn't registered in time
- [ ] Lifted/centralised error handling
  - [ ] Expected errors concept, how can/should we retain log scope?

## Frontend

- [x] Move off CRA to Vite
- [ ] Separate out line jump into per file
- [x] Convert to TS
- [ ] Refactor routing to be centralised (per feature)
- [ ] Sort out `react-hotkeys` usage (error regarding no `parentId`)

## Electron

- [ ] Start dev BE server with Electon headless and remove "bridging dev" code
- [ ] Sort out index entrypoint
- [ ] Update & cleanup dependencies

## APM + Analytics

- [ ] Add Posthog
- [ ] Add New relic

## Migration Scripts

- [ ] Migrate custom themes from `%APPDATA%/Shabad OS/themes` to `%APPDATA%/Shabad OS/themes/presenter` and `%APPDATA%/Shabad OS/themes/overlay`
