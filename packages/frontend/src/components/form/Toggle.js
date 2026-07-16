import React from 'react'
import { bool, func } from 'prop-types'
import classNames from 'classnames'

const Toggle = ( { value, onChange, disabled } ) => (
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

export default Toggle
