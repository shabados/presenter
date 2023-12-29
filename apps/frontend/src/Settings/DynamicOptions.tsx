import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Grid, Typography } from '@mui/material'
import { ClientSettings, Settings } from '@presenter/contract/src'
import { useContext } from 'react'

import { SettingsContext } from '../lib/contexts'
import controller from '../lib/controller'
import { DEFAULT_OPTIONS, FLAT_OPTION_GROUPS, OPTIONS, PRIVACY_TYPES } from '../lib/options'
import SettingComponentFactory, { Button } from './SettingComponents'

export const slotSizes = {
  icon: { xs: 2, sm: 1 },
  name: { xs: 5, sm: 5, md: 4, lg: 4 },
  option: { xs: 5, sm: 5, md: 4, lg: 3 },
  single: { xs: 12, sm: 11, md: 9, lg: 8 },
}

type OptionGridProps = {
  children: React.ReactNode,
  container?: boolean,
  align?: string,
}

export const OptionGrid = ( { children, ...props }: OptionGridProps ) => (
  <Grid {...props} className="option" container>
    {children}
  </Grid>
)

type IconSlotProps = {
  icon: IconProp,
}

export const IconSlot = ( { icon }: IconSlotProps ) => (
  <Grid item {...slotSizes.icon} center="center">
    <FontAwesomeIcon className="icon" icon={icon} />
  </Grid>
)

type NameSlotProps = {
  children: string,
}

export const NameSlot = ( { children }: NameSlotProps ) => (
  <Grid item {...slotSizes.name}>
    <Typography>{children}</Typography>
  </Grid>
)

type OptionSlotProps = {
  children: React.ReactNode,
}

export const OptionSlot = ( { children }: OptionSlotProps ) => (
  <Grid align="center" item {...slotSizes.option}>
    {children}
  </Grid>
)

type ResetButtonProps = {
  group: keyof ClientSettings,
  disabled?: boolean,
  device: string,
}

export const ResetButton = ( { group, disabled = false, device }: ResetButtonProps ) => (
  <OptionGrid container align="center">
    <Grid item {...slotSizes.single}>
      <Button
        className="reset-button"
        disabled={disabled}
        variant="contained"
        onClick={() => controller.resetSettingGroup( group, device )}
      >
        Reset to defaults
      </Button>
    </Grid>
  </OptionGrid>
)

type DynamicOptionsProps = {
  device: string,
  group: keyof ClientSettings,
}

const DynamicOptions = ( { device, group }: DynamicOptionsProps ) => {
  const settings = useContext( SettingsContext )

  const selectedDeviceSettings = settings[ device ] || settings.local

  const isGlobal = device === 'global'
  const defaultSettings = isGlobal ? DEFAULT_OPTIONS.global : DEFAULT_OPTIONS.local

  const setSettings = <Option extends keyof Settings>
  ( option: Option, value: Settings[typeof option] ) => controller.setSettings(
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

      // Determine if the component should be disabled
      const isDisabled = ( device !== 'local' && privacy === PRIVACY_TYPES.private ) || isGroupDisabled

      // Get correct component
      const Option = SettingComponentFactory( type )

      return (
        <OptionGrid key={option}>
          <IconSlot icon={icon} />
          <NameSlot>{name}</NameSlot>
          <OptionSlot alignItems="center">
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

export default DynamicOptions
