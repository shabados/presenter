import React, { useContext } from 'react'
import { string } from 'prop-types'
import { useLocation } from 'react-router-dom'

import { Typography, Grid } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { OPTIONS, DEFAULT_OPTIONS } from '../lib/options'
import controller from '../lib/controller'
import { SettingsContext } from '../lib/contexts'

import SettingComponentFactory from './SettingComponents'

const DynamicOptions = ( { device, group } ) => {
  const settings = useContext( SettingsContext )
  const { pathname } = useLocation()

  const isServer = pathname.split( '/' ).includes( 'server' )
  const selectedDevice = isServer ? 'global' : device

  const defaultSettings = isServer ? DEFAULT_OPTIONS.global : DEFAULT_OPTIONS.local

  const setSettings = ( option, value ) => controller.setSettings( {
    [ group ]: { [ option ]: value },
  }, selectedDevice )

  return Object.entries( defaultSettings[ group ] || {} ).map( ( [ option, defaultValue ] ) => {
    const optionGroup = settings[ selectedDevice ][ group ] || {}
    const value = typeof optionGroup[ option ] === 'undefined' ? defaultValue : optionGroup[ option ]
    const options = OPTIONS[ option ]
    const { type, privacy, name, icon, ...props } = options

    // Get correct component
    const Option = SettingComponentFactory( type )

    return (
      <Grid key={option} container className="option" alignItems="center">
        <Grid item xs={2} sm={1}>{icon && <FontAwesomeIcon className="icon" icon={icon} />}</Grid>
        <Grid item xs={5} sm={6} md={4} lg={3}><Typography>{name}</Typography></Grid>
        <Grid item xs={5} sm={5} md={4} lg={3} align="center">
          <Option {...props} option={option} value={value} onChange={setSettings} />
        </Grid>
      </Grid>
    )
  } )
}

DynamicOptions.propTypes = {
  device: string.isRequired,
  group: string.isRequired,
}

export default DynamicOptions
