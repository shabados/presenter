import { Content, Line } from '@presenter/contract'
import { getLogger, mutableValue, readOnly, subscribable } from '@presenter/node'
import { first, last } from '@presenter/swiss-knife'
import { clamp } from 'lodash'

import { getBaniLines, getShabad, getShabadByOrderId } from '../services/database'

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

  type SetBookmarkOptions = {
    id: number,
    lineId?: string,
  }

  const setBookmark = async ( options: SetBookmarkOptions ) => {
    log.info( `Setting Bani ID to ${options.id}` )

    const bani = await getBaniLines( options.id )

    if ( !bani ) {
      log.error( `Bani ID ${options.id} does not exist` )
      return
    }

    content.set( bani )

    const { lines: [ firstLine ] } = bani
    lineId.set( options.lineId ?? firstLine.id )

    // Use last line navigated to of shabad, if exists
    // const { line } = history.getLatestFor( bani.id ) ?? {}
    // setLine( { lineId: line ? line.id : id }, true )
  }

  type SetShabad = {
    id: string,
    lineId?: string,
  }

  const setShabad = async ( options: SetShabad ) => {
    log.info( `Setting shabad ID to ${options.id}` )

    const shabad = await getShabad( options.id )

    if ( !shabad ) {
      log.error( `Shabad ID ${options.id} does not exist` )
      return
    }

    trackerMainLineId.set( null )
    trackerNextLineId.set( null )
    content.set( shabad )

    const { lines: [ firstLine ] } = shabad
    lineId.set( options.lineId ?? firstLine.id )

    // Try to use previous history values
    // const { mainLineIdd, nextLineId: prevNextLineId } = history.getLatestFor( shabad.id ) || {}

    // trackerMainLineId.set( mainLineIdd ?? id )
    // trackerMainLineId.set( id )

    // const { lines } = shabad

    // Next line is either first line, or line after
    // const { id: nextLineId } = lines[ 0 ].id === newLineId ? lines[ 1 ] : lines[ 0 ]
    // trackerNextLineId.set( nextLineId )
  }

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
    setTrackerMainLine,
    setTrackerNextLine,
    clearLine,
  }
}

export default createState
