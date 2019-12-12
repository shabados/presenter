// eslint-disable-next-line import/no-extraneous-dependencies
import program from 'commander'
import { readFile } from 'fs-extra'
import WebSocket from 'ws'

const extractors = [
  [ 'lines:current', /Line ID to (.*)/, lineId => ( { lineId } ) ],
  [ 'shabads:current', /Shabad ID to (.*)/, shabadId => ( { shabadId } ) ],
  [ 'banis:current', /Bani ID to (.*)/, baniId => ( { baniId } ) ],
  [ 'lines:main', /mainLineId to (.*)/, mainLineId => mainLineId ],
  [ 'lines:next', /nextLineId to (.*)/, nextLineId => nextLineId ],
]

const getEntryAction = entry => {
  const { time, msg } = entry

  for ( const [ event, expression, transformer ] of extractors ) {
    const match = msg.match( expression )

    if ( match ) {
      return [ {
        timestamp: new Date( time ),
        event,
        value: match[ 1 ],
        transformer,
      } ]
    }
  }

  return []
}

const logToActions = log => log.reduce( ( actions, entry ) => [
  ...actions,
  ...getEntryAction( entry ),
], [] )

const readLog = async logFile => ( await readFile( logFile, 'utf8' ) )
  .split( '\n' )
  .filter( line => line.length )
  .map( line => JSON.parse( line ) )


const simulateActions = async ( actions, trueTime, port ) => new Promise( ( resolve, reject ) => {
  // Connect to the backend
  const socket = new WebSocket( `ws://localhost:${port}` )

  const replayAction = ( { event, value, transformer } ) => socket.send(
    JSON.stringify( { event, payload: transformer( value ) } ),
  )

  const actionLoop = async actionIndex => {
    const { timestamp, ...action } = actions[ actionIndex ]
    console.log( `Replaying action ${actionIndex + 1}/${actions.length} (${action.event}, ${action.value})` )

    await replayAction( action )

    const nextAction = actions[ actionIndex + 1 ]
    if ( !nextAction ) {
      resolve()
      return
    }

    const { timestamp: nextTimestamp } = nextAction
    const nextTime = trueTime ? nextTimestamp - timestamp : 500

    setTimeout( () => actionLoop( actionIndex + 1 ), nextTime )
  }

  socket.on( 'open', () => {
    console.log( 'Connected to Shabad OS' )

    actionLoop( 0 )
  } )

  socket.on( 'error', reject )
} )

const main = async () => {
  program
    .requiredOption( '-l --log-file <file>', 'Log file to replay' )
    .option( '-t, --true-time', 'Use the original timestamps to replay the log', false )
    .option( '-p, --port <port>', 'The port to connect to Shabad OS on', 42425 )
    .parse( process.argv )

  const { trueTime, logFile, port } = program.opts()

  console.log( `\nReading ${logFile}` )
  const log = await readLog( logFile )

  console.log( '\nRetrieving actions from log' )
  const actions = logToActions( log )

  const timePeriod = actions[ actions.length - 1 ].timestamp - actions[ 0 ].timestamp
  console.log( `${actions.length} actions read, carried out over a period of ${timePeriod / 1000 / 60} minutes` )

  console.log( '\nReplaying actions' )
  await simulateActions( actions, trueTime, port )
}

main()
  .then( () => process.exit( 0 ) )
  .catch( e => console.error( e ) || process.exit( 1 ) )
