import React, { useContext } from 'react'
import { string, shape, node } from 'prop-types'

import { Typography, Grid } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { OPTIONS, DEFAULT_OPTIONS } from '../lib/options'
import controller from '../lib/controller'
import { SettingsContext } from '../lib/contexts'

import SettingComponentFactory from './SettingComponents'

export const slotSizes = {
  icon: { xs: 2, sm: 1 },
  name: { xs: 5, sm: 5, md: 4, lg: 4 },
  option: { xs: 5, sm: 5, md: 4, lg: 3 },
  single: { xs: 12, sm: 11, md: 9, lg: 8 },
}

export const OptionGrid = ( { children, ...props } ) => (
  <Grid {...props} className="option" container>
    {children}
  </Grid>
)
OptionGrid.propTypes = { children: node.isRequired }

export const IconSlot = ( { icon } ) => (
  <Grid item {...slotSizes.icon} center="center">
    <FontAwesomeIcon className="icon" icon={icon} />
  </Grid>
)
IconSlot.propTypes = { icon: shape( {} ).isRequired }

export const NameSlot = ( { children } ) => (
  <Grid item {...slotSizes.name}>
    <Typography>{children}</Typography>
  </Grid>
)
NameSlot.propTypes = { children: string.isRequired }

export const OptionSlot = ( { children } ) => (
  <Grid align="center" item {...slotSizes.option}>
    {children}
  </Grid>
)
OptionSlot.propTypes = { children: node.isRequired }

const DynamicOptions = ( { device, group } ) => {
  const settings = useContext( SettingsContext )

  const isGlobal = device === 'global'
  const defaultSettings = isGlobal ? DEFAULT_OPTIONS.global : DEFAULT_OPTIONS.local

  const setSettings = ( option, value ) => controller.setSettings( {
    [ group ]: { [ option ]: value },
  }, device )

  return Object.entries( defaultSettings[ group ] || {} ).map( ( [ option, defaultValue ] ) => {
    const optionGroup = settings[ device ][ group ] || {}
    const value = typeof optionGroup[ option ] === 'undefined' ? defaultValue : optionGroup[ option ]
    const options = OPTIONS[ option ]
    const { type, privacy, name, icon, ...props } = options

    // Get correct component
    const Option = SettingComponentFactory( type )

    return (
      <OptionGrid key={option}>
        <IconSlot icon={icon} />
        <NameSlot>{name}</NameSlot>
        <OptionSlot alignItems="center">
          <Option {...props} option={option} value={value} onChange={setSettings} />
        </OptionSlot>
      </OptionGrid>
    )
  } )
}

DynamicOptions.propTypes = {
  device: string.isRequired,
  group: string.isRequired,
}

export default DynamicOptions
