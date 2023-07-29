import './TutorialButton.css'

import classNames from 'classnames'
import { node, string } from 'prop-types'

import controller from '../lib/controller'
import { Button } from './SettingComponents'

const TutorialButton = ( { className, href, children, ...props } ) => (
  <Button
    className={classNames( className, 'tutorial-button' )}
    onClick={() => controller.openExternalUrl( href )}
    {...props}
  >
    {children}
  </Button>
)

TutorialButton.propTypes = {
  href: string,
  children: node,
  className: string,
}

TutorialButton.defaultProps = {
  href: '',
  className: null,
  children: null,
}

export default TutorialButton
