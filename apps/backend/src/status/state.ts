import { mutableValue, readOnly, subscribable } from '@presenter/node'

const createStatusState = () => {
  const status = subscribable( mutableValue<string | null>( null ) )

  const notifyStatus = ( message: string, duration = 1000 * 30 ) => {
    status.set( message )
    setTimeout( () => status.set( null ), duration )
  }

  return { status: readOnly( status ), notifyStatus }
}

export default createStatusState
