import React from 'react'
import { string } from 'prop-types'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

import { StatusContext, withContext } from '../lib/contexts'

import './StatusToast.css'

const StatusToast = ( { status } ) => (
  <TransitionGroup component={null}>
    {status && (
    <CSSTransition key={status} appear exit classNames="fade" timeout={300}>
      <div className="status toast">
        <FontAwesomeIcon icon={faInfoCircle} />
        <span>{status}</span>
      </div>
    </CSSTransition>
    )}
  </TransitionGroup>

)

StatusToast.propTypes = {
  status: string,
}

StatusToast.defaultProps = {
  status: null,
}

export default withContext( StatusContext )( StatusToast )
