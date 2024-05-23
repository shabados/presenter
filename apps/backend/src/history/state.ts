import { Line, ViewedLines } from '@presenter/contract'
import { HISTORY_FILE, mutableValue, readOnly, subscribable } from '@presenter/node'
import * as CSV from 'csv-string'
import { createWriteStream, WriteStream } from 'fs'
import { omit } from 'lodash-es'

// Fields to store in the history CSV file
const CSV_FIELDS = [
  [ 'timestamp', ( t: Date ) => t.toISOString() ],
  [ 'line.gurmukhi' ],
  [ 'line.translation' ],
  [ 'line.transliteration' ],
  [ 'line.punjabi' ],
  [ 'line.id' ],
  [ 'line.shabadId' ],
  [ 'transition' ],
] as const

const CSV_HEADER_ROW = CSV_FIELDS.map( ( [ field ] ) => field )
const FIELDS = CSV_FIELDS.map( ( [ field, transform ] ) => [ field.split( '.' ), transform ] )

const pluckFields = ( data ) => FIELDS.reduce( ( final, [ field, transform = ( x ) => x ] ) => [
  ...final,
  field.reduce( ( curr, field ) => ( curr ? transform( curr[ field ] ) : curr ), data ),
], [] )

type CreateLazyWriteStreamOptions = {
  onInitialise?: ( stream: WriteStream ) => void,
}

const createLazyWriteStream = (
  { onInitialise }: CreateLazyWriteStreamOptions,
  ...initParams: Parameters<typeof createWriteStream>
) => {
  let stream = {
    write: ( ...params: Parameters<WriteStream['write']> ) => {
      stream = createWriteStream( ...initParams )

      onInitialise?.( stream )

      stream.write( ...params )
    },
  } as unknown as WriteStream

  return stream
}

const writeToStreamAsCsv = ( stream: WriteStream ) => ( data: Record<string, any> ) => stream
  .write( CSV.stringify( data ) )

const createHistoryState = () => {
  const stream = createLazyWriteStream(
    { onInitialise: ( stream ) => writeToStreamAsCsv( stream )( CSV_HEADER_ROW ) },
    HISTORY_FILE,
    { encoding: 'utf8' },
  )

  const appendAsCsv = writeToStreamAsCsv( stream )

  const append = ( data ) => appendAsCsv( pluckFields( data ) )

  const lastLine = mutableValue<Line | null>( null )
  const transitions = {}
  const lastLines = mutableValue<{ [shabadId] }>( {} )
  const allViewedLines = subscribable( mutableValue<ViewedLines>( {} ) )

  // Updates the history with a new line, if it's unique
  const update = ( data, isTransition = false ) => {
    const { line = {}, bani, mainLineId, nextLineId } = data
    const shabad = omit( line.shabad || data.shabad, [ 'lines' ] )

    // Do not add entry if it's the same line as the last
    const { line: prevLine = {} } = lastEntry ?? {}
    if ( line.id === prevLine.id ) return

    const historyId = bani ? bani.id : shabad.id

    const timestamp = new Date()
    const entry = {
      timestamp,
      transition: isTransition,
      ...( !bani && { shabad } ),
      ...( mainLineId && { mainLineId } ),
      ...( nextLineId && { nextLineId } ),
      line: omit( line, [ 'transliterations', 'translations', 'shabad' ] ),
      ...( bani && { bani: omit( bani, [ 'lines' ] ) } ),
    }

    lastEntry = entry

    // Store the transition entry, if any
    if ( isTransition && line.id ) transitions[ timestamp.toISOString() ] = entry

    // Store the latest line for the id
    latestLine[ historyId ] = entry

    // Add to timestamps of the viewed lines
    if ( !viewedLines[ historyId ] ) viewedLines[ historyId ] = {}
    viewedLines[ historyId ][ line.id ] = timestamp

    append( entry )
  }

  const getViewedLinesFor = ( date: number ) => viewedLines[ date ] ?? {}

  const clearHistory = () => {
    lastEntry
  }

  return {
    transitions: readOnly( transitions ),
    latestLines,
    lastLine,
    clearHistory,
    getViewedLinesFor,
    update,
  }
}

export default createHistoryState
