const withCount = ( fn: () => Promise<void> ) => async ( count = 1 ) => {
  for ( let i = 0; i < count; i += 1 ) {
    // eslint-disable-next-line no-await-in-loop
    await fn()
  }
}

export const flushPromises = withCount(
  () => new Promise( ( resolve ) => setImmediate( resolve ) )
)

export const nextTick = withCount(
  () => new Promise( ( resolve ) => process.nextTick( resolve ) )
)
