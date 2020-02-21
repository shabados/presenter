import React, { useEffect, useState } from 'react'
import { shape, objectOf, string, number, func } from 'prop-types'

import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
  Grid,
} from '@material-ui/core'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

import Loader from '../shared/Loader'
import { BACKEND_URL } from '../lib/consts'

import { ResetButton } from './DynamicOptions'
import { Dropdown as Select } from './SettingComponents'

import './Sources.css'

/**
 * View to configure source content, such as translations.
 */
const Sources = ( { sources: currentSources, setSettings } ) => {
  const [ languages, setLanguages ] = useState()
  const [ { sources, recommended }, setSources ] = useState( {} )

  useEffect( () => {
    fetch( `${BACKEND_URL}/languages` ).then( res => res.json() ).then( ( { languages } ) => setLanguages( languages ) )
  }, [] )

  useEffect( () => {
    fetch( `${BACKEND_URL}/sources` ).then( res => res.json() ).then( setSources )
  }, [] )


  if ( !sources || !languages ) return <Loader />

  // Gets the current selected value of a language's translation, using the recommended otherwise.
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
            <ExpansionPanel key={sourceId} className="source">
              <ExpansionPanelSummary className="source-title" expandIcon={<FontAwesomeIcon size="sm" icon={faChevronDown} />}>
                <Grid container>
                  <Grid item xs={6} md={5}>
                    <Typography variant="body2">{nameEnglish}</Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography className="gurmukhi">{nameGurmukhi}</Typography>
                  </Grid>
                </Grid>
              </ExpansionPanelSummary>

              <ExpansionPanelDetails className="source-details">
                <Grid container className="translations">

                  <Grid item xs={12}>
                    <Typography className="source-heading">Translations</Typography>
                  </Grid>

                  {languages
                    .filter( ( { id } ) => !!translationSources[ id ] )
                    .map( ( { id, nameEnglish } ) => (
                      <Grid key={id} container item xs={12}>
                        <Grid item xs={5} md={3}><Typography variant="overline">{nameEnglish}</Typography></Grid>

                        <Grid item xs>
                          { translationSources[ id ].length > 1 ? (
                            <Select
                              value={getCurrentValue( sourceId, id )}
                              values={translationSources[ id ].map( (
                                ( { nameEnglish: name, id: value } ) => ( { name, value } )
                              ) )}
                              onChange={( { target: { value } } ) => setSettings( {
                                sources: {
                                  [ sourceId ]: {
                                    translationSources: {
                                      [ id ]: translationSources[ id ].find(
                                        ( { id } ) => id === value,
                                      ),
                                    },
                                  },
                                },
                              } )}
                            />
                          ) : (
                            <Typography variant="body2">{translationSources[ id ][ 0 ].nameEnglish}</Typography>
                          ) }
                        </Grid>

                      </Grid>
                    ) )}

                </Grid>
              </ExpansionPanelDetails>

            </ExpansionPanel>
          ) )}
      </div>

      <ResetButton group="sources" />
    </div>
  )
}

Sources.propTypes = {
  sources: objectOf( shape( {
    nameEnglish: string.isRequired,
    nameGurmukhi: string.isRequired,
    translationSources: objectOf( shape( {
      id: number.isRequired,
      nameEnglish: string.isRequired,
    } ) ),
  } ) ).isRequired,
  setSettings: func.isRequired,
}

export default Sources
