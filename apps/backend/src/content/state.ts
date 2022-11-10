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
  const mainLineId = subscribable( mutableValue<string | null>( null ) )
  const nextLineId = subscribable( mutableValue<string | null>( null ) )

  const linesById = subscribable( mutableValue<Record<string, Line>>( {} ) )
  const linesByOrderId = mutableValue<Record<number, Line>>( {} )

  const shabadRangePromise = getShabadRange()

  content.onChange( ( content ) => {
    if ( !content ) return

    const { byId, byOrderId } = indexLines( content.lines as Line[] )

    linesById.set( byId )
    linesByOrderId.set( byOrderId )
  } )

  const setLineId = ( id: string | null ) => {
    lineId.set( id )

    if ( !id ) {
      log.info( 'Cleared current line ID' )
      return
    }

    if ( !linesById.get()[ id ] ) {
      log.error( 'Line ID %s not found in current content' )
      return
    }

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

    setLineId( lineId )
  }

  const setShabad = async ( shabad: Shabad, lineId: string ) => {
    log.info( `Setting Shabad ID to ${shabad.id}` )

    mainLineId.set( null )
    nextLineId.set( null )
    content.set( shabad )

    // Try to use previous history values
    const { mainLineIdd, nextLineId: prevNextLineId } = history.getLatestFor( shabad.id ) || {}

    mainLineId.set( mainLineIdd ?? id )

    const { lines } = shabad

    // Next line is either first line, or line after
    const { id: nextLineIdd } = lines[ 0 ].id === newLineId ? lines[ 1 ] : lines[ 0 ]
    nextLineId.set( prevNextLineId ?? nextLineIdd )
  }

  const setShabadId = async ( id: string, lineId: string ) => {
    const shabad = await getShabad( id )

    return setShabad( shabad, lineId )
  }

  const setShabadOrderId = async ( orderId: number ) => {
    const [ minShabadOrderId, maxShabadOrderId ] = await shabadRangePromise
    const clampedOrderId = clamp( orderId, minShabadOrderId, maxShabadOrderId )

    const shabad = await getShabadByOrderId( clampedOrderId )

    return setShabad( shabad )
  }

  const setMainLine = ( id: string ) => {
    if ( !content.get() ) return

    log.info( 'Setting mainLineId to %s', id )
    mainLineId.set( id )
  }

  const setNextLine = ( id: string ) => {
    if ( !content.get() ) return

    log.info( 'Setting nextLineId to %s', id )
    nextLineId.set( id )
  }

  type SetBaniOptions = {
    baniId: number,
    lineId?: string,
  }

  const setBaniId = async ( { baniId, lineId }: SetBaniOptions ) => {
    log.info( `Setting the Bani ID to ${baniId}` )

    const bani = await getBaniLines( baniId )

    // Get first line ID of the Bani
    const { lines: [ firstLine ] } = bani
    const id = lineId ?? firstLine.id

    content.set( bani )
    mainLineId.set( null )
    nextLineId.set( null )

    // Use last line navigated to of shabad, if exists
    const { line } = history.getLatestFor( bani.id ) ?? {}
    setLine( { lineId: line ? line.id : id }, true )
  }

  return {
    content: readOnly( content ),
    lines: readOnly( linesById ),
    lineId: readOnly( lineId ),
    mainLineId: readOnly( mainLineId ),
    nextLineId: readOnly( nextLineId ),
    setBaniId,
    setLineId,
    setLineOrderId,
    setShabadId,
    setShabadOrderId,
    setMainLine,
    setNextLine,
  }
}

export default createState
