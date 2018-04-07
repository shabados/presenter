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
// URLs
export const NAVIGATOR_URL = '/navigator'
export const MENU_URL = `${NAVIGATOR_URL}/menu`
export const SEARCH_URL = `${NAVIGATOR_URL}/search`
export const BOOKMARKS_URL = `${NAVIGATOR_URL}/bookmarks`
export const CONTROLLER_URL = `${NAVIGATOR_URL}/controller`
export const HISTORY_URL = `${NAVIGATOR_URL}/history`

// Search
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
  'Toggle Fullscreen Navigator': [ 'shift+f' ],
  'Refresh': [ 'ctrl+r' ],
  'New Navigator': [ 'ctrl+x', 'ctrl+shift+x' ],
  'Toggle Navigator': [ 'ctrl+h', 'ctrl+shift+h' ],
  'History Back': [ 'ctrl+left', 'alt+left' ],
  'History Forwards': [ 'ctrl+right', 'alt+right' ],
  'Search': [ 'ctrl+/', 'ctrl+f' ],
  'Controller': [ 'ctrl+c' ],
  'History': [ 'ctrl+y' ],
  'Bookmarks': [ 'ctrl+b' ],
  'Clear Display': [ 'esc' ],
}
