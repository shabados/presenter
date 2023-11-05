//! To be refactored into shared utilities - @shabados/transformers?
import { Line, Shabad } from '@presenter/contract'
import { mutableCounter, mutableValue } from '@presenter/node/src/mutable-value'
import { LANGUAGES, TRANSLATION_ORDER, TRANSLITERATION_ORDER } from '@shabados/frontend/src/lib/data'
import { customiseLine, getTranslations, getTransliterators } from '@shabados/frontend/src/lib/line'
import { stripVishraams, toUnicode } from 'gurmukhi-utils'
import { mapValues } from 'lodash'
import Url from 'url-parse'

import fetch from '../helpers/fetch'
import settings from '../settings'
import { getSources, GetSourcesResult } from './database'

const prepareSecondary = ( data, sorter ) => Object
  .entries( data )
  .sort( ( [ n1 ], [ n2 ] ) => sorter[ n1 ] - sorter[ n2 ] )
  .map( ( [ , content ] ) => content )
  .join( '\n' )

type PrepareCaptionOptions = {
  shabad?: Shabad,
  line?: Line,
  sources: GetSourcesResult,
}

const prepareCaption = ( {
  shabad,
  line,
  sources: { recommendedSources },
}: PrepareCaptionOptions ) => {
  if ( !line ) return ''

  const { typeId } = line
  const {
    lineEnding,
    larivaarGurbani,
    englishTranslation,
    englishTransliteration,
    hindiTransliteration,
    punjabiTranslation,
    spanishTranslation,
    urduTransliteration,
  } = settings.get().closedCaptions

  const gurmukhi = stripVishraams( larivaarGurbani
    ? line.gurmukhi.replace( / /g, '' )
    : line.gurmukhi )

  const transliterations = mapValues(
    getTransliterators( [
      englishTransliteration && LANGUAGES.english,
      hindiTransliteration && LANGUAGES.hindi,
      urduTransliteration && LANGUAGES.urdu,
    ] ),
    ( transliterate ) => transliterate( customiseLine( gurmukhi, { lineEnding, typeId } ) ),
  )

  const translations = mapValues(
    getTranslations( {
      languageIds: [
        englishTranslation && LANGUAGES.english,
        punjabiTranslation && LANGUAGES.punjabi,
        spanishTranslation && LANGUAGES.spanish,
      ],
      shabad,
      line,
      //* Use the recommended source for translations
      sources: recommendedSources,
      recommendedSources,
    } ),
    ( translation ) => customiseLine( translation, { lineEnding, typeId } ),
  )

  return [
    toUnicode( gurmukhi ),
    prepareSecondary( translations, TRANSLATION_ORDER ),
    prepareSecondary( transliterations, TRANSLITERATION_ORDER ),
  ].filter( ( x ) => x ).join( '\n' )
}

const getApiKey = () => settings.get().closedCaptions.zoomApiToken

const createZoom = () => {
  const previousSeq = mutableCounter( undefined )
  const isReady = mutableValue( false )
  const sources = mutableValue<GetSourcesResult>( undefined )

  settings.onChange( ( {
    closedCaptions: { zoomApiToken },
  } ) => isReady.set( !!zoomApiToken && !!sources ) )

  const initialise = async () => {
    sources.set( await getSources() )
    isReady.set( !!getApiKey() )
  }

  const syncRemoteSeq = async () => {
    const endpoint = new Url( getApiKey()! )
    endpoint.set( 'pathname', `${endpoint.pathname}/seq` )

    return fetch<number>( endpoint.toString() ).then( previousSeq.set )
  }

  type SendLineOptions = {
    shabad?: Shabad,
    line?: Line,
  }

  const sendLine = async ( { shabad, line }: SendLineOptions ) => {
    if ( !isReady.get() ) return

    // If Shabad OS is interrupted during a broadcast, this will allow it to pick up again
    if ( previousSeq.get() === undefined ) await syncRemoteSeq()

    const endpoint = new Url( getApiKey()! )
    endpoint.set( 'query', `${endpoint.query}&seq=${previousSeq.get() + 1}` )

    await fetch( endpoint.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: prepareCaption( { sources: sources.get(), shabad, line } ),
    } )

    previousSeq.increment()
  }

  return { initialise, sendLine }
}

export default createZoom
