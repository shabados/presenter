import './TutorialButton.css'

import classNames from 'classnames'

import controller from '../lib/controller'
import { Button } from './SettingComponents'

type TutorialButtonProps = {
  href?: string,
  children?: React.ReactNode,
  className?: string | null,
}

const TutorialButton = ( { className = null, href = '', children = null, ...props }: TutorialButtonProps ) => (
  <Button
    className={classNames( className, 'tutorial-button' )}
    onClick={() => controller.openExternalUrl( href )}
    {...props}
  >
    {children}
  </Button>
)

export default TutorialButton
