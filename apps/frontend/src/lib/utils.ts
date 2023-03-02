/**
 * Utility functions.
 * @ignore
 */

import deepmerge from 'deepmerge'
import { debounce } from 'lodash'
import queryString from 'qs'
import { Ref } from 'react'
import { findDOMNode } from 'react-dom'
import scrollIntoView from 'scroll-into-view'

import { isMac, STATES } from './consts'

/**
 * Merges the source object into the destination, replacing arrays.
 * @param {Object} source The source object.
 * @param {Object} destination The destination object.
 */
export const merge = <T1, T2>( source: Partial<T1>, destination: Partial<T2> ) => deepmerge(
  source,
  destination,
  { arrayMerge: ( _, source ) => source },
)

/**
 * Scrolls an element into the center, given a ref.
 * @param ref The reference to the element to scroll.
 * @param options Any options for the scroll function.
 */
// eslint-disable-next-line react/no-find-dom-node
export const scrollIntoCenter = ( ref: any, options?: __ScrollIntoView.Settings ) => scrollIntoView(
  findDOMNode( ref ) as any,
   {  time: 200,  ...options } 
)

/**
 * Returns the current query state of the URL, based on the defined states.
 * @param search The search component of the window location.
 * @returns {Object} Key-value pairs of the state and values.
 */
export const getUrlState = ( search: string ) => {
  const params = queryString.parse( search, { ignoreQueryPrefix: true } )

  return Object
    .entries( STATES )
    .reduce( ( acc, [ key, name ] ) => ( params[ name ] ? {
      ...acc,
      [ key ]: params[ name ],
    } : acc ), {} )
}

export const debounceHotKey = ( fn: () => void ) => debounce( fn, 300, { leading: true } )

export const mapPlatformKey = ( key: string ) => ( isMac ? key.replace( 'ctrl', 'cmd' ) : key )

export type KeyMap = { [key: string]: string[] }

/**
 * Maps ctrl to cmd in keyMap if on Mac.
 * @param {*} keyMap An object of all the keys and mapped values.
 */
export const mapPlatformKeys = ( keyMap: KeyMap ) => ( isMac
  ? Object.entries( keyMap ).reduce( ( keyMap, [ name, sequences ] ) => ( {
    ...keyMap,
    [ name ]: sequences ? sequences.map( mapPlatformKey ) : null,
  } ), {} )
  : keyMap
)

export const filterFalsyValues = <T>(
  valuesToFilter: Array<T>
) => valuesToFilter.filter( ( item ) => item )
