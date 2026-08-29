import React from 'react'
import { string, any } from 'prop-types'
import classNames from 'classnames'

const Button = ( { className, children, ...props } ) => (
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

export default Button
