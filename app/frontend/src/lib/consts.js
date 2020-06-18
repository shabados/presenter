import { detect } from 'detect-browser'
import detectMobile from 'is-mobile'

/**
 * Application Constants
 * @ignore
 */

export const isElectron = navigator.userAgent.indexOf( 'Electron' ) > -1
export const isDev = process.env.NODE_ENV !== 'production'

export const browser = detect()
export const isMac = browser.os === 'Mac OS'
export const isMobile = detectMobile()
export const isTablet = detectMobile( { tablet: true } )
export const isDesktop = !( isMobile || isTablet )

// The user is considered idle after 3 seconds
export const IDLE_TIMEOUT = 1000 * 3

/* Backend Info */
// eslint-disable-next-line no-undef
export const BACKEND_HOST = window.location.hostname || 'localhost'
export const BACKEND_PORT = !isDev ? 1699 : 42425
export const BACKEND_URL = `http://${BACKEND_HOST}:${BACKEND_PORT}`
export const WS_URL = `ws://${BACKEND_HOST}:${BACKEND_PORT}`

/* Sentry Data Source Name */
export const SENTRY_DSN = 'https://51b714c1e7544cba86efb2cad85152ff@sentry.io/1363390'
export const SENTRY_PROJECT = 'desktop-frontend'

/* Navigator */
// URLs
export const PRESENTER_URL = ''
export const CONTROLLER_URL = `${PRESENTER_URL}/controller`
export const SEARCH_URL = `${CONTROLLER_URL}/search`
export const BOOKMARKS_URL = `${CONTROLLER_URL}/bookmarks`
export const NAVIGATOR_URL = `${CONTROLLER_URL}/navigator`
export const HISTORY_URL = `${CONTROLLER_URL}/history`
export const HISTORY_DOWNLOAD_URL = `${BACKEND_URL}/history.csv`
export const THEMES_URL = `${BACKEND_URL}/presenter/themes`
export const OVERLAY_THEMES_URL = `${BACKEND_URL}/overlay/themes`

export const SETTINGS_URL = '/settings'
export const SETTINGS_DEVICE_URL = `${SETTINGS_URL}/device`
export const SETTINGS_SERVER_URL = `${SETTINGS_URL}/server`

export const SETTINGS_ABOUT_URL = `${SETTINGS_SERVER_URL}/about`
export const SETTINGS_TOOLS_URL = `${SETTINGS_URL}/tools`
export const SETTINGS_OVERLAY_URL = `${SETTINGS_TOOLS_URL}/overlay`

export const OVERLAY_URL = '/overlay'
export const SCREEN_READER_URL = '/screenreader'

// URL states
export const STATES = {
  controllerOnly: 'controllerOnly', // Fullscreen controller
  query: 'query', // Search query
}

// Search
export const MIN_SEARCH_CHARS = 2

// Detect vishraams/pauses with characters
export const PAUSE_CHARS = {
  heavy: ';',
  medium: ',',
  light: '.',
}

// Search type names
export const SEARCH_TYPES = {
  fullWord: 'full-word',
  firstLetter: 'first-letter',
}

// Searching modifiers
export const SEARCH_CHARS = {
  wildcard: ' ',
  wordAnywhere: '#',
  wordOrder: '^',
  larivaarAccentless: '%',
}

// Search modifier anchors
export const SEARCH_ANCHORS = {
  [ SEARCH_CHARS.wordAnywhere ]: SEARCH_TYPES.fullWord,
}

// Bani IDs
export const BANIS = {
  ASA_KI_VAAR: 11,
}

// Language IDs
export const LANGUAGES = {
  english: 1,
  punjabi: 2,
  spanish: 3,
  hindi: 4,
  urdu: 5,
}

export const LANGUAGE_NAMES = {
  [ LANGUAGES.english ]: 'english',
  [ LANGUAGES.punjabi ]: 'punjabi',
  [ LANGUAGES.spanish ]: 'spanish',
  [ LANGUAGES.hindi ]: 'hindi',
  [ LANGUAGES.urdu ]: 'urdu',
}

//! Until ShabadOS/database#1767 is resolved
export const SOURCE_ABBREVIATIONS = {
  1: 'SGGS Ji',
  2: 'Sri Dasam Granth Ji',
  3: 'Vaaran',
  4: 'Kabit Svaiye',
  5: 'Ghazals',
  6: 'Zindagi Naama',
  7: 'Ganj Naama',
  8: 'Jot Bigaas',
  9: 'Ardaas',
  10: 'Rehitname',
  11: 'Sri Sarabloh Granth Ji',
  12: 'Uggardanti',
}

// Line type IDs
export const LINE_TYPES = {
  manglaCharan: 1,
  sirlekh: 2,
  rahao: 3,
  pankti: 4,
}
