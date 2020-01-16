import React from 'react'
import { string, func, any, arrayOf, number, bool } from 'prop-types'

import classNames from 'classnames'

import {
  Switch,
  Select,
  MenuItem,
  Slider as MaterialSlider,
  Button as MaterialButton,
} from '@material-ui/core'

import { OPTION_TYPES } from '../lib/options'

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

export const Toggle = ( { value, ...props } ) => <Switch className={classNames( 'toggle', { checked: value } )} defaultChecked={value} {...props} />

Toggle.propTypes = {
  value: bool.isRequired,
}

export const Slider = ( { value, ...props } ) => (
  <MaterialSlider
    className="slider"
    valueLabelDisplay="auto"
    defaultValue={value}
    {...props}
  />
)

Slider.propTypes = {
  value: number.isRequired,
}

export const Dropdown = ( { value, values, onChange, ...props } ) => (
  <Select className="select" MenuProps={{ className: 'select-menu' }} value={value} onChange={onChange} {...props}>
    {values.map(
      ( { name, value } ) => <MenuItem key={value} value={value}>{name || value}</MenuItem>,
    )}
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

export const Button = ( { className, ...props } ) => (
  <MaterialButton
    variant="contained"
    className={classNames( className, 'button' )}
    {...props}
  />
)

Button.propTypes = {
  className: string,
}

Button.defaultProps = {
  className: null,
}

const typeComponents = {
  [ OPTION_TYPES.dropdown ]: GeneralSettingEvent( Dropdown ),
  [ OPTION_TYPES.toggle ]: GeneralSettingParam( Toggle ),
  [ OPTION_TYPES.slider ]: GeneralSettingParam( Slider ),
}

export default type => typeComponents[ type ]
