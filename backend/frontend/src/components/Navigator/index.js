import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

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
  faList,
} from '@fortawesome/fontawesome-free-solid'
import { faSquare } from '@fortawesome/fontawesome-free-regular'

import { NAVIGATOR_URL } from '../../lib/consts'
import controller from '../../lib/controller'

import Search from './Search'
import Menu from './Menu'
import Controller from './Controller'

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

  componentDidUpdate( { shabad: prevShabad } ) {
    const { history, match, shabad } = this.props
    const { location: { pathname } } = history

    // Navigate to controller if a different Shabad has been selected, and we're on the search page
    if ( shabad !== prevShabad && pathname.includes( 'search' ) ) {
      history.push( `${NAVIGATOR_URL}/controller` )
    }
  }

  /**
   * Renders an individual icon button, setting the state with the name on hover and click.
   * @param name The human-readable name of the icon.
   * @param icon The font-awesome icon.
   * @param onClick Optional click handler.
   */
  ToolbarButton = ( { children: name, icon, onClick } ) => {
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

  /**
   * Renders the top navigation bar, showing the current path in the URL, and the hover state.
   */
  TopBar = () => {
    const { hovered } = this.state
    const { location: { pathname }, history } = this.props

    // Get current page name from route
    const selected = pathname.split( '/' ).pop()

    return (
      <Toolbar className="top bar">
        <this.ToolbarButton icon={faBars}>Menu</this.ToolbarButton>
        <this.ToolbarButton icon={faArrowAltCircleLeft} onClick={() => history.goBack()}>
          Backwards
        </this.ToolbarButton>
        <this.ToolbarButton icon={faArrowAltCircleRight} onClick={() => history.goForward()}>
          Forwards
        </this.ToolbarButton>
        <Typography className="name" type="title">
          {hovered || selected || 'Menu'}
        </Typography>
        <this.ToolbarButton icon={faWindowMinimize} onClick={() => history.push( '/' )}>
          Minimize
        </this.ToolbarButton>
        <this.ToolbarButton icon={faSignOutAlt} onClick={() => history.push( '/' )}>
          Pop Out
        </this.ToolbarButton>
      </Toolbar>
    )
  }

  /**
   * Renders the bottom navigation bar.
   */
  BottomBar = () => {
    const { shabad } = this.props

    return (
      <Toolbar className="bottom bar">
        <this.ToolbarButton icon={faSearch}>Search</this.ToolbarButton>
        <this.ToolbarButton icon={faBookmark}>Bookmarks</this.ToolbarButton>
        <this.ToolbarButton icon={faHistory}>History</this.ToolbarButton>
        {shabad ? <this.ToolbarButton icon={faList}>Controller</this.ToolbarButton> : null}
        <Typography className="name" type="title" />
        <this.ToolbarButton icon={faSquare} onClick={controller.clear}>Clear</this.ToolbarButton>
      </Toolbar>
    )
  }

  render() {
    const { shabad, lineId } = this.props

    return (
      <div className="navigator">
        <this.TopBar />
        <Switch>
          <Route path={`${NAVIGATOR_URL}/menu`} component={Menu} />
          <Route path={`${NAVIGATOR_URL}/search`} component={Search} />
          <Route
            path={`${NAVIGATOR_URL}/controller`}
            render={props => <Controller {...props} shabad={shabad} lineId={lineId} />}
          />
          <Redirect to={`${NAVIGATOR_URL}/search`} />
        </Switch>
        <this.BottomBar />
      </div>
    )
  }
}

export default Navigator
