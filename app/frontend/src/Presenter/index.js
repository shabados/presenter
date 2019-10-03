import React, { Component, lazy, Suspense } from 'react'
import { shape, string } from 'prop-types'
import { location } from 'react-router-prop-types'
import { GlobalHotKeys } from 'react-hotkeys'
import { Link, Route } from 'react-router-dom'
import queryString from 'qs'
import classNames from 'classnames'

import CssBaseline from '@material-ui/core/CssBaseline'
import IconButton from '@material-ui/core/IconButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faPlus } from '@fortawesome/free-solid-svg-icons'

import StatusToast from './StatusToast'
import ThemeLoader from '../shared/ThemeLoader'
import controller from '../lib/controller'
import { getUrlState } from '../lib/utils'
import {
  CONTROLLER_URL,
  SHORTCUTS,
  MENU_URL,
  SEARCH_URL,
  HISTORY_URL,
  NAVIGATOR_URL,
  BOOKMARKS_URL,
  STATES,
} from '../lib/consts'

import './index.css'
import Loader from '../shared/Loader'

const Display = lazy( () => import( './Display' ) )
const Controller = lazy( () => import( '../Controller' ) )

class Presenter extends Component {
  /**
   * Sets the query string parameters, retaining any currently present.
   * @param params The query string parameters.
   */
  setQueryParams = params => {
    const { history, location } = this.props
    const { search } = location

    const previousSearch = getUrlState( search )
    history.push( {
      ...location,
      search: queryString.stringify( { ...previousSearch, ...params } ),
    } )
  }

  /**
   * More concise form to navigate to URLs, retaining query params.
   * @param pathname The path to navigate to.
   */
  go = pathname => {
    const { history, location } = this.props

    history.push( { ...location, pathname } )
  }

  /**
   * Toggles the controller.
   */
  toggleController = () => {
    const { location: { pathname } } = this.props

    const nextURL = pathname.includes( CONTROLLER_URL ) ? '/' : CONTROLLER_URL
    this.go( nextURL )
  }

  /**
   * Places the controller in fullscreen.
   */
  fullscreenController = () => {
    const { location: { pathname } } = this.props

    // Navigates to the controller first, if not there
    if ( !pathname.includes( CONTROLLER_URL ) ) {
      this.toggleController()
    }

    this.toggleQuery( STATES.controllerOnly )
  }

  /**
   * Toggles the given query string parameter.
   * @param query The query string parameter to toggle.
   */
  toggleQuery = query => {
    const { location: { search } } = this.props

    const parsed = getUrlState( search )
    this.setQueryParams( {
      ...parsed,
      [ query ]: parsed[ query ] ? undefined : true,
    } )
  }

  /**
   * Prevents the default action from occurring for each handler.
   * @param events An object containing the event names and corresponding handlers.
   */
  preventDefault = events => Object.entries( events )
    .reduce( ( events, [ name, handler ] ) => ( {
      ...events,
      [ name ]: event => event.preventDefault() || handler( event ),
    } ), {} )

  hotKeyHandlers = this.preventDefault( {
    [ SHORTCUTS.toggleController ]: this.toggleController,
    [ SHORTCUTS.newController ]: () => window.open( `${CONTROLLER_URL}?${STATES.controllerOnly}=true`, '_blank' ),
    [ SHORTCUTS.menu ]: () => this.go( MENU_URL ),
    [ SHORTCUTS.search ]: () => this.go( SEARCH_URL ),
    [ SHORTCUTS.history ]: () => this.go( HISTORY_URL ),
    [ SHORTCUTS.bookmarks ]: () => this.go( BOOKMARKS_URL ),
    [ SHORTCUTS.navigator ]: () => this.go( NAVIGATOR_URL ),
    [ SHORTCUTS.clearDisplay ]: controller.clear,
    [ SHORTCUTS.toggleFullscreenController ]: this.fullscreenController,
  } )

  render() {
    const { settings, location: { search }, status } = this.props
    const { controllerOnly } = getUrlState( search )

    const { local: localSettings } = settings
    const { theme: { themeName }, hotkeys } = localSettings

    return (
      <GlobalHotKeys keyMap={hotkeys} handlers={this.hotKeyHandlers}>
        <div className="presenter">
          <CssBaseline />
          <ThemeLoader name={themeName} />
          <Suspense fallback={<Loader />}>
            {!controllerOnly && <Display {...this.props} settings={localSettings} />}
          </Suspense>
          <Suspense fallback={null}>
            <div className={classNames( 'controller-container', { fullscreen: controllerOnly } )}>
              <Link to={CONTROLLER_URL}>
                <IconButton className="expand-icon"><FontAwesomeIcon icon={faPlus} /></IconButton>
              </Link>
              <Route path={CONTROLLER_URL}>
                {props => <Controller {...this.props} {...props} />}
              </Route>
            </div>
          </Suspense>
          <StatusToast status={status} />
        </div>
      </GlobalHotKeys>
    )
  }
}

Presenter.propTypes = {
  ...Display.propTypes,
  status: string,
  settings: shape( {
    theme: shape( {
      themeName: string,
    } ),
  } ).isRequired,
  location: location.isRequired,
}

Presenter.defaultProps = {
  ...Display.defaultProps,
  status: null,
}

export default Presenter
