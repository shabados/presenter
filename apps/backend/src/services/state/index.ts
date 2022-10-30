import createContentState from './content'
// import createHistoryState from './history'
import createStatusState from './status'

const createState = () => {
  // const historyState = createHistoryState()
  const contentState = createContentState()

  // contentState.lineId.onChange(id => {
  //   if (!id) return

  //   history.viewedLines.get()[ id ] = Date.now()
  //   history.viewedLines.set( viewedLines.get() )
  // })

  return {
    ...createStatusState(),
    ...contentState,
    // ...historyState,
  }
}

export type State = ReturnType<typeof createState>

export default createState
