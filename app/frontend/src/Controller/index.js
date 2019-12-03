import React, { Component } from 'react'
import { hot } from 'react-hot-loader/root'
import { Route, Switch, Redirect } from 'react-router-dom'
import { history, location } from 'react-router-prop-types'
import { string, func, shape, arrayOf, bool } from 'prop-types'

import classNames from 'classnames'
import queryString from 'qs'

import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import {
  faCog,
  faHistory,
  faMap,
  faSearch,
  faSignOutAlt,
  faVideoSlash,
  faWindowMinimize,
  faWindowMaximize,
} from '@fortawesome/free-solid-svg-icons'
import { faStar } from '@fortawesome/free-regular-svg-icons'

import controller from '../lib/controller'
import {
  BOOKMARKS_URL,
  CONTROLLER_URL,
  HISTORY_URL,
  NAVIGATOR_URL,
  SEARCH_URL,
  SETTINGS_URL,
  STATES,
  PRESENTER_URL,
} from '../lib/consts'
import { getUrlState } from '../lib/utils'

import ToolbarButton from './ToolbarButton'
import Search from './Search'
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

  const { search, pathname } = location
  const state = getUrlState( search )

  return (
    <Toolbar className="top bar">
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
      {state[ STATES.controllerOnly ] ? (
        <ToolbarButton
          name="Minimize Controller"
          icon={faWindowMaximize}
          flip="vertical"
          onClick={() => history.push( {
            ...location,
            search: queryString.stringify( { ...state, [ STATES.controllerOnly ]: undefined } ),
          } )}
          onMouseEnter={() => onHover( 'Minimize Controller' )}
          onMouseLeave={resetHover}
        />
      ) : (
        <ToolbarButton
          name="Maximize Controller"
          icon={faWindowMaximize}
          onClick={() => history.push( {
            ...location,
            search: queryString.stringify( { ...state, [ STATES.controllerOnly ]: true } ),
          } )}
          onMouseLeave={resetHover}
        />
      )}
      <ToolbarButton
        name="Pop Out"
        icon={faSignOutAlt}
        onClick={() => {
          const popOutQuery = queryString.stringify( { ...state, [ STATES.controllerOnly ]: true } )

          window.open( `${pathname}?${popOutQuery}`, '_blank' )
          history.push( PRESENTER_URL )
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
const BottomBar = ( { history, renderContent, location, onHover, bani, shabad } ) => {
  const go = pathname => () => history.push( { ...location, pathname } )
  const resetHover = () => onHover( null )
  const { lines = [] } = shabad || bani || {}

  return (
    <Toolbar className="bottom bar">
      <ToolbarButton name="Search" icon={faSearch} onClick={go( SEARCH_URL )} onHover={onHover} />
      <ToolbarButton
        name="History"
        icon={faHistory}
        onClick={go( HISTORY_URL )}
        onMouseEnter={() => onHover( 'History' )}
        onMouseLeave={resetHover}
      />
      <ToolbarButton
        name="Bookmarks"
        icon={faStar}
        onClick={go( BOOKMARKS_URL )}
        onMouseEnter={() => onHover( 'Bookmarks' )}
        onMouseLeave={resetHover}
      />
      <div className="middle">{renderContent()}</div>
      {!!lines.length && (
      <ToolbarButton
        name="Navigator"
        icon={faMap}
        onClick={go( NAVIGATOR_URL )}
        onMouseEnter={() => onHover( 'Navigator' )}
        onMouseLeave={resetHover}
      />
      )}
      <ToolbarButton
        name="Clear"
        icon={faVideoSlash}
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
  shabad: shape( { lines: arrayOf( shape( { id: string, gurmukhi: string } ) ) } ),
  bani: shape( { lines: arrayOf( shape( { id: string, gurmukhi: string } ) ) } ),
}

BottomBar.defaultProps = {
  onHover: () => {},
  renderContent: () => null,
  shabad: null,
  bani: null,
}

/**
 * Controller controls the display and configures settings.
 */
class Controller extends Component {
  constructor( props ) {
    super( props )

    const { location: { search } } = this.props

    this.state = {
      hovered: null,
      lastUrl: `${NAVIGATOR_URL}${search}`,
    }
  }

  unlistenHistory = () => {}

  componentDidMount() {
    const { history } = this.props

    this.unlistenHistory = history.listen( ( { pathname, search } ) => {
      // Save navigation to any subroutes
      if ( pathname.match( `${CONTROLLER_URL}/.*` ) ) {
        const lastUrl = `${pathname}${search}`
        this.setState( { lastUrl } )
      }
    } )
  }

  componentWillUnmount() {
    this.unlistenHistory()
  }

  componentDidUpdate( { shabad: prevShabad, bani: prevBani } ) {
    const { history, shabad, bani, location } = this.props
    const { pathname } = location

    const redirects = [ SEARCH_URL, HISTORY_URL, BOOKMARKS_URL ]

    // Go to navigator if a different Shabad/Bani has been selected, and we're on a redirect page
    const isNewSelection = ( shabad && shabad !== prevShabad ) || ( bani && bani !== prevBani )

    if ( isNewSelection && redirects.some( route => pathname.includes( route ) ) ) {
      history.push( { ...location, pathname: NAVIGATOR_URL } )
    }
  }

  onHover = hovered => this.setState( { hovered } )

  render() {
    const { settings, shabad, bani } = this.props
    const { hovered, lastUrl } = this.state

    const { local: { theme: { simpleGraphics: simple } } } = settings

    const routes = [
      [ SEARCH_URL, Search ],
      [ NAVIGATOR_URL, Navigator, NavigatorBar ],
      [ HISTORY_URL, History ],
      [ BOOKMARKS_URL, Bookmarks ],
    ]

    return (
      <Switch key={( shabad || bani || {} ).id}>
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
                  {...this.props}
                  {...props}
                  onHover={this.onHover}
                  renderContent={() => BarComponent && (
                    <BarComponent
                      {...this.props}
                      {...props}
                      onHover={this.onHover}
                    />
                  )}
                />
              </div>
            )}
          />
        ) )}
        <Redirect to={lastUrl} />
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

export default hot( Controller )
