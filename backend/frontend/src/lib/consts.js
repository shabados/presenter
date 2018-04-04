/**
 * Application Constants
 * @ignore
 */

/* Backend Info */
// eslint-disable-next-line no-undef
export const BACKEND_HOST = window.location.hostname
export const BACKEND_PORT = 8080
export const BACKEND_URL = `http://${BACKEND_HOST}:${BACKEND_PORT}`
export const WS_URL = `ws://${BACKEND_HOST}:${BACKEND_PORT}`

// Theme CSS and asset files located here
export const THEME_URL = `${BACKEND_URL}/themes`

/* Navigator */
export const NAVIGATOR_URL = '/navigator'
export const MIN_SEARCH_CHARS = 2
export const MAX_RESULTS = 20

export const PAUSE_CHARS = {
  heavy: ';',
  medium: ',',
  light: '.',
}

export const WILDCARD_CHAR = '_'
