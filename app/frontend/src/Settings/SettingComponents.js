import React from 'react'
import { string, func, any, arrayOf, number } from 'prop-types'

import classNames from 'classnames'

import Switch from '@material-ui/core/Switch'
import Select from '@material-ui/core/Select'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'
import MSlider from '@material-ui/lab/Slider'

import { OPTION_TYPES } from '../lib/consts'

import './SettingComponents.css'

const generalPropTypes = {
  option: string.isRequired,
  onChange: func,
}

const generalDefaultProps = {
  onChange: () => {},
}

const GeneralSettingEvent = Component => {
  const HOC = ( { option, onChange, ...props } ) => (
    <Component {...props} onChange={( { target: { value } } ) => onChange( option, value )} />
  )

  HOC.propTypes = generalPropTypes
  HOC.defaultProps = generalDefaultProps

  return HOC
}

const GeneralSettingParam = Component => {
  const HOC = ( { option, onChange, ...props } ) => (
    <Component {...props} onChange={( _, value ) => onChange( option, value )} />
  )

  HOC.propTypes = generalPropTypes
  HOC.defaultProps = generalDefaultProps

  return HOC
}

export const Toggle = ( { value, ...props } ) => <Switch className={classNames( 'toggle', { checked: value } )} checked={value}{...props} />

Toggle.propTypes = {
  value: any.isRequired, // eslint-disable-line react/forbid-prop-types
}

export const Slider = props => (
  <Grid container item alignItems="center" spacing={16}>
    <Grid item xs={5}>
      <MSlider className="slider" {...props} />
    </Grid>
    <Grid item>
      <Typography>{props.value}</Typography>
    </Grid>
  </Grid>
)

Slider.propTypes = {
  value: number.isRequired,
}

export const Dropdown = ( { value, values, onChange } ) => (
  <Select className="select" MenuProps={{ className: 'select-menu' }} value={value} onChange={onChange}>
    {values.map( ( { name, value } ) =>
      <MenuItem key={value} value={value}>{name || value}</MenuItem> )}
  </Select>
)

Dropdown.propTypes = {
  value: any.isRequired, // eslint-disable-line react/forbid-prop-types
  values: arrayOf( any ).isRequired,
  onChange: func,
}

Dropdown.defaultProps = {
  onChange: () => {},
}

const typeComponents = {
  [ OPTION_TYPES.dropdown ]: GeneralSettingEvent( Dropdown ),
  [ OPTION_TYPES.toggle ]: GeneralSettingParam( Toggle ),
  [ OPTION_TYPES.slider ]: GeneralSettingParam( Slider ),
}

export default type => typeComponents[ type ]

