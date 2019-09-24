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
  /**
   * Initialises the History class.
   * Generates the correct fields and opens a write file stream.
   * @param {Array} fields The fields from a line to write to file.
   */
  constructor( fields = CSV_FIELDS ) {
    this.writeStream = null
    this.history = []

    // Split dot properties up
    this.fields = fields.map( ( [ field, transform ] ) => [ field.split( '.' ), transform ] )

    // Write headers the first time this is called
    this.append = data => {
      this.writeStream = createWriteStream( HISTORY_FILE, { encoding: 'utf8' } )
      // Re-bind function
      this.append = data => this.appendLine( this.pluckFields( data ) )

      // Append header separately
      this.appendLine( CSV_FIELDS.map( ( [ field ] ) => field ) )
      this.append( data )
    }
  }

  /**
   * Updates the history with a new line, if it's unique.
   * @param {Object} data The data to update the history with.
   * @param {boolean} transition Whether this entry was triggered by a new Shabad selection.
   */
  update( data, transition = false ) {
    const { line = {}, bani } = data

    // Do not add entry if it's the same line as the last
    if ( this.history.length ) {
      const { line: prevLine = {} } = this.history[ this.history.length - 1 ]

      if ( line.id === prevLine.id ) return
    }

    const entry = {
      timestamp: new Date(),
      ...data,
      ...( bani && { bani: omit( bani, [ 'lines' ] ) } ),
      transition,
    }

    this.history = [ ...this.history, entry ]
    this.append( entry )
  }

  /**
   * Gets all history entries which are transitions to new Shabads.
   * @returns {Array} A list of the history entries.
   */
  getTransitionsOnly() {
    return this.history.filter( ( { transition } ) => transition )
  }

  /**
   * Gets all the history.
   * @returns {Array} A list of all the history.
   */
  get() {
    return this.history
  }

  /**
   * Clears all history.
   */
  reset() {
    this.history = []
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
