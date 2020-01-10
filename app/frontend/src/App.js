import React, { PureComponent, lazy, Suspense } from 'react'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import { configure } from 'react-hotkeys'
import { hot } from 'react-hot-loader/root'
import classNames from 'classnames'

import { OVERLAY_URL, SCREEN_READER_URL, SETTINGS_URL, PRESENTER_URL, BACKEND_URL, isMobile, isTablet, isDesktop } from './lib/consts'
import { DEFAULT_OPTIONS } from './lib/options'
import { merge } from './lib/utils'
import controller from './lib/controller'
import { ContentContext, StatusContext, SettingsContext, HistoryContext, BookmarksContext, RecommendedSourcesContext } from './lib/contexts'

import Overlay from './Overlay'
import Loader from './shared/Loader'

import './App.css'

const ScreenReader = lazy( () => import( './ScreenReader' ) )
const Presenter = lazy( () => import( './Presenter' ) )
const Settings = lazy( () => import( './Settings' ) )

class App extends PureComponent {
  components = [
    [ Overlay, OVERLAY_URL ],
    [ ScreenReader, SCREEN_READER_URL ],
    [ Settings, SETTINGS_URL ],
    [ Presenter, PRESENTER_URL ],
  ]

  constructor( props ) {
    super( props )

    // Configure react-hotkeys
    configure( {
      ignoreTags: [],
      ignoreKeymapAndHandlerChangesByDefault: false,
    } )

    this.state = {
      connected: false,
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
      recommendedSources: {},
      settings: merge( { local: controller.readSettings() }, DEFAULT_OPTIONS ),
    }
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
    controller.on( 'settings:all', this.onSettings )

    // Get recommended sources and set as settings, if there are none
    fetch( `${BACKEND_URL}/sources` )
      .then( res => res.json() )
      .then( ( { recommended: recommendedSources } ) => {
        //* Update default options and settings with fetched recommended sources
        DEFAULT_OPTIONS.local.sources = recommendedSources
        this.setState( ( { settings } ) => ( { recommendedSources, settings } ) )
      } )
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
    controller.off( 'settings:all', this.onSettings )
  }

  onConnected = () => this.setState( { connected: true, bani: null, shabad: null } )

  onDisconnected = () => this.setState( { connected: false } )

  onShabad = shabad => this.setState( { shabad, bani: null } )

  onLine = lineId => this.setState( { lineId } )

  onViewedLines = viewedLines => this.setState( { viewedLines } )

  onMainLine = mainLineId => this.setState( { mainLineId } )

  onNextLine = nextLineId => this.setState( { nextLineId } )

  onTransitionHistory = transitionHistory => this.setState( { transitionHistory } )

  onLatestLineHistory = latestLines => this.setState( { latestLines } )

  onStatus = status => this.setState( { status } )

  onBanis = banis => this.setState( { banis } )

  onBani = bani => this.setState( { bani, shabad: null } )

  onSettings = ( { global = {}, local = {}, ...settings } ) => this.setState( state => ( {
    settings: {
      ...state.settings,
      ...Object.entries( settings ).reduce( ( settings, [ host, config ] ) => ( {
        ...settings,
        [ host ]: merge( DEFAULT_OPTIONS.local, config ),
      } ), {} ),
      local: controller.saveLocalSettings( local ) || controller.readSettings(),
      global: merge( state.settings.global, global ),
    },
  } ) )

  render() {
    const {
      connected,
      status,
      banis,
      recommendedSources,
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

    return (
      <div className={classNames( { mobile: isMobile, tablet: isTablet, desktop: isDesktop }, 'app' )}>
        <StatusContext.Provider value={{ connected, status }}>
          <SettingsContext.Provider value={settings}>
            <HistoryContext.Provider value={{ viewedLines, transitionHistory, latestLines }}>
              <BookmarksContext.Provider value={banis}>
                <RecommendedSourcesContext.Provider value={recommendedSources}>
                  <ContentContext.Provider value={{ bani, shabad, lineId, mainLineId, nextLineId }}>

                    <Suspense fallback={<Loader />}>
                      <Router>
                        <Switch>
                          {this.components.map( ( [ Component, path ] ) => (
                            <Route key={path} path={path} component={Component} />
                          ) )}
                        </Switch>
                      </Router>
                    </Suspense>

                  </ContentContext.Provider>
                </RecommendedSourcesContext.Provider>
              </BookmarksContext.Provider>
            </HistoryContext.Provider>
          </SettingsContext.Provider>
        </StatusContext.Provider>
      </div>
    )
  }
}

export default hot( App )
