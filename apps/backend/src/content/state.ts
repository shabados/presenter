import { Content, Line, Shabad } from '@presenter/contract'
import { getLogger, mutableValue, readOnly, subscribable } from '@presenter/node'
import { clamp } from 'lodash'

import { getBaniLines, getShabad, getShabadByOrderId, getShabadRange } from '../services/database'

const log = getLogger( 'content' )

const indexLines = ( lines: Line[] ) => lines.reduce( ( acc, line ) => {
  const { byId, byOrderId } = acc

  // eslint-disable-next-line no-param-reassign
  byId[ line.id ] = line
  // eslint-disable-next-line no-param-reassign
  byOrderId[ line.orderId ] = line

  return acc
}, { byId: {}, byOrderId: {} } as { byId: Record<string, Line>, byOrderId: Record<number, Line> } )

const createState = () => {
  const content = subscribable( mutableValue<Content | null>( null ) )

  const lineId = subscribable( mutableValue<string | null>( null ) )
  const trackerMainLineId = subscribable( mutableValue<string | null>( null ) )
  const trackerNextLineId = subscribable( mutableValue<string | null>( null ) )

  const linesById = mutableValue<Record<string, Line>>( {} )
  const linesByOrderId = mutableValue<Record<number, Line>>( {} )

  const shabadRangePromise = getShabadRange()

  content.onChange( ( content ) => {
    if ( !content ) return

    const { byId, byOrderId } = indexLines( content.lines as Line[] )

    linesById.set( byId )
    linesByOrderId.set( byOrderId )
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

  const setLineOrderId = ( id: number ) => {
    const contentData = content.get()
    if ( !contentData ) return

    const { lines } = contentData

    // Clamp line order IDs that exceed the Shabad's range of lines, if specified
    //! Invalid order IDs are possible in Banis, since the lines are not always continguous
    const [ lowerOrderId, upperOrderId ] = [
      lines[ 0 ],
      lines[ lines.length - 1 ],
    ].map( ( { orderId } ) => orderId )

    const clampedOrderId = clamp( id, lowerOrderId, upperOrderId )

    const lineId = linesByOrderId.get()[ clampedOrderId ].id

    if ( !lineId ) {
      log.error( 'Line ID by order ID %d (clamped %d) not found', id, clampedOrderId )
      return
    }

    setLine( lineId )
  }

  type SetContentOptions = {
    type: 'shabad',
    id: string,
    lineId?: string,
  } | {
    type: 'bookmark',
    id: number,
  }

  const setShabad = async ( { id, type, lineId }: SetContentOptions ) => {
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
    lineId.s( id )
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
    setLineOrderId,
    setShabad,
    setShabadOrderId,
    setTrackerMainLine,
    setTrackerNextLine,
    clearLine,
    openLine,
  }
}

export default createState
