import { OPTION_TYPES } from '../../lib/options'

import Button from './Button'
import Dropdown from './Dropdown'
import Slider from './Slider'
import TextInput from './TextInput'
import Toggle from './Toggle'
import UrlDropdown from './UrlDropdown'

import './form.css'

export { Button, Dropdown, Slider, TextInput, Toggle, UrlDropdown }

const GeneralSettingEvent = Component => {
  const HOC = ( { option, onChange, ...props } ) => (
    <Component {...props} onChange={( { target: { value } } ) => onChange( option, value )} />
  )
  HOC.defaultProps = { onChange: () => {} }
  return HOC
}

const GeneralSettingParam = Component => {
  const HOC = ( { option, onChange, ...props } ) => (
    <Component {...props} onChange={( _, value ) => onChange( option, value )} />
  )
  HOC.defaultProps = { onChange: () => {} }
  return HOC
}

const typeComponents = {
  [ OPTION_TYPES.dropdown ]: GeneralSettingEvent( Dropdown ),
  [ OPTION_TYPES.toggle ]: GeneralSettingParam( Toggle ),
  [ OPTION_TYPES.slider ]: GeneralSettingParam( Slider ),
  [ OPTION_TYPES.urlDropdown ]: GeneralSettingEvent( UrlDropdown ),
  [ OPTION_TYPES.textInput ]: GeneralSettingEvent( TextInput ),
}

export default type => typeComponents[ type ]
