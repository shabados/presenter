import React from 'react'
import { node, string } from 'prop-types'
import classNames from 'classnames'

import controller from '../lib/controller'

import { Button } from './SettingComponents'

import './TutorialButton.css'

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
