import { createWriteStream } from 'fs'
import * as CSV from 'csv-string'
import { omit } from 'lodash'

import { HISTORY_FILE } from './consts'

// Fields to store in the history CSV file
const CSV_FIELDS = [
  [ 'timestamp', t => t.toISOString() ],
  [ 'line.gurmukhi' ],
  [ 'line.translation' ],
  [ 'line.transliteration' ],
  [ 'line.punjabi' ],
  [ 'line.id' ],
  [ 'line.shabadId' ],
  [ 'transition' ],
]

/**
 * Class for reading, writing, and retrieving history.
 */
class History {
  writeStream = null

  history = {}

  /**
   * Initialises the History class.
   * Generates the correct fields and opens a write file stream.
   * @param {Array} fields The fields from a line to write to file.
   */
  constructor( fields = CSV_FIELDS ) {
    this.reset()
    // Split dot properties up
    this.fields = fields.map( ( [ field, transform ] ) => [ field.split( '.' ), transform ] )

    // Write headers the first time this is called
    this.append = data => {
      this.writeStream = createWriteStream( HISTORY_FILE, { encoding: 'utf8' } )
      // Re-bind function
      this.append = data => this.appendLine( this.pluckFields( data ) )

      // Append header separately
      this.appendLine( fields.map( ( [ field ] ) => field ) )
      this.append( data )
    }
  }

  /**
   * Updates the history with a new line, if it's unique.
   * @param {Object} data The data to update the history with.
   * @param {boolean} transition Whether this entry was triggered by a new Shabad selection.
   */
  update( data, transition = false ) {
    const { transitions, latestLine, viewedLines, lastEntry } = this.history

    const { line = {}, bani, mainLineId, nextLineId } = data
    const shabad = omit( line.shabad || data.shabad, [ 'lines' ] )

    // Do not add entry if it's the same line as the last
    const { line: prevLine = {} } = lastEntry || {}
    if ( line.id === prevLine.id ) return

    // The history id is the bani id or shabad id
    const historyId = bani ? bani.id : shabad.id

    const timestamp = new Date()
    const entry = {
      timestamp,
      transition,
      ...( !bani && { shabad } ),
      ...( mainLineId && { mainLineId } ),
      ...( nextLineId && { nextLineId } ),
      line: omit( line, [ 'transliterations', 'translations', 'shabad' ] ),
      ...( bani && { bani: omit( bani, [ 'lines' ] ) } ),
    }

    // Store the latest entry
    this.history.lastEntry = entry

    // Store the transition entry, if any
    if ( transition && line.id ) transitions[ timestamp.toISOString() ] = entry

    // Store the latest line for the id
    latestLine[ historyId ] = entry

    // Add to timestamps of the viewed lines
    if ( !viewedLines[ historyId ] ) viewedLines[ historyId ] = {}
    viewedLines[ historyId ][ line.id ] = timestamp

    // Write to file
    this.append( entry )
  }

  /**
   * Gets all history entries which are transitions to new Shabads.
   * @returns {Array} A list of the history entries.
   */
  getTransitionsOnly() {
    const { transitions } = this.history
    return transitions
  }

  /**
   * Fetches all the viewed lines for a transition group at a given timestamp.
   * @param {Date} timestamp The timestamp to fetch viewed lines for.
   */
  getViewedLinesFor( id ) {
    const { viewedLines } = this.history
    return viewedLines[ id ] || {}
  }

  /**
   * Gets the latest line of each transition.
   */
  getLatestLines() {
    const { latestLine } = this.history
    return latestLine
  }

  getLatestFor( id ) {
    const { latestLine } = this.history
    return latestLine[ id ]
  }

  /**
   * Clears all history.
   */
  reset() {
    this.history = {
      lastEntry: null,
      lastTransitionTimestamp: new Date(),
      transitions: {},
      latestLine: {},
      viewedLines: {},
    }
  }

  /**
   * Filters out the correct fields for each row.
   * @param {Array} data The data to filter.
   * @returns {Array} A list of filtered data rows.
   */
  pluckFields( data ) {
    return this.fields.reduce( ( final, [ field, transform = x => x ] ) => [
      ...final,
      field.reduce( ( curr, field ) => ( curr ? transform( curr[ field ] ) : curr ), data ),
    ], [] )
  }

  /**
   * Appends a CSV line to file.
   * @param {Array} data A list representing the row to append, as is.
   */
  appendLine( data ) {
    const csv = CSV.stringify( data )
    this.writeStream.write( csv )
  }
}

export default History
