import React from 'react'

import Dropdown from '../shared/Dropdown'
import Toggle from '../shared/Toggle'
import Slider from '../shared/Slider'

import controller from '../lib/controller'
import { OPTION_TYPES } from '../lib/consts'

const withSettingsUpdate = Component => ( group, device ) => {
  const onChange = ( option, value ) => controller.setSettings( {
    [ group ]: {
      [ option ]: value,
    },
  }, device )

  return props => <Component {...props} onChange={onChange} />
}

const GeneralSettingEvent = Component => ( { option, onChange, ...props } ) => (
  <Component {...props} onChange={( { target: { value } } ) => onChange( option, value )} />
)

const GeneralSettingParam = Component => ( { option, onChange, ...props } ) => (
  <Component {...props} onChange={( _, value ) => onChange( option, value )} />
)

const ToggleSetting = withSettingsUpdate( GeneralSettingParam( Toggle ) )
const SliderSetting = withSettingsUpdate( GeneralSettingParam( Slider ) )
const DropdownSetting = withSettingsUpdate( GeneralSettingEvent( Dropdown ) )

const typeComponents = {
  [ OPTION_TYPES.dropdown ]: DropdownSetting,
  [ OPTION_TYPES.toggle ]: ToggleSetting,
  [ OPTION_TYPES.radio ]: withSettingsUpdate( GeneralSettingParam( () => <p>d</p> ) ),
  [ OPTION_TYPES.slider ]: SliderSetting,
  [ OPTION_TYPES.colorPicker ]: ( { name, value } ) => <p>colorPicker {name}: {value}</p>,
}

export default type => typeComponents[ type ]

