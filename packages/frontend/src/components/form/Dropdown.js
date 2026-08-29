import React from 'react'
import { any, arrayOf, func, bool } from 'prop-types'

const Dropdown = ( { value, values, onChange, disabled } ) => (
  <select className="select" value={value} disabled={disabled} onChange={onChange}>
    {values.map(
      ( { name, value } ) => <option key={value} value={value}>{name || value}</option>,
    )}
  </select>
)

Dropdown.propTypes = {
  value: any.isRequired, // eslint-disable-line react/forbid-prop-types
  values: arrayOf( any ).isRequired, // eslint-disable-line react/forbid-prop-types
  onChange: func,
  disabled: bool,
}

Dropdown.defaultProps = {
  onChange: () => {},
  disabled: false,
}

export default Dropdown
