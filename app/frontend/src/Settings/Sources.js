import React, { useEffect, useState } from 'react'
import { shape, objectOf, string, number } from 'prop-types'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

import Loader from '../components/Loader'
import { BACKEND_URL } from '../lib/consts'
import controller from '../lib/controller'

import { ResetButton } from './DynamicOptions'
import { Dropdown as Select } from '../components/form'

import './Sources.css'

const Sources = ( { sources: currentSources, device } ) => {
  const [ languages, setLanguages ] = useState()
  const [ { sources, recommended }, setSources ] = useState( {} )

  useEffect( () => {
    fetch( `${BACKEND_URL}/languages` ).then( res => res.json() ).then( ( { languages } ) => setLanguages( languages ) )
  }, [] )

  useEffect( () => {
    fetch( `${BACKEND_URL}/sources` ).then( res => res.json() ).then( setSources )
  }, [] )

  if ( !sources || !languages ) return <Loader />

  const getCurrentValue = ( sourceId, languageId ) => {
    const currentSource = currentSources[ sourceId ]

    const { id } = currentSource.translationSources[ languageId ]
      || recommended[ sourceId ].translationSources[ languageId ]

    return id
  }

  return (
    <div className="sources">
      <div className="source-list">

        {Object
          .entries( sources )
          .filter( ( [ , { translationSources } ] ) => Object.keys( translationSources ).length )
          .map( ( [ sourceId, {
            nameEnglish,
            nameGurmukhi,
            translationSources,
          } ] ) => (
            <details key={sourceId} className="source">
              <summary className="source-title">
                <div className="source-summary-content">
                  <div className="source-col-name">
                    <span>{nameEnglish}</span>
                  </div>
                  <div className="source-col-gurmukhi">
                    <span className="gurmukhi">{nameGurmukhi}</span>
                  </div>
                  <FontAwesomeIcon className="expand-icon" size="sm" icon={faChevronDown} />
                </div>
              </summary>

              <div className="source-details">
                <div className="translations">

                  <div className="translations-heading">
                    <span className="source-heading">Translations</span>
                  </div>

                  {languages
                    .filter( ( { id } ) => !!translationSources[ id ] )
                    .map( ( { id, nameEnglish } ) => (
                      <div key={id} className="translation-row">
                        <div className="translation-lang"><span className="overline">{nameEnglish}</span></div>

                        <div className="translation-select">
                          { translationSources[ id ].length > 1 ? (
                            <Select
                              value={getCurrentValue( sourceId, id )}
                              values={translationSources[ id ].map( (
                                ( { nameEnglish: name, id: value } ) => ( { name, value } )
                              ) )}
                              onChange={( { target: { value } } ) => controller.setSettings( {
                                sources: {
                                  [ sourceId ]: {
                                    translationSources: {
                                      [ id ]: translationSources[ id ].find(
                                        ( { id } ) => id === value,
                                      ),
                                    },
                                  },
                                },
                              }, device )}
                            />
                          ) : (
                            <span>{translationSources[ id ][ 0 ].nameEnglish}</span>
                          ) }
                        </div>

                      </div>
                    ) )}

                </div>
              </div>

            </details>
          ) )}
      </div>

      <ResetButton group="sources" />
    </div>
  )
}

Sources.propTypes = {
  device: string.isRequired,
  sources: objectOf( shape( {
    nameEnglish: string.isRequired,
    nameGurmukhi: string.isRequired,
    translationSources: objectOf( shape( {
      id: number.isRequired,
      nameEnglish: string.isRequired,
    } ) ),
  } ) ).isRequired,
}

export default Sources
