import React from 'react'

import { IconButton, Toolbar, Typography } from 'material-ui'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
  faBars,
  faBookmark,
  faHistory,
  faList,
  faSearch,
  faSignOutAlt,
  faWindowMinimize,
} from '@fortawesome/fontawesome-free-solid'
import { faSquare } from '@fortawesome/fontawesome-free-regular'

import controller from '../../lib/controller'
import {
  BOOKMARKS_URL,
  CONTROLLER_URL,
  HISTORY_URL, MENU_URL,
  NAVIGATOR_URL,
  SEARCH_URL,
} from '../../lib/consts'

/**
 * Renders an individual icon button, setting the state with the name on hover and click.
 * @param name The human-readable name of the icon.
 * @param icon The font-awesome icon.
 * @param onClick Optional click handler.
 * @param onMouseEnter MouseEnter click handler.
 * @param onMouseLeave MouseLeave click handler.
 * @param className Optional classname.
 */
const ToolbarButton = ( { name, icon, onClick, onMouseEnter, onMouseLeave, className = '' } ) => (
  <IconButton
    key={name}
    className={className}
    tabIndex={-1}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onClick={onClick}
  >
    <FontAwesomeIcon icon={icon} />
  </IconButton>
)

/**
 * Renders the top navigation bar, showing the current path in the URL, and the hover state.
 * @param title The title text in the top bar.
 * @param history A `history` object.
 * @param location A `location` object.
 * @param onHover Fired on hover with name.
 */
const TopBar = ( { title, history, location, onHover } ) => {
  const resetHover = () => onHover( null )

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
        name="Backwards"
        icon={faArrowAltCircleLeft}
        onClick={() => history.goBack()}
        onMouseEnter={() => onHover( 'Backwards' )}
        onMouseLeave={resetHover}
      />
      <ToolbarButton
        name="Forwards"
        icon={faArrowAltCircleRight}
        onClick={() => history.goForward()}
        onMouseEnter={() => onHover( 'Forwards' )}
        onMouseLeave={resetHover}
      />
      <Typography className="name" type="title">{title}</Typography>
      <ToolbarButton
        name="Minimize"
        icon={faWindowMinimize}
        onClick={() => history.push( '/' )}
        onMouseEnter={() => onHover( 'Minimize' )}
        onMouseLeave={resetHover}
      />
      <ToolbarButton
        name="Pop Out"
        icon={faSignOutAlt}
        onClick={() => window.open( `${CONTROLLER_URL}/?controllerOnly=true`, '_blank' )}
        onMouseEnter={() => onHover( 'Pop Out' )}
        onMouseLeave={resetHover}
      />
    </Toolbar>
  )
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
        icon={faBookmark}
        onClick={go( BOOKMARKS_URL )}
        onMouseEnter={() => onHover( 'Search' )}
        onMouseLeave={resetHover}
      />
      <ToolbarButton
        name="History"
        icon={faHistory}
        onClick={go( HISTORY_URL )}
        onMouseEnter={() => onHover( 'History' )}
        onMouseLeave={resetHover}
      />
      <div className="name">{renderContent()}</div>
      <ToolbarButton
        name="Navigator"
        icon={faList}
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

/**
 * Dumb Controller component.
 * @param Component The content to render.
 * @param history A `history` object.
 * @param location A `location` object.
 * @param title The title of the top bar.
 * @param renderBarContent A render prop for content in the bottom bar.
 * @param onHover Fired on hover with name.
 * @param rest The rest of the props passed down.
 */
const Controller = ( {
  Component,
  history,
  location,
  title,
  renderBarContent = () => null,
  onHover = () => null,
  ...rest,
} ) => (
  <div className="controller">
    <TopBar location={location} history={history} onHover={onHover} title={title} />
    <div className="content">
      <Component history={history} location={location} {...rest} />
    </div>
    <BottomBar
      location={location}
      history={history}
      onHover={onHover}
      renderContent={renderBarContent}
    />
  </div>
)

export default Controller
