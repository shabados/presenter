import React from 'react'
import { string, func, shape } from 'prop-types'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ToolbarButton = ( {
  name,
  icon,
  onClick,
  onMouseEnter,
  onMouseLeave,
  className,
} ) => (
  <button
    type="button"
    key={name}
    className={className}
    tabIndex={-1}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onClick={onClick}
  >
    <FontAwesomeIcon icon={icon} />
  </button>
)

ToolbarButton.propTypes = {
  name: string.isRequired,
  icon: shape( { iconName: string } ).isRequired,
  onClick: func,
  onMouseEnter: func,
  onMouseLeave: func,
  className: string,
}

ToolbarButton.defaultProps = {
  onClick: undefined,
  onMouseEnter: undefined,
  onMouseLeave: undefined,
  className: '',
}

export default ToolbarButton
