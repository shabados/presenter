import React from 'react'

import Dropdown from '../shared/Dropdown'
import Toggle from '../shared/Toggle'
import Slider from '../shared/Slider'

import { OPTION_TYPES } from '../lib/consts'

const GeneralSettingEvent = Component => ( { option, onChange, ...props } ) => (
  <Component {...props} onChange={( { target: { value } } ) => onChange( option, value )} />
)

const GeneralSettingParam = Component => ( { option, onChange, ...props } ) => (
  <Component {...props} onChange={( _, value ) => onChange( option, value )} />
)

const ToggleSetting = GeneralSettingParam( Toggle )
const SliderSetting = GeneralSettingParam( Slider )
const DropdownSetting = GeneralSettingEvent( Dropdown )

const typeComponents = {
  [ OPTION_TYPES.dropdown ]: DropdownSetting,
  [ OPTION_TYPES.toggle ]: ToggleSetting,
  [ OPTION_TYPES.slider ]: SliderSetting,
  [ OPTION_TYPES.colorPicker ]: ( { name, value } ) => <p>colorPicker {name}: {value}</p>,
}

export default type => typeComponents[ type ]

