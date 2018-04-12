import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import { NAVIGATOR_URL, MENU_URL, SEARCH_URL } from '../../lib/consts'

import Controller from './Controller'
import Search from './Search'
import Menu from './Menu'
import Navigator from './Navigator'

import './index.css'

/**
 * Controller controls the display and configures settings.
 */
class ControllerContainer extends Component {
  constructor( props ) {
    super( props )

    this.state = {
      hovered: null,
    }
  }

  componentDidUpdate( { shabad: prevShabad } ) {
    const { history, shabad, location } = this.props
    const { pathname } = location

    // Go to navigator if a different Shabad has been selected, and we're on the search page
    if ( shabad !== prevShabad && pathname.includes( SEARCH_URL ) ) {
      history.push( { ...location, pathname: NAVIGATOR_URL } )
    }
  }

  onHover = hovered => this.setState( { hovered } )

  render() {
    const { location } = this.props
    const { hovered } = this.state

    const routes = [
      [ MENU_URL, Menu ],
      [ SEARCH_URL, Search ],
      [ NAVIGATOR_URL, Navigator ],
    ]

    return (
      <Switch>
        {routes.map( ( [ route, Component ] ) => (
          <Route
            key={route}
            path={route}
            render={props => (
              <Controller
                {...this.props}
                {...props}
                Component={Component}
                onHover={this.onHover}
                title={hovered || route.split( '/' ).pop()}
              />
            )}
          />
        ) )}
        <Redirect to={{ ...location, pathname: SEARCH_URL }} />
      </Switch>
    )
  }
}

export default ControllerContainer
