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
import { useEffect, useState } from 'react'

import { OPTION_TYPES } from '../lib/options'

type GeneralProps = {
  option: string,
  onChange?: ( option: any, value: any ) => any,
}

const onChangeDefault = () => {}

const GeneralSettingEvent = ( Component ) => {
  const HOC = ( { option, onChange = onChangeDefault, ...props }: GeneralProps ) => (
    <Component {...props} onChange={( { target: { value } } ) => onChange( option, value )} />
  )

  return HOC
}

const GeneralSettingParam = ( Component ) => {
  const HOC = ( { option, onChange = onChangeDefault, ...props }: GeneralProps ) => (
    <Component {...props} onChange={( _, value ) => onChange( option, value )} />
  )

  return HOC
}

type ToggleProps = {
  value: boolean,
}

export const Toggle = ( { value, ...props }: ToggleProps ) => <Switch className={classNames( 'toggle', { checked: value } )} checked={value} {...props} />

type SliderProps = {
  value: number,
}

export const Slider = ( { value, ...props }: SliderProps ) => (
  <MaterialSlider
    className="slider"
    valueLabelDisplay="auto"
    value={value}
    {...props}
  />
)

type DropdownProps = {
  // eslint-disable-next-line react/forbid-prop-types
  value: any,
  // eslint-disable-next-line react/forbid-prop-types
  values: any[],
  onChange?: () => any,
  onOpen?: () => any,
  onClose?: () => any,
}

export const Dropdown = ( { value, values, onChange = () => {}, ...props }: DropdownProps ) => (
  <Select className="select" MenuProps={{ className: 'select-menu' }} value={value} onChange={onChange} {...props}>
    {values.map(
      ( { name, value } ) => <MenuItem key={value} value={value}>{name || value}</MenuItem>,
    )}
  </Select>
)

type ButtonProps = {
  className?: string | null,
}

export const Button = ( { className = null, ...props }: ButtonProps ) => (
  <MaterialButton
    variant="contained"
    className={classNames( className, 'button' )}
    {...props}
  />
)

type UrlDropdownProps = {
  url: string,
}

export const UrlDropdown = ( { url, ...props }: UrlDropdownProps ) => {
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

type TextInputProps = {
  className?: string | null,
  onChange?: () => any,
  value: string,
}

export const TextInput = (
  { className = null, value, onChange = () => {}, ...props }: TextInputProps
) => {
  const [ isChanged, setChanged ] = useState<boolean>()
  const [ isSaved, setSaved ] = useState<boolean>()

  const onFocus = ( event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
    event.target.select()
  }

  useEffect( () => {
    const timer = setTimeout( () => {
      setSaved( false )
    }, 3000 )

    return () => clearTimeout( timer )
  }, [ isSaved ] )

  const onBlur = ( ...params: any[] ) => {
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

const typeComponents = {
  [ OPTION_TYPES.dropdown ]: GeneralSettingEvent( Dropdown ),
  [ OPTION_TYPES.toggle ]: GeneralSettingParam( Toggle ),
  [ OPTION_TYPES.slider ]: GeneralSettingParam( Slider ),
  [ OPTION_TYPES.urlDropdown ]: GeneralSettingEvent( UrlDropdown ),
  [ OPTION_TYPES.textInput ]: GeneralSettingEvent( TextInput ),
}

export default ( type: symbol ) => typeComponents[ type ]
