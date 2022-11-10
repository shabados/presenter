import { ServerSettings } from '@presenter/contract'

import { version } from '../../../package.json'

const defaults: ServerSettings = {
  version,
  system: {
    launchOnStartup: false,
    multipleDisplays: true,
    fullscreenOnLaunch: false,
    serverAnalytics: true,
    automaticUpdates: true,
    betaOptIn: false,
  },
  notifications: {
    connectionEvents: false,
    disconnectionEvents: false,
    downloadEvents: true,
    downloadedEvents: true,
  },
  overlay: {
    overlayName: 'Floating Top Captions',
    larivaarGurbani: false,
    larivaarAssist: false,
    englishTranslation: true,
    spanishTranslation: false,
    punjabiTranslation: false,
    englishTransliteration: false,
    hindiTransliteration: false,
    urduTransliteration: false,
    lineEnding: true,
  },
  closedCaptions: {
    zoomApiToken: null,
    larivaarGurbani: false,
    englishTranslation: true,
    spanishTranslation: false,
    punjabiTranslation: false,
    englishTransliteration: false,
    hindiTransliteration: false,
    urduTransliteration: false,
    lineEnding: true,
  },
}

export default defaults
