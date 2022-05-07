import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import IconButton from '@material-ui/core/IconButton'
import { func, shape, string } from 'prop-types'

/**
 * Renders an individual icon button, setting the state with the name on hover and click.
 * @param {string} name The human-readable name of the icon.
 * @param {string} icon The font-awesome icon.
 * @param {Function} onClick Optional click handler.
 * @param {Function} onMouseEnter MouseEnter click handler.
 * @param {Function} onMouseLeave MouseLeave click handler.
 * @param {string} className Optional classname.
 */
const ToolbarButton = ( {
  name,
  icon,
  onClick,
  onMouseEnter,
  onMouseLeave,
  className,
} ) => (
  <IconButton
    key={name}
    className={className}
    tabIndex={-1}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onClick={onClick}
  >
    <FontAwesomeIcon icon={icon} />
  </IconButton>
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
