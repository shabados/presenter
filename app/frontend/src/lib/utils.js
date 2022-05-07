/**
 * Utility functions.
 * @ignore
 */

import deepmerge from 'deepmerge'
import { debounce } from 'lodash'
import queryString from 'qs'
import { findDOMNode } from 'react-dom'
import scrollIntoView from 'scroll-into-view'

import { isMac, STATES } from './consts'

/**
 * Merges the source object into the destination, replacing arrays.
 * @param {Object} source The source object.
 * @param {Object} destination The destination object.
 */
export const merge = ( source, destination ) => deepmerge(
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
export const scrollIntoCenter = ( ref, options ) => scrollIntoView( findDOMNode( ref ), ( {
  time: 200,
  ...options,
} ) )

/**
 * Returns the current query state of the URL, based on the defined states.
 * @param search The search component of the window location.
 * @returns {Object} Key-value pairs of the state and values.
 */
export const getUrlState = ( search ) => {
  const params = queryString.parse( search, { ignoreQueryPrefix: true } )

  return Object
    .entries( STATES )
    .reduce( ( acc, [ key, name ] ) => ( params[ name ] ? {
      ...acc,
      [ key ]: params[ name ],
    } : acc ), {} )
}

export const debounceHotKey = ( fn ) => debounce( fn, 300, { leading: true } )

export const mapPlatformKey = ( key ) => ( isMac ? key.replace( 'ctrl', 'cmd' ) : key )

/**
 * Maps ctrl to cmd in keyMap if on Mac.
 * @param {*} keyMap An object of all the keys and mapped values.
 */
export const mapPlatformKeys = ( keyMap ) => ( isMac
  ? Object.entries( keyMap ).reduce( ( keyMap, [ name, sequences ] ) => ( {
    ...keyMap,
    [ name ]: sequences ? sequences.map( mapPlatformKey ) : null,
  } ), {} )
  : keyMap
)
