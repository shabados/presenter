import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import IconButton from '@mui/material/IconButton'

type ToolbarButtonProps = {
  name: string,
  icon: FontAwesomeIconProps,
  className?: string,
  onClick?: () => void,
  onMouseEnter?: () => void,
  onMouseLeave?: () => void,
}

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
}: ToolbarButtonProps ) => (
  <IconButton
    key={name}
    className={className}
    tabIndex={-1}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onClick={onClick}
    size="large"
  >
    <FontAwesomeIcon icon={icon} />
  </IconButton>
)

export default ToolbarButton
