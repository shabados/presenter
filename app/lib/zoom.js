import fetch from 'node-fetch'
import { toUnicode, stripVishraams } from 'gurmukhi-utils'

/**
 * Post line to Zoom for closed captions.
 * @param {string} apiKey Zoom api key.
 * @param {string} line Gurmukhi line data to send.
 * @param {number} seq Seq number for line.
 * @returns Promise.
 */
export const postToZoom = async ( apiKey, line, seq ) => fetch( `${apiKey}&seq=${seq}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain',
  },
  body: stripVishraams( toUnicode( line ) ),
} )
