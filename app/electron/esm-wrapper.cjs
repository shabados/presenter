const [ ,, entry = 'entry' ] = process.argv
const file = entry === 'entry' ? `./entry.cjs` : `./${entry}.js`

import( file ).catch( err => {
  console.error( err )
  process.exit( 1 )
} )
