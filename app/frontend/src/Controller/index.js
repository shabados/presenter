import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { history, location } from 'react-router-prop-types'
import { string, func, shape, arrayOf, bool } from 'prop-types'

import classNames from 'classnames'
import queryString from 'qs'

import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import {
  faCog,
  faBars,
  faStar,
  faHistory,
  faPlay,
  faSearch,
  faSignOutAlt,
  faWindowMinimize,
  faWindowMaximize,
} from '@fortawesome/free-solid-svg-icons'
import { faSquare } from '@fortawesome/free-regular-svg-icons'

import controller from '../lib/controller'
import {
  BOOKMARKS_URL,
  CONTROLLER_URL,
  HISTORY_URL,
  MENU_URL,
  NAVIGATOR_URL,
  SEARCH_URL,
  SETTINGS_URL,
  STATES,
  PRESENTER_URL,
} from '../lib/consts'
import { getUrlState } from '../lib/utils'

import ToolbarButton from './ToolbarButton'
import Search from './Search'
import Menu from './Menu'
import Navigator, { Bar as NavigatorBar } from './Navigator'
import History from './History'
import Bookmarks from './Bookmarks'

import './index.css'

/**
 * Renders the top navigation bar, showing the current path in the URL, and the hover state.
 * @param title The title text in the top bar.
 * @param history A `history` object.
 * @param location A `location` object.
 * @param onHover Fired on hover with name.
 */
const TopBar = ( { title, history, location, onHover } ) => {
  const resetHover = () => onHover( null )

  const { search } = location
  const state = getUrlState( search )

  return (
    <Toolbar className="top bar">
      <ToolbarButton
        name="Menu"
        icon={faBars}
        onClick={() => history.push( { ...location, pathname: MENU_URL } )}
        onMouseEnter={() => onHover( 'Menu' )}
        onMouseLeave={resetHover}
      />
      <ToolbarButton
        name="Settings"
        icon={faCog}
        onClick={() => window.open( SETTINGS_URL )}
        onMouseEnter={() => onHover( 'Settings' )}
        onMouseLeave={resetHover}
      />
      <Typography className="name" type="title">{title}</Typography>
      <ToolbarButton
        name="Minimize"
        icon={faWindowMinimize}
        onClick={() => history.push( PRESENTER_URL )}
        onMouseEnter={() => onHover( 'Hide Controller' )}
        onMouseLeave={resetHover}
      />
      {state[ STATES.controllerOnly ]
        ? <ToolbarButton
          name="Minimize Controller"
          icon={faWindowMaximize}
          flip="vertical"
          onClick={() => history.push( `${CONTROLLER_URL}?${queryString.stringify( { ...state, [ STATES.controllerOnly ]: undefined } )}` )}
          onMouseEnter={() => onHover( 'Minimize Controller' )}
          onMouseLeave={resetHover}
        />
        : <ToolbarButton
          name="Maximize Controller"
          icon={faWindowMaximize}
          onClick={() => history.push( `${CONTROLLER_URL}?${queryString.stringify( { ...state, [ STATES.controllerOnly ]: true } )}` )}
          onMouseEnter={() => onHover( 'Maximize Controller' )}
          onMouseLeave={resetHover}
        />
      }
      <ToolbarButton
        name="Pop Out"
        icon={faSignOutAlt}
        onClick={() => {
          history.push( PRESENTER_URL )
          window.open( `${CONTROLLER_URL}?${STATES.controllerOnly}=true`, '_blank' )
        }}
        onMouseEnter={() => onHover( 'Pop Out Controller' )}
        onMouseLeave={resetHover}
      />
    </Toolbar>
  )
}

TopBar.propTypes = {
  history: history.isRequired,
  location: location.isRequired,
  title: string,
  onHover: func,
}

TopBar.defaultProps = {
  title: '',
  onHover: () => {},
}

/**
 * Renders the bottom navigation bar.
 * @param history A `history` object.
 * @param renderContent A render prop for content in the bottom bar.
 * @param location A `location` object.
 * @param onHover Fired on hover with name.
 */
const BottomBar = ( { history, renderContent, location, onHover } ) => {
  const go = pathname => () => history.push( { ...location, pathname } )
  const resetHover = () => onHover( null )

  return (
    <Toolbar className="bottom bar">
      <ToolbarButton name="Search" icon={faSearch} onClick={go( SEARCH_URL )} onHover={onHover} />
      <ToolbarButton
        name="Bookmarks"
        icon={faStar}
        onClick={go( BOOKMARKS_URL )}
        onMouseEnter={() => onHover( 'Bookmarks' )}
        onMouseLeave={resetHover}
      />
      <ToolbarButton
        name="History"
        icon={faHistory}
        onClick={go( HISTORY_URL )}
        onMouseEnter={() => onHover( 'History' )}
        onMouseLeave={resetHover}
      />
      <div className="middle">{renderContent()}</div>
      <ToolbarButton
        name="Navigator"
        icon={faPlay}
        onClick={go( NAVIGATOR_URL )}
        onMouseEnter={() => onHover( 'Navigator' )}
        onMouseLeave={resetHover}
      />
      <ToolbarButton
        name="Clear"
        icon={faSquare}
        onClick={controller.clear}
        onMouseEnter={() => onHover( 'Clear' )}
        onMouseLeave={resetHover}
      />
    </Toolbar>
  )
}

BottomBar.propTypes = {
  history: history.isRequired,
  location: location.isRequired,
  onHover: func,
  renderContent: func,
}

BottomBar.defaultProps = {
  onHover: () => {},
  renderContent: () => null,
}

/**
 * Controller controls the display and configures settings.
 */
class Controller extends Component {
  state = { hovered: null }

  componentDidUpdate( { shabad: prevShabad, bani: prevBani } ) {
    const { history, shabad, bani, location } = this.props
    const { pathname } = location

    const redirects = [ SEARCH_URL, HISTORY_URL, BOOKMARKS_URL ]
    // Go to navigator if a different Shabad/Bani has been selected, and we're on a redirect page
    const isNewSelection = shabad !== prevShabad || bani !== prevBani
    if ( isNewSelection && redirects.some( route => pathname.includes( route ) ) ) {
      history.push( { ...location, pathname: NAVIGATOR_URL } )
    }
  }

  onHover = hovered => this.setState( { hovered } )

  render() {
    const { location, settings } = this.props
    const { hovered } = this.state

    const { local: { theme: { simpleGraphics: simple } } } = settings

    const routes = [
      [ MENU_URL, Menu ],
      [ SEARCH_URL, Search ],
      [ NAVIGATOR_URL, Navigator, NavigatorBar ],
      [ HISTORY_URL, History ],
      [ BOOKMARKS_URL, Bookmarks ],
    ]

    return (
      <Switch>
        {routes.map( ( [ route, Component, BarComponent ] ) => (
          <Route
            key={route}
            path={route}
            render={props => (
              <div className={classNames( { simple }, 'controller' )}>
                <TopBar
                  {...props}
                  title={hovered || route.split( '/' ).pop()}
                  onHover={this.onHover}
                />
                <div className="content">
                  <Component {...this.props} {...props} />
                </div>
                <BottomBar
                  {...props}
                  onHover={this.onHover}
                  renderContent={() => BarComponent && <BarComponent {...this.props} {...props} />}
                />
              </div>
            )}
          />
        ) )}
        <Redirect to={{ ...location, pathname: SEARCH_URL }} />
      </Switch>
    )
  }
}

Controller.propTypes = {
  history: history.isRequired,
  location: location.isRequired,
  shabad: shape( { lines: arrayOf( shape( { id: string, gurmukhi: string } ) ) } ),
  bani: shape( { lines: arrayOf( shape( { id: string, gurmukhi: string } ) ) } ),
  settings: shape( {
    local: shape( { theme: shape( { simpleGraphics: bool } ) } ),
  } ).isRequired,
}

Controller.defaultProps = {
  shabad: undefined,
  bani: undefined,
}

export default Controller
