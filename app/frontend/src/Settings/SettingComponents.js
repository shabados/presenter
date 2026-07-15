import React, { useState, useEffect } from 'react'
import { string, func, any, arrayOf, number, bool } from 'prop-types'

import classNames from 'classnames'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

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

export const Toggle = ( { value, onChange, disabled } ) => (
  <input
    type="checkbox"
    className={classNames( 'toggle', { checked: value } )}
    checked={value}
    disabled={disabled}
    onChange={e => onChange && onChange( null, e.target.checked )}
  />
)

Toggle.propTypes = {
  value: bool.isRequired,
  onChange: func,
  disabled: bool,
}

Toggle.defaultProps = {
  onChange: undefined,
  disabled: false,
}

export const Slider = ( { value, min, max, step, onChange, disabled } ) => (
  <input
    type="range"
    className="slider"
    value={value}
    min={min}
    max={max}
    step={step}
    disabled={disabled}
    onChange={e => onChange && onChange( null, Number( e.target.value ) )}
  />
)

Slider.propTypes = {
  value: number.isRequired,
  min: number,
  max: number,
  step: number,
  onChange: func,
  disabled: bool,
}

Slider.defaultProps = {
  min: undefined,
  max: undefined,
  step: undefined,
  onChange: undefined,
  disabled: false,
}

export const Dropdown = ( { value, values, onChange, disabled } ) => (
  <select className="select" value={value} disabled={disabled} onChange={onChange}>
    {values.map(
      ( { name, value } ) => <option key={value} value={value}>{name || value}</option>,
    )}
  </select>
)

Dropdown.propTypes = {
  value: any.isRequired, // eslint-disable-line react/forbid-prop-types
  values: arrayOf( any ).isRequired,
  onChange: func,
  disabled: bool,
}

Dropdown.defaultProps = {
  onChange: () => {},
  disabled: false,
}

export const Button = ( { className, children, ...props } ) => (
  <button
    type="button"
    className={classNames( className, 'button' )}
    {...props}
  >
    {children}
  </button>
)

Button.propTypes = {
  className: string,
  children: any, // eslint-disable-line react/forbid-prop-types
}

Button.defaultProps = {
  className: null,
  children: null,
}

export const UrlDropdown = ( { url, ...props } ) => {
  const [ values, setValues ] = useState( [] )

  useEffect( () => {
    fetch( url )
      .then( res => res.json() )
      .then( values => values.map( value => ( { name: value, value } ) ) )
      .then( setValues )
  }, [ url ] )

  return <Dropdown {...props} values={values} />
}

UrlDropdown.propTypes = {
  url: string.isRequired,
}

export const TextInput = ( { className, value, onChange, ...props } ) => {
  const [ isChanged, setChanged ] = useState()
  const [ isSaved, setSaved ] = useState()

  const onFocus = event => {
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
      <input
        className="text-field"
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

export default type => typeComponents[ type ]
