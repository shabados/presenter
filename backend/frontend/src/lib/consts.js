/* eslint-disable quote-props */
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

// Detect vishraams/pauses with characters
export const PAUSE_CHARS = {
  heavy: ';',
  medium: ',',
  light: '.',
}

// Wildcard searching
export const WILDCARD_CHAR = '_'

/* Hotkeys and shortcuts */
// Jump to navigation line ordered hot keys
export const LINE_HOTKEYS = Array.from( '1234567890qwertyuiopasdfghjklzxcvbnm' )

// Global application shortcuts
export const SHORTCUTS = {
  'Toggle Help': [ '?', 'shift+/' ],
  'Toggle Fullscreen': [ 'f11' ],
  'Refresh': [ 'ctrl+r' ],
  'New Controller': [ 'ctrl+n' ],
  'Toggle Controller': [ 'ctrl+h' ],
  'History Back': [ 'ctrl+left' ],
  'History Forwards': [ 'ctrl+right' ],
  'Search': [ 'ctrl+/', 'ctrl+f' ],
  'History': [ 'ctrl+y' ],
  'Bookmarks': [ 'ctrl+b' ],
  'Clear Display': [ 'esc' ],
}
