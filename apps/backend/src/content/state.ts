import { Content, Line } from '@presenter/contract'
import { getLogger, mutableValue, readOnly, subscribable } from '@presenter/node'
import { first, last } from '@presenter/swiss-knife'
import { clamp } from 'lodash'

import { getBaniLines, getShabad, getShabadByOrderId, getShabadRange } from '../services/database'

const log = getLogger( 'content' )

const indexLines = ( lines: Line[] ) => lines.reduce(
  ( acc, line, index ) => {
    const { byId, byIndex } = acc

    // eslint-disable-next-line no-param-reassign
    byId[ line.id ] = line
    // eslint-disable-next-line no-param-reassign
    byIndex.set( line, index )

    return acc
  },
  {
    byId: {},
    byIndex: new WeakMap<Line, number>(),
  } as { byId: Record<string, Line>, byIndex: WeakMap<Line, number> }
)

const createState = () => {
  const content = subscribable( mutableValue<Content | null>( null ) )

  const lineId = subscribable( mutableValue<string | null>( null ) )
  const trackerMainLineId = subscribable( mutableValue<string | null>( null ) )
  const trackerNextLineId = subscribable( mutableValue<string | null>( null ) )

  const linesById = mutableValue<Record<string, Line>>( {} )
  const linesByIndex = mutableValue<WeakMap<Line, number>>( new WeakMap() )

  const shabadRangePromise = getShabadRange()

  content.onChange( ( content ) => {
    if ( !content ) return

    const { byId, byIndex } = indexLines( content.lines as Line[] )

    linesById.set( byId )
    linesByIndex.set( byIndex )
  } )

  const clearLine = () => {
    lineId.set( null )

    log.info( 'Cleared current line ID' )
  }

  const setLine = ( id: string ) => {
    if ( !linesById.get()[ id ] ) {
      log.error( 'Line ID %s not found in current content' )
      return
    }

    lineId.set( id )

    log.info( 'Set Line ID to %s', id )
  }

  const setNextLine = () => {
    const contentData = content.get()
    const currentLineId = lineId.get()
    if ( !contentData || !currentLineId ) return

    const { lines } = contentData

    const currentLine = linesById.get()[ currentLineId ]
    const currentLineIndex = linesByIndex.get().get( currentLine )
    if ( currentLineIndex === undefined ) {
      log.error( 'Line ID %s not found in current content', currentLineId )
      return
    }

    const nextLine = lines[ currentLineIndex + 1 ]
    if ( !nextLine ) {
      log.error( 'Line ID %s is the last line in the shabad', currentLineId )
      return
    }

    setLine( nextLine.id )
  }

  const setPreviousLine = () => {
    const contentData = content.get()
    const currentLineId = lineId.get()
    if ( !contentData || !currentLineId ) return

    const { lines } = contentData

    const currentLineIndex = linesByIndex.get().get( linesById.get()[ currentLineId ] )
    if ( currentLineIndex === undefined ) {
      log.error( 'Line ID %s not found in current content', currentLineId )
      return
    }

    const previousLine = lines[ currentLineIndex - 1 ]
    if ( !previousLine ) {
      log.error( 'Line ID %s is the first line in the shabad', currentLineId )
      return
    }

    setLine( previousLine.id )
  }

  type SetContentOptions = {
    type: 'shabad',
    id: string,
    lineId?: string,
  } | {
    type: 'bookmark',
    id: number,
  }

  const setShabadContent = async ( { id, type, lineId }: SetContentOptions ) => {
    log.info( `Setting shabad ID to ${id}` )

    const shabad = getShabad( id )

    trackerMainLineId.set( null )
    trackerNextLineId.set( null )
    content.set( shabad )

    // Try to use previous history values
    const { mainLineIdd, nextLineId: prevNextLineId } = history.getLatestFor( shabad.id ) || {}

    trackerMainLineId.set( mainLineIdd ?? id )

    const { lines } = shabad

    // Next line is either first line, or line after
    const { id: nextLineIdd } = lines[ 0 ].id === newLineId ? lines[ 1 ] : lines[ 0 ]
    trackerNextLineId.set( prevNextLineId ?? nextLineIdd )
  }

  type SetBookmarkOptions = {
    baniId: number,
    lineId?: string,
  }

  const setBookmark = async ( { baniId, lineId }: SetBookmarkOptions ) => {
    log.info( `Setting the Bani ID to ${baniId}` )

    const bani = await getBaniLines( baniId )

    if ( !bani.lines?.length ) {
      log.error( `Bani ID ${baniId} is empty` )
      return
    }

    const { lines: [ firstLine ] } = bani
    const id = lineId ?? firstLine.id

    content.set( bani )
    lineId.set( id )
    trackerMainLineId.set( null )
    trackerNextLineId.set( null )

    // Use last line navigated to of shabad, if exists
    const { line } = history.getLatestFor( bani.id ) ?? {}
    setLine( { lineId: line ? line.id : id }, true )
  }

  const setShabad = async ( id: string, lineId: string ) => {
    const shabad = await getShabad( id )

    return setShabad( shabad, lineId )
  }

  const setShabadOrderId = ( orderId: number ) => shabadRangePromise
    .then( ( range ) => clamp( orderId, ...range ) )
    .then( getShabadByOrderId )
    .then( setShabad )

  const setTrackerMainLine = ( id: string ) => {
    if ( !content.get() ) return

    log.info( 'Setting mainLineId to %s', id )
    trackerMainLineId.set( id )
  }

  const setTrackerNextLine = ( id: string ) => {
    if ( !content.get() ) return

    log.info( 'Setting nextLineId to %s', id )
    trackerNextLineId.set( id )
  }

  return {
    content: readOnly( content ),
    lineId: readOnly( lineId ),
    trackerMainLineId: readOnly( trackerMainLineId ),
    trackerNextLineId: readOnly( trackerNextLineId ),
    setBookmark,
    setLine,
    setPreviousLine,
    setNextLine,
    setShabad,
    setShabadOrderId,
    setTrackerMainLine,
    setTrackerNextLine,
    clearLine,
    openLine,
  }
}

export default createState
