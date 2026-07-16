import React from 'react'
import { number, func, bool } from 'prop-types'

const Slider = ( { value, min, max, step, onChange, disabled } ) => (
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

export default Slider
