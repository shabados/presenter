// contentState.lineId.onChange(id => {
//   if (!id) return

//   history.viewedLines.get()[ id ] = Date.now()
//   history.viewedLines.set( viewedLines.get() )
// })

type HistoryModuleOptions = object

const createHistoryModule = ( _options: HistoryModuleOptions ) => {

}

export type HistoryModule = ReturnType<typeof createHistoryModule>

export default createHistoryModule
