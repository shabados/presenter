import { EventEmitter } from 'eventemitter3'
import { debounce } from 'lodash'

export type ReadOnlyMutable<T> = { get: () => T }
export type WriteOnlyMutable<T> = { set: ( value: T ) => void }

export type Mutable<T> = ReadOnlyMutable<T> & WriteOnlyMutable<T>

export const mutableValue = <T>( initialValue: T ): Mutable<T> => {
  let value = initialValue

  const set = ( newValue: T ) => { value = newValue }
  const get = () => value

  return { set, get }
}

export const mutableCounter = ( initialValue = 0 ) => {
  const { get, set } = mutableValue( initialValue )

  const increment = ( step = 1 ) => {
    set( get() + step )
    return get()
  }

  const decrement = ( step = 1 ) => increment( -step )

  return { get, set, increment, decrement }
}

export const subscribable = <T>( { get, set }: Mutable<T> ) => {
  const emitter = new EventEmitter<'change'>()

  const onChange = ( fn: ( value: T ) => any ) => emitter.on( 'change', fn )

  const emit = debounce( () => emitter.emit( 'change', get() ) )

  const setWithEmit = ( value: T ) => {
    set( value )
    emit()
  }

  return { get, set: setWithEmit, onChange }
}

export type Subscribable<T> = ReturnType<typeof subscribable<T>>

export const deferrable = <T, Rest = unknown>( {
  get,
  set,
  onChange,
  ...rest
}: Subscribable<T> & Rest ) => {
  const deferred = mutableValue<T>( get() )

  onChange( deferred.set )

  const commit = () => set( deferred.get() )

  const defer = ( value: T ) => deferred.set( value )

  return { get: deferred.get, set, defer, commit, onChange, ...rest }
}

export type Deferrable<T> = ReturnType<typeof deferrable<T>>

export const readOnly = <T, Rest = unknown>( {
  set,
  ...rest
}: WriteOnlyMutable<T> & Rest ) => ( { ...rest } )
