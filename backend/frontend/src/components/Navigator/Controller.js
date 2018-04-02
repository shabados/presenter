import React, { Component } from 'react'

import { List, ListItem } from 'material-ui'

import { stripPauses } from '../../lib/utils'
import controller from '../../lib/controller'

import './Controller.css'

/**
 * Controller Component.
 * Displays lines from Shabad and allows navigation.
 */
class Controller extends Component {
  Line = ( { gurmukhi, id } ) => {
    const { lineId } = this.props

    const className = id === lineId ? 'current line' : 'line'

    return (
      <ListItem
        key={id}
        className={className}
        onClick={() => controller.line( id )}
      >
        {stripPauses( gurmukhi )}
      </ListItem>
    )
  }

  render() {
    const { shabad } = this.props
    const { lines } = shabad || {}

    return (
      <List className="controller">
        {shabad ? lines.map( this.Line ) : null}
      </List>
    )
  }
}

export default Controller
