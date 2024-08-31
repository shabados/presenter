import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import { useContext } from 'react'

import Loader from '~/components/Loader'
import { API_URL } from '~/helpers/consts'
import { SettingsContext } from '~/helpers/contexts'
import controller from '~/services/controller'

import { ResetButton } from '../../-components/DynamicOptions'
import { Dropdown as Select } from '../../-components/SettingsComponents'

type SourcesProps = {
  device: string,
}

const Sources = ( { device }: SourcesProps ) => {
  const settings = useContext( SettingsContext )
  const selectedDeviceSettings = settings[ device ] || settings.local

  const { languages, sources: { sources, recommendedSources } } = Route.useLoaderData()

  // Gets the current selected value of a language's translation, using the recommended otherwise.
  const getCurrentValue = ( sourceId, languageId ) => {
    const currentSource = selectedDeviceSettings.sources[ sourceId ]

    const { id } = currentSource.translationSources[ languageId ]
      || recommendedSources[ sourceId ].translationSources[ languageId ]

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
            <Accordion key={sourceId} className="source">
              <AccordionSummary className="source-title" expandIcon={<FontAwesomeIcon size="sm" icon={faChevronDown} />}>
                <Grid container>
                  <Grid item xs={6} md={5}>
                    <Typography variant="body2">{nameEnglish}</Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography className="gurmukhi">{nameGurmukhi}</Typography>
                  </Grid>
                </Grid>
              </AccordionSummary>

              <AccordionDetails className="source-details">
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
                            <Typography variant="body2">{translationSources[ id ][ 0 ].nameEnglish}</Typography>
                          ) }
                        </Grid>

                      </Grid>
                    ) )}

                </Grid>
              </AccordionDetails>

            </Accordion>
          ) )}
      </div>

      <ResetButton group="sources" />
    </div>
  )
}

export const Route = createFileRoute( '/settings/client/sources/' )( {
  component: Sources,
  pendingComponent: Loader,
  loader: () => {
    const languages = fetch( `${API_URL}/languages` ).then( ( res ) => res.json() )
    const sources = fetch( `${API_URL}/sources` ).then( ( res ) => res.json() )

    return Promise
      .all( [ languages, sources ] )
      .then( ( [ languages, sources ] ) => ( { languages, sources } ) )
  },
} )
