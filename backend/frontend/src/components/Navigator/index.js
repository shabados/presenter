import React, { Component } from 'react'
import { Route, Link, Switch, Redirect } from 'react-router-dom'

import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import Typography from 'material-ui/Typography'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {
  faBars,
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
  faWindowMinimize,
  faSignOutAlt,
  faSearch,
  faHistory,
  faBookmark,
} from '@fortawesome/fontawesome-free-solid'

import {
  faSquare,
} from '@fortawesome/fontawesome-free-regular'

import Search from './Search'

import './index.css'

/**
 * Navigator controls the display and configures settings.
 */
class Navigator extends Component {
  constructor( props ) {
    super( props )

    this.state = {
      hovered: null,
    }
  }

  /**
   * Renders an individual icon button, setting the state with the name on hover and click.
   * @param name The human-readable name of the icon.
   * @param icon The font-awesome icon.
   * @param onClick Optional click handler.
   */
  renderIconButton = ( name, icon, onClick ) => {
    // Default handler for onClick navigates to the name of what was clicked
    const onIconClick = () => {
      const { history, match } = this.props
      // Navigate to the clicked item's name by default
      history.push( `${match.url}/${name.toLowerCase()}` )
    }

    // Set the hovered element state
    const onMouseEnter = () => this.setState( { hovered: name } )
    const onMouseLeave = () => this.setState( { hovered: null } )

    return (
      <IconButton key={name}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                  onClick={onClick || onIconClick}>
        <FontAwesomeIcon icon={icon} />
      </IconButton>
    )
  }

  render() {
    const { match, location: { pathname }, history } = this.props
    const { hovered } = this.state

    // Get current page name from route
    const selected = pathname.split( '/' ).pop()

    return (
      <div className="navigator">
        <Toolbar className="top bar">
          {this.renderIconButton( 'Menu', faBars )}
          {this.renderIconButton( 'Backwards', faArrowAltCircleLeft, () => history.goBack() )}
          {this.renderIconButton( 'Forwards', faArrowAltCircleRight, () => history.goForward() )}
          <Typography className="name" type="title">
            {hovered || selected || 'Menu'}
          </Typography>
          {this.renderIconButton( 'Minimize', faWindowMinimize )}
          {this.renderIconButton( 'Pop Out', faSignOutAlt )}
        </Toolbar>

        <Switch>
          <Route path={`${match.url}/search`} component={Search} />
          <Redirect to={`${match.url}/search`} />
        </Switch>

        <Toolbar className="bottom bar">
          {this.renderIconButton( 'Search', faSearch )}
          {this.renderIconButton( 'History', faHistory )}
          {this.renderIconButton( 'Bookmarks', faBookmark )}
          <Typography className="name" type="title" />
          {this.renderIconButton( 'Clear', faSquare )}
        </Toolbar>
      </div>
    )
  }
}

export default Navigator
