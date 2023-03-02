import './App.css'

import { RecommendedSources, Shabad, Writer } from '@presenter/contract'
import classNames from 'classnames'
import { SnackbarProvider } from 'notistack'
import { ElementType, lazy, PureComponent, ReactNode, Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { BACKEND_URL, isDesktop, isMobile, isTablet, OVERLAY_URL, PRESENTER_URL, SCREEN_READER_URL, SETTINGS_URL } from './lib/consts'
import {
  BookmarksContext,
  ContentContext,
  HistoryContext,
  RecommendedSourcesContext,
  SettingsContext,
  StatusContext,
  WritersContext,
} from './lib/contexts'
import controller from './lib/controller'
import { DEFAULT_OPTIONS } from './lib/options'
import { merge } from './lib/utils'
import Overlay from './Overlay'
import Loader from './shared/Loader'

const ScreenReader = lazy( () => import( './ScreenReader' ) )
const Presenter = lazy( () => import( './Presenter' ) )
const Settings = lazy( () => import( './Settings' ) )

const loadSettings = () => merge( { local: controller.readSettings() }, DEFAULT_OPTIONS )

class App extends PureComponent {
  components = [
    [ Overlay, OVERLAY_URL ],
    [ ScreenReader, SCREEN_READER_URL ],
    [ Settings, SETTINGS_URL ],
    [ Presenter, PRESENTER_URL ],
  ] as const

  state = {
    connected: false,
    connectedAt: null,
    status: null,
    banis: [],
    bani: null,
    lineId: null,
    mainLineId: null,
    nextLineId: null,
    viewedLines: {},
    transitionHistory: {},
    latestLines: {},
    shabad: null,
    recommendedSources: {} as RecommendedSources['recommendedSources'],
    writers: {},
    settings: loadSettings(),
    next: {},
  }

  componentDidMount() {
    // Register controller event
    controller.on( 'connected', this.onConnected )
    controller.on( 'disconnected', this.onDisconnected )
    controller.on( 'shabads:current', this.onShabad )
    controller.on( 'lines:current', this.onLine )
    controller.on( 'lines:main', this.onMainLine )
    controller.on( 'lines:next', this.onNextLine )
    controller.on( 'history:viewed-lines', this.onViewedLines )
    controller.on( 'history:transitions', this.onTransitionHistory )
    controller.on( 'history:latest-lines', this.onLatestLineHistory )
    controller.on( 'banis:list', this.onBanis )
    controller.on( 'banis:current', this.onBani )
    controller.on( 'status', this.onStatus )
    controller.on( 'settings', this.onSettings )

    // Get recommended sources and set as settings, if there are none
    void fetch( `${BACKEND_URL}/sources` )
      .then( ( res ) => res.json() )
      .then( ( { recommendedSources }: { recommendedSources: RecommendedSources['recommendedSources'] } ) => {
        //* Update default options and settings with fetched recommended sources
        DEFAULT_OPTIONS.local.sources = recommendedSources
        //! Re-load settings since we've modified DEFAULT_OPTIONS directly
        this.setState( { recommendedSources, settings: loadSettings() } )
      } )

    // Get writers
    void fetch( `${BACKEND_URL}/writers` )
      .then( ( res ) => res.json() )
      .then( ( { writers }: { writers: Writer[] } ) => this.setState( { writers } ) )
  }

  componentWillUnmount() {
    // Deregister event listeners from controller
    controller.off( 'connected', this.onConnected )
    controller.off( 'disconnected', this.onDisconnected )
    controller.off( 'shabads:current', this.onShabad )
    controller.off( 'lines:current', this.onLine )
    controller.off( 'history:transitions', this.onTransitionHistory )
    controller.off( 'history:latest-lines', this.onLatestLineHistory )
    controller.off( 'lines:main', this.onMainLine )
    controller.off( 'lines:next', this.onNextLine )
    controller.off( 'lines:viewed', this.onViewedLines )
    controller.off( 'banis:list', this.onBanis )
    controller.off( 'banis:current', this.onBani )
    controller.off( 'status', this.onStatus )
    controller.off( 'settings', this.onSettings )
  }

  onConnected = () => this.setState( {
    connectedAt: new Date(),
    connected: true,
    bani: null,
    shabad: null,
  } )

  onDisconnected = () => this.setState( { connected: false } )

  onShabad = ( shabad: Shabad ) => this.setState( { next: { shabad, bani: null } } )

  onLine = ( lineId: string ) => this.setState(
    ( { next }: any ) => ( { lineId, ...next, next: {} } )
  )

  onViewedLines = ( viewedLines: any[] ) => this.setState( { viewedLines } )

  onMainLine = ( mainLineId: string ) => this.setState( { mainLineId } )

  onNextLine = ( nextLineId: string ) => this.setState( { nextLineId } )

  onTransitionHistory = ( transitionHistory: any[] ) => this.setState( { transitionHistory } )

  onLatestLineHistory = ( latestLines: any[] ) => this.setState( { latestLines } )

  onStatus = ( status: any ) => this.setState( { status } )

  onBanis = ( banis: any[] ) => this.setState( { banis } )

  onBani = ( bani: any ) => this.setState( { next: { bani, shabad: null } } )

  onSettings = ( { global = {}, local = {}, ...settings } ) => {
    controller.saveLocalSettings( local, false )

    this.setState( ( state: typeof this.state ) => ( {
      settings: {
        ...Object
          .entries( settings )
          .filter( ( [ , config ] ) => config )
          .reduce( ( deviceSettings, [ host, config ] ) => ( {
            ...deviceSettings,
            [ host ]: merge( DEFAULT_OPTIONS.local, config ),
          } ), {} ),
        local: controller.readSettings(),
        global: merge( state.settings.global, global ),
      },
    } ) )
  }

  render() {
    const {
      connected,
      connectedAt,
      status,
      banis,
      recommendedSources,
      writers,
      bani,
      shabad,
      lineId,
      mainLineId,
      nextLineId,
      viewedLines,
      transitionHistory,
      latestLines,
      settings,
    } = this.state

    // Generate a context wrapper function
    const withContexts = ( [
      [ StatusContext.Provider, { connected, connectedAt, status } ],
      [ SettingsContext.Provider, settings ],
      [ HistoryContext.Provider, { viewedLines, transitionHistory, latestLines } ],
      [ BookmarksContext.Provider, banis ],
      [ WritersContext.Provider, writers ],
      [ RecommendedSourcesContext.Provider, recommendedSources ],
      [ ContentContext.Provider, { bani, shabad, lineId, mainLineId, nextLineId } ],
      [ SnackbarProvider ],
    ] as [ElementType, any][] )
      .reduce( ( withContexts, [ Provider, value ] ) => ( children ) => withContexts(
        <Provider value={value}>
          {children}
        </Provider>,
      ), ( context: ReactNode ) => context )

    return withContexts(
      <div className={classNames( { mobile: isMobile, tablet: isTablet, desktop: isDesktop }, 'app' )}>
        <Suspense fallback={<Loader />}>
          <Router>
            <Routes>
              {this.components.map( ( [ Component, path ] ) => (
                <Route key={path} path={path} element={<Component />} />
              ) )}
            </Routes>
          </Router>
        </Suspense>
      </div>,
    )
  }
}

export default App
