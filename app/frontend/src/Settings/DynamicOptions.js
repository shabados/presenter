import React, { useContext } from 'react'
import { string, shape, node, bool } from 'prop-types'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { OPTIONS, DEFAULT_OPTIONS, PRIVACY_TYPES, FLAT_OPTION_GROUPS } from '../lib/options'
import controller from '../lib/controller'
import { SettingsContext } from '../lib/contexts'

import SettingComponentFactory, { Button } from './SettingComponents'

export const OptionGrid = ( { children, ...props } ) => (
  <div {...props} className="option">
    {children}
  </div>
)
OptionGrid.propTypes = { children: node.isRequired }

export const IconSlot = ( { icon } ) => (
  <div className="col-icon">
    <FontAwesomeIcon className="icon" icon={icon} />
  </div>
)
IconSlot.propTypes = { icon: shape( {} ).isRequired }

export const NameSlot = ( { children } ) => (
  <div className="col-name">
    <span>{children}</span>
  </div>
)
NameSlot.propTypes = { children: string.isRequired }

export const OptionSlot = ( { children } ) => (
  <div className="col-option">
    {children}
  </div>
)
OptionSlot.propTypes = { children: node.isRequired }

export const ResetButton = ( { group, disabled, device } ) => (
  <OptionGrid>
    <div className="col-single">
      <Button
        className="reset-button"
        disabled={disabled}
        onClick={() => controller.resetSettingGroup( group, device )}
      >
        Reset to defaults
      </Button>
    </div>
  </OptionGrid>
)

ResetButton.propTypes = {
  group: string.isRequired,
  disabled: bool,
  device: string.isRequired,
}

ResetButton.defaultProps = {
  disabled: false,
}

const DynamicOptions = ( { device, group } ) => {
  const settings = useContext( SettingsContext )

  const selectedDeviceSettings = settings[ device ] || settings.local

  const isGlobal = device === 'global'
  const defaultSettings = isGlobal ? DEFAULT_OPTIONS.global : DEFAULT_OPTIONS.local

  const setSettings = ( option, value ) => controller.setSettings(
    { [ group ]: { [ option ]: value } },
    device,
  )

  const { privacy: groupPrivacy } = FLAT_OPTION_GROUPS[ group ] || {}
  const isGroupDisabled = device !== 'local' && groupPrivacy === PRIVACY_TYPES.private

  const renderOptions = () => Object
    .entries( defaultSettings[ group ] || {} )
    .map( ( [ option, defaultValue ] ) => {
      const optionGroup = selectedDeviceSettings[ group ] || {}
      const value = typeof optionGroup[ option ] === 'undefined' ? defaultValue : optionGroup[ option ]
      const options = OPTIONS[ option ]
      const { type, privacy, name, icon, ...props } = options

      const isDisabled = ( device !== 'local' && privacy === PRIVACY_TYPES.private ) || isGroupDisabled

      const Option = SettingComponentFactory( type )

      return (
        <OptionGrid key={option}>
          <IconSlot icon={icon} />
          <NameSlot>{name}</NameSlot>
          <OptionSlot>
            <Option
              {...props}
              option={option}
              value={value}
              onChange={setSettings}
              disabled={isDisabled}
            />
          </OptionSlot>
        </OptionGrid>
      )
    } )

  return (
    <>
      {renderOptions()}

      <ResetButton disabled={isGroupDisabled} group={group} device={device} />
    </>
  )
}

DynamicOptions.propTypes = {
  device: string.isRequired,
  group: string.isRequired,
}

export default DynamicOptions
