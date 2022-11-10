export const flushPromises = () => new Promise( ( resolve ) => setImmediate( resolve ) )

export const nextTick = () => new Promise( ( resolve ) => process.nextTick( resolve ) )
