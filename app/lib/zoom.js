import { toUnicode, stripVishraams } from 'gurmukhi-utils'
import { mapValues } from 'lodash'
import Url from 'url-parse'

//! To be refactored into shared utilities
import { LANGUAGES, TRANSLATION_ORDER, TRANSLITERATION_ORDER } from '../frontend/src/lib/data'
import { customiseLine, getTranslations, getTransliterators } from '../frontend/src/lib/line'

import { getSources } from './db'
import fetch from './fetch'
import settings from './settings'

const getApiKey = () => settings.get( 'closedCaptions.zoomApiToken' )

const prepareSecondary = ( data, sorter ) => Object
  .entries( data )
  .sort( ( [ n1 ], [ n2 ] ) => sorter[ n1 ] - sorter[ n2 ] )
  .map( ( [ , content ] ) => content )
  .join( '\n' )

const prepareCaptionWith = ( { recommendedSources } ) => ( { shabad, line } ) => {
  if ( !line ) return ''

  const { typeId } = line
  const lineEnding = settings.get( 'closedCaptions.lineEnding' )

  const gurmukhi = stripVishraams(
    settings.get( 'closedCaptions.larivaarGurbani' )
      ? line.gurmukhi.replace( / /g, '' )
      : line.gurmukhi,
  )

  const transliterations = mapValues(
    getTransliterators( [
      settings.get( 'closedCaptions.englishTransliteration' ) && LANGUAGES.english,
      settings.get( 'closedCaptions.hindiTransliteration' ) && LANGUAGES.hindi,
      settings.get( 'closedCaptions.urduTransliteration' ) && LANGUAGES.urdu,
    ] ),
    transliterate => transliterate( customiseLine( gurmukhi, { lineEnding, typeId } ) ),
  )

  const translations = mapValues(
    getTranslations( {
      languageIds: [
        settings.get( 'closedCaptions.englishTranslation' ) && LANGUAGES.english,
        settings.get( 'closedCaptions.punjabiTranslation' ) && LANGUAGES.punjabi,
        settings.get( 'closedCaptions.spanishTranslation' ) && LANGUAGES.spanish,
      ],
      shabad,
      line,
      //* Use the recommended source for translations
      sources: recommendedSources,
      recommendedSources,
    } ),
    translation => customiseLine( translation, { lineEnding, typeId } ),
  )

  return [
    toUnicode( gurmukhi ),
    prepareSecondary( translations, TRANSLATION_ORDER ),
    prepareSecondary( transliterations, TRANSLITERATION_ORDER ),
  ].filter( x => x ).join( '\n' )
}

class ZoomController {
  previousSeq = null

  prepareCaption = null

  isReady = () => [ getApiKey(), this.prepareCaption ].every( x => x )

  async init() {
    this.prepareCaption = prepareCaptionWith( await getSources() )
  }

  async sendLine( { shabad, line } ) {
    if ( !this.isReady() ) return

    // If Shabad OS is interrupted during a broadcast, this will allow it to pick up again
    if ( this.previousSeq === null ) await this.fetchPreviousSeq()

    const nextSeq = this.previousSeq + 1

    const endpoint = new Url( getApiKey() )
    endpoint.set( 'query', `${endpoint.query}&seq=${nextSeq}` )

    await fetch( endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: this.prepareCaption( { shabad, line } ),
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
