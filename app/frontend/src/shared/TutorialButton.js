import React from 'react'
import { node, string } from 'prop-types'
import classNames from 'classnames'

import { Button } from '@material-ui/core'

import controller from '../lib/controller'

import './TutorialButton.css'

const TutorialButton = ( { className, href, children, ...props } ) => (
  <Button
    variant="contained"
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
