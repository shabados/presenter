import { detect } from 'detect-browser'
import detectMobile from 'is-mobile'

export const isElectron = navigator.userAgent.indexOf( 'Electron' ) > -1
export const isDev = process.env.NODE_ENV !== 'production'

export const browser = detect()
export const isMac = browser!.os === 'Mac OS'
export const isMobile = detectMobile()
export const isTablet = detectMobile( { tablet: true } )
export const isDesktop = !( isMobile || isTablet )

/* Backend Info */
// eslint-disable-next-line no-undef
export const HOST = window.location.hostname || 'localhost'
export const PORT = window.location.port
export const BASE_URL = `${HOST}:${PORT}`
export const API_URL = `http://${BASE_URL}/api`
export const WS_URL = `ws://${BASE_URL}/api`

/* Sentry Data Source Name */
export const SENTRY_DSN = 'https://51b714c1e7544cba86efb2cad85152ff@sentry.io/1363390'
export const SENTRY_PROJECT = 'desktop-frontend'

export const HISTORY_DOWNLOAD_URL = `${BASE_URL}/history.csv`

// Search
export const MIN_SEARCH_CHARS = 2

// Search type names
export const SEARCH_TYPES = {
  fullWord: 'full-word',
  firstLetter: 'first-letter',
} as const

// Searching modifiers
export const SEARCH_CHARS = {
  wildcard: ' ',
  wordAnywhere: '#',
  wordOrder: '^',
  larivaarAccentless: '%',
} as const

// Search modifier anchors
export const SEARCH_ANCHORS = {
  [ SEARCH_CHARS.wordAnywhere ]: SEARCH_TYPES.fullWord,
} as const
