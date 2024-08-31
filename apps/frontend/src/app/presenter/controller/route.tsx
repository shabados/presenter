import './route.css'

import { faStar } from '@fortawesome/free-regular-svg-icons'
import {
  faCog,
  faHistory,
  faMap,
  faSearch,
  faSignOutAlt,
  faVideoSlash,
  faWindowMaximize,
  faWindowMinimize,
} from '@fortawesome/free-solid-svg-icons'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { createFileRoute, Outlet, ToPathOption, useLocation, useNavigate, useRouter } from '@tanstack/react-router'
import { zodSearchValidator } from '@tanstack/router-zod-adapter'
import classNames from 'classnames'
import { useContext, useEffect, useState } from 'react'
import { z } from 'zod'

import { ContentContext, SettingsContext } from '~/helpers/contexts'
import { useCurrentLines, usePrevious } from '~/hooks'
import { useNavigateUtils } from '~/hooks/navigate'
import controller from '~/services/controller'

import ToolbarButton from './-components/ToolbarButton'

type OnHover = ( message: string | null ) => Record<string, any>

type TopBarProps = {
  title?: string,
  onHover?: OnHover,
}

const TopBar = ( { title = '', onHover = () => ( {} ) }: TopBarProps ) => {
  const resetHover = () => onHover( null )

  const router = useRouter()
  const navigate = Route.useNavigate()
  const { open } = useNavigateUtils()
  const { controllerOnly } = Route.useSearch()

  return (
    <Toolbar className="top bar">
      <ToolbarButton
        name="Settings"
        icon={faCog}
        onClick={() => open( { to: '/settings' } )}
        onMouseEnter={() => onHover( 'Settings' )}
        onMouseLeave={resetHover}
      />

      <Typography className="name" type="title">{title}</Typography>

      <ToolbarButton
        name="Minimize"
        icon={faWindowMinimize}
        onClick={() => void navigate( { to: '/' } )}
        onMouseEnter={() => onHover( 'Hide Controller' )}
        onMouseLeave={resetHover}
      />

      {controllerOnly ? (
        <ToolbarButton
          name="Minimize Controller"
          icon={faWindowMaximize}
          flip="vertical"
          onClick={() => void navigate( {
            search: ( s ) => ( { ...s, controllerOnly: undefined } ),
          } )}
          onMouseEnter={() => onHover( 'Minimize Controller' )}
          onMouseLeave={resetHover}
        />
      ) : (
        <ToolbarButton
          name="Maximize Controller"
          icon={faWindowMaximize}
          onClick={() => void navigate( {
            search: ( s ) => ( { ...s, controllerOnly: true } ),
          } )}
          onMouseEnter={() => onHover( 'Maximize Controller' )}
          onMouseLeave={resetHover}
        />
      )}

      <ToolbarButton
        name="Pop Out"
        icon={faSignOutAlt}
        onClick={() => {
          const { href } = router.buildLocation( {
            search: ( s ) => ( { ...s, controllerOnly: true } ),
          } )

          window.open( href, '_blank' )
        }}
        onMouseEnter={() => onHover( 'Pop Out Controller' )}
        onMouseLeave={resetHover}
      />
    </Toolbar>
  )
}

type BottomBarProps = {
  onHover?: OnHover,
  renderContent?: () => any,
}

const BottomBar = ( { renderContent = () => null, onHover = () => ( {} ) }: BottomBarProps ) => {
  const navigate = useNavigate()

  const lines = useCurrentLines()

  const resetHover = () => onHover( null )

  return (
    <Toolbar className="bottom bar">
      <ToolbarButton name="Search" icon={faSearch} onClick={() => void navigate( { to: '/presenter/controller/search', search: ( s ) => s } )} onHover={onHover} />

      <ToolbarButton
        name="History"
        icon={faHistory}
        onClick={() => void navigate( { to: '/presenter/controller/history', search: ( s ) => s } )}
        onMouseEnter={() => onHover( 'History' )}
        onMouseLeave={resetHover}
      />

      <ToolbarButton
        name="Bookmarks"
        icon={faStar}
        onClick={() => void navigate( { to: '/presenter/controller/bookmarks', search: ( s ) => s } )}
        onMouseEnter={() => onHover( 'Bookmarks' )}
        onMouseLeave={resetHover}
      />

      <div className="middle">{renderContent()}</div>

      {!!lines.length && (
        <ToolbarButton
          name="Navigator"
          icon={faMap}
          onClick={() => void navigate( { to: '/presenter/controller/navigator', search: ( s ) => s } )}
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

const Controller = ( props ) => {
  const { shabad, bani } = useContext( ContentContext )
  const lines = useCurrentLines()

  const previousLines = usePrevious( lines )

  const [ hovered, setHovered ] = useState( null )

  const pathname = useLocation( { select: ( l ) => l.pathname } )
  const navigate = Route.useNavigate()

  useEffect( () => {
    const redirects = [
      '/presenter/controller/search',
      '/presenter/controller/history',
      '/presenter/controller/bookmarks',
    ] satisfies ToPathOption['to'][]

    // Redirect to navigator tab if on one of the redirectable pages
    const isTransition = lines.length && lines !== previousLines

    if ( isTransition && redirects.some( ( route ) => pathname.includes( route ) ) ) {
      void navigate( { to: '/presenter/controller/navigator' } )
    }
  }, [ history, lines, previousLines, navigate, pathname ] )

  const settings = useContext( SettingsContext )
  const { local: { theme: { simpleGraphics: simple } } } = settings

  return (
    <div className={classNames( { simple }, 'controller' )}>
      <TopBar
        title={hovered || pathname.split( '/' ).pop()}
        onHover={setHovered}
      />

      <div className="content">
        <Outlet />
      </div>

      <BottomBar
        {...props}
        onHover={setHovered}
        // renderContent={() => BarComponent && (
        //   <BarComponent
        //     {...props}
        //     onHover={setHovered}
        //   />
        // )}
      />
    </div>

  )
}

export const Route = createFileRoute( '/presenter/controller' )( {
  component: Controller,
  validateSearch: zodSearchValidator( z.object( {
    query: z.string().optional(),
  } ) ),
} )
