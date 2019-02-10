import React from 'react'
import { string, func, any, arrayOf } from 'prop-types'
import { Switch, Select, MenuItem } from '@material-ui/core'
import { Slider as MSlider } from '@material-ui/lab'

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

export const Toggle = ( { value, ...props } ) => <Switch className="toggle" checked={value}{...props} />
Toggle.propTypes = {
  value: any.isRequired, // eslint-disable-line react/forbid-prop-types
}

export const Slider = props => <MSlider className="slider" {...props} />

export const Dropdown = ( { value, values, onChange } ) => (
  <Select className="select" value={value} onChange={onChange}>
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

