import { createWriteStream } from 'fs'
import * as CSV from 'csv-string'

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

  update( data, transition = false ) {
    const { line = {} } = data

    // Do not add entry if it's the same line as the last
    if ( this.history.length ) {
      const { line: prevLine = {} } = this.history[ this.history.length - 1 ]

      if ( line.id === prevLine.id ) {
        return
      }
    }

    const entry = {
      timestamp: new Date(),
      ...data,
      transition,
    }

    this.history = [ ...this.history, entry ]
    this.append( entry )
  }

  getTransitionsOnly() {
    return this.history.filter( ( { transition } ) => transition )
  }

  get() {
    return this.history
  }

  reset() {
    this.history = []
  }

  pluckFields( data ) {
    return this.fields.reduce( ( final, [ field, transform = x => x ] ) => [
      ...final,
      field.reduce( ( curr, field ) => ( curr ? transform( curr[ field ] ) : curr ), data ),
    ], [] )
  }

  appendLine( data ) {
    const csv = CSV.stringify( data )
    this.writeStream.write( csv )
  }
}

export default History
