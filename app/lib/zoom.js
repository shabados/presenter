import { toUnicode, stripVishraams } from 'gurmukhi-utils'
import Url from 'url-parse'

import fetch from './fetch'
import settings from './settings'

const getApiKey = () => settings.get( 'closedCaptioning.zoomApiToken' )

class ZoomController {
  previousSeq = null

  async sendLine( line ) {
    if ( !getApiKey() ) return

    // If Shabad OS is interrupted during a broadcast, this will allow it to pick up again
    if ( this.previousSeq === null ) await this.fetchPreviousSeq()

    const nextSeq = this.previousSeq + 1

    const endpoint = new Url( getApiKey() )
    endpoint.set( 'query', `${endpoint.query}&seq=${nextSeq}` )

    await fetch( endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: line ? stripVishraams( toUnicode( line.gurmukhi ) ) : '',
    } )

    this.previousSeq = nextSeq
  }

  async fetchPreviousSeq() {
    const endpoint = new Url( getApiKey() )
    endpoint.set( 'pathname', `${endpoint.pathname}/seq` )

    this.previousSeq = await fetch( endpoint )
  }
}

export default new ZoomController()
