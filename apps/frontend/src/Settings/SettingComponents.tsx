import './SettingComponents.css'

import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Button as MaterialButton,
  MenuItem,
  Select,
  Slider as MaterialSlider,
  Switch,
  TextField,
} from '@mui/material'
import classNames from 'classnames'
import { any, arrayOf, bool, func, number, string } from 'prop-types'
import { useEffect, useState } from 'react'

import { OPTION_TYPES } from '../lib/options'

const generalPropTypes = {
  option: string.isRequired,
  onChange: func,
}

const generalDefaultProps = {
  onChange: () => {},
}

const GeneralSettingEvent = ( Component ) => {
  const HOC = ( { option, onChange, ...props } ) => (
    <Component {...props} onChange={( { target: { value } } ) => onChange( option, value )} />
  )

  HOC.propTypes = generalPropTypes
  HOC.defaultProps = generalDefaultProps

  return HOC
}

const GeneralSettingParam = ( Component ) => {
  const HOC = ( { option, onChange, ...props } ) => (
    <Component {...props} onChange={( _, value ) => onChange( option, value )} />
  )

  HOC.propTypes = generalPropTypes
  HOC.defaultProps = generalDefaultProps

  return HOC
}

export const Toggle = ( { value, ...props } ) => <Switch className={classNames( 'toggle', { checked: value } )} checked={value} {...props} />

Toggle.propTypes = {
  value: bool.isRequired,
}

export const Slider = ( { value, ...props } ) => (
  <MaterialSlider
    className="slider"
    valueLabelDisplay="auto"
    value={value}
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
  // eslint-disable-next-line react/forbid-prop-types
  value: any.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
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

export const UrlDropdown = ( { url, ...props } ) => {
  const [ isOpen, setOpen ] = useState( false )
  const [ values, setValues ] = useState( [] )

  useEffect( () => {
    fetch( url )
      .then( ( res ) => res.json() )
      .then( ( values ) => values.map( ( value ) => ( { name: value, value } ) ) )
      .then( setValues )
  }, [ setValues, isOpen, url ] )

  return (
    <Dropdown
      {...props}
      values={values}
      onOpen={() => setOpen( true )}
      onClose={() => setOpen( false )}
    />
  )
}

UrlDropdown.propTypes = {
  url: string.isRequired,
}

export const TextInput = ( { className, value, onChange, ...props } ) => {
  const [ isChanged, setChanged ] = useState()
  const [ isSaved, setSaved ] = useState()

  const onFocus = ( event ) => {
    event.target.select()
  }

  useEffect( () => {
    const timer = setTimeout( () => {
      setSaved( false )
    }, 3000 )

    return () => clearTimeout( timer )
  }, [ isSaved ] )

  const onBlur = ( ...params ) => {
    onChange( ...params )

    if ( isChanged ) {
      setTimeout( () => {
        setSaved( isChanged )
      }, 500 )
    }
    setChanged( false )
  }

  return (
    <div key={value} className={classNames( className, 'text-input' )}>
      <TextField
        className="text-field"
        variant="outlined"
        {...props}
        onBlur={onBlur}
        onChange={() => setChanged( true )}
        onFocus={onFocus}
        defaultValue={value}
      />

      <FontAwesomeIcon
        className={classNames( 'status-icon', { saved: isSaved } )}
        icon={faCheck}
      />
    </div>
  )
}

TextInput.propTypes = {
  className: string,
  onChange: func,
  value: string.isRequired,
}

TextInput.defaultProps = {
  className: null,
  onChange: () => {},
}

const typeComponents = {
  [ OPTION_TYPES.dropdown ]: GeneralSettingEvent( Dropdown ),
  [ OPTION_TYPES.toggle ]: GeneralSettingParam( Toggle ),
  [ OPTION_TYPES.slider ]: GeneralSettingParam( Slider ),
  [ OPTION_TYPES.urlDropdown ]: GeneralSettingEvent( UrlDropdown ),
  [ OPTION_TYPES.textInput ]: GeneralSettingEvent( TextInput ),
}

export default ( type ) => typeComponents[ type ]
