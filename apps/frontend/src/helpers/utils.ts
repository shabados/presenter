import deepmerge from 'deepmerge'
import { debounce } from 'lodash'
import { findDOMNode } from 'react-dom'
import scrollIntoView from 'scroll-into-view'

import { isMac } from './consts'

export const merge = <T1, T2>( source: Partial<T1>, destination: Partial<T2> ) => deepmerge(
  source,
  destination,
  { arrayMerge: ( _, source ) => source },
)

// eslint-disable-next-line react/no-find-dom-node
export const scrollIntoCenter = ( ref: any, options?: __ScrollIntoView.Settings ) => scrollIntoView(
  findDOMNode( ref ) as any,
  { time: 200, ...options }
)

export const debounceHotKey = ( fn: () => void ) => debounce( fn, 300, { leading: true } )

export const mapPlatformKey = ( key: string ) => ( isMac ? key.replace( 'ctrl', 'cmd' ) : key )

export type KeyMap = Record<string, string[]>

export const mapPlatformKeys = ( keyMap: KeyMap ) => ( isMac
  ? Object.entries( keyMap ).reduce( ( keyMap, [ name, sequences ] ) => ( {
    ...keyMap,
    [ name ]: sequences ? sequences.map( mapPlatformKey ) : null,
  } ), {} )
  : keyMap
)

export const filterFalsyValues = <T>(
  valuesToFilter: T[]
) => valuesToFilter.filter( ( item ) => item )

export const filterFalsyObjectValues = <K extends string | number | symbol, T>(
  valuesToFilter: Record<K, T>
) => Object.fromEntries(
  Object.entries( valuesToFilter ).filter( ( [ _, value ] ) => value )
) as Record<K, T>
