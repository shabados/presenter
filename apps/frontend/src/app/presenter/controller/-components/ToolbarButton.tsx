import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import IconButton from '@mui/material/IconButton'

type ToolbarButtonProps = {
  name: string,
  icon: IconProp,
  className?: string,
  onClick?: () => void,
  onMouseEnter?: () => void,
  onMouseLeave?: () => void,
  flip?: 'horizontal' | 'vertical',
}

const ToolbarButton = ( {
  name,
  icon,
  onClick,
  onMouseEnter,
  onMouseLeave,
  className,
  flip,
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
    <FontAwesomeIcon icon={icon} flip={flip} />
  </IconButton>
)

export default ToolbarButton
