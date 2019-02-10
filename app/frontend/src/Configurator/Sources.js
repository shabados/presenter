import React, { useEffect, useState } from 'react'
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, CircularProgress, Typography, Grid } from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons'

import { BACKEND_URL } from '../lib/consts'

import Dropdown from '../shared/Dropdown'

import './Sources.css'


const Sources = ( { sources: currentSources, setSettings } ) => {
  const [ languages, setLanguages ] = useState()
  const [ { sources, recommendedSources }, setSources ] = useState( {} )

  useEffect( () => {
    fetch( `${BACKEND_URL}/languages` ).then( res => res.json() ).then( ( { languages } ) => setLanguages( languages ) )
  }, [] )

  useEffect( () => {
    fetch( `${BACKEND_URL}/sources` ).then( res => res.json() ).then( setSources )
  }, [] )


  if ( !sources || !languages ) return <CircularProgress style={{ alignSelf: 'center' }} />

  // Gets the current selected value of a language's translation, using the recommended otherwise.
  const getCurrentValue = ( sourceId, languageId ) => {
    const currentSource = currentSources[ sourceId ] || recommendedSources[ sourceId ]

    return currentSource.translationSources[ languageId ]
  }

  return (
    <div className="sources">
      {Object.entries( sources ).map( ( [ sourceId, {
        nameEnglish,
        nameGurmukhi,
        translationSources,
      } ] ) => (
        <ExpansionPanel key={sourceId} className="source">
          <ExpansionPanelSummary className="source-title" expandIcon={<ExpandMore />}>
            <Grid container>
              <Grid item xs={5}>
                <Typography variant="body2">{nameEnglish}</Typography>
              </Grid>
              <Grid item xs>
                <Typography className="gurmukhi">{nameGurmukhi}</Typography>
              </Grid>
            </Grid>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className="source-details">
            <Grid container className="translations">
              <Grid item xs={12}><Typography className="source-heading">Translations</Typography></Grid>
              {languages
              .filter( ( { id } ) => !!translationSources[ id ] )
              .map( ( { id, nameEnglish } ) => (
                <Grid key={id} item xs={12}>
                  <Dropdown
                    name={nameEnglish}
                    value={getCurrentValue( sourceId, id ).id}
                    values={translationSources[ id ].map( (
                    ( { nameEnglish: name, id: value } ) => ( { name, value } )
                  ) )}
                    onChange={( { target: { value } } ) => setSettings( {
                      sources: {
                        [ sourceId ]: {
                        translationSources: {
                          [ id ]: translationSources[ id ].find( ( { id } ) => id === value ),
                        },
                        },
                      },
                    } )}
                  />
                </Grid>
              ) )}
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        ) )}
    </div>
  )
}

export default Sources
