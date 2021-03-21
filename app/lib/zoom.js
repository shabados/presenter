import { toUnicode, stripVishraams } from 'gurmukhi-utils'
import Url from 'url-parse'

import fetch from './fetch'

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

class ZoomController {
  apiKey = null

  previousSeq = null

  setApiKey( apiKey ) {
    this.apiKey = apiKey || null
  }

  async sendLine( line ) {
    if ( !this.apiKey ) return

    // If Shabad OS is interrupted during a broadcast, this will allow it to pick up again
    if ( this.previousSeq === null ) await this.fetchPreviousSeq()

    const nextSeq = this.previousSeq + 1

    const endpoint = new Url( this.apiKey )
    endpoint.set( 'query', `${endpoint.query}&seq=${nextSeq}` )

    await fetch( `${this.apiKey}&seq=${nextSeq}`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: line ? stripVishraams( toUnicode( line.gurmukhi ) ) : '',
    } )

    this.previousSeq = nextSeq
  }

  async fetchPreviousSeq() {
    const endpoint = new Url( this.apiKey )
    endpoint.set( 'pathname', `${endpoint.pathname}/seq` )

    this.previousSeq = await fetch( endpoint )
  }
}

export default new ZoomController()
