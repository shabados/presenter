/* eslint-disable quote-props */
/**
 * Application Constants
 * @ignore
 */

/* Backend Info */
// eslint-disable-next-line no-undef
export const BACKEND_HOST = window.location.hostname || 'localhost'
export const BACKEND_PORT = process.env.NODE_ENV === 'production' ? 42424 : 8080
export const BACKEND_URL = `http://${BACKEND_HOST}:${BACKEND_PORT}`
export const WS_URL = `ws://${BACKEND_HOST}:${BACKEND_PORT}`

// Theme CSS and asset files located here
export const THEME_URL = `${BACKEND_URL}/themes`

/* Navigator */
// URLs
export const CONTROLLER_URL = '/controller'
export const MENU_URL = `${CONTROLLER_URL}/menu`
export const SEARCH_URL = `${CONTROLLER_URL}/search`
export const BOOKMARKS_URL = `${CONTROLLER_URL}/bookmarks`
export const NAVIGATOR_URL = `${CONTROLLER_URL}/navigator`
export const HISTORY_URL = `${CONTROLLER_URL}/history`

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
  'Toggle Shortcuts Help': [ '?', 'shift+/' ],
  'Toggle Fullscreen': [ 'f11' ],
  'Toggle Fullscreen Controller': [ 'shift+f' ],
  'Refresh': [ 'ctrl+r' ],
  'New Controller': [ 'ctrl+x', 'ctrl+shift+x' ],
  'Toggle Controller': [ 'ctrl+h', 'ctrl+shift+h' ],
  'History Back': [ 'ctrl+left', 'alt+left' ],
  'History Forwards': [ 'ctrl+right', 'alt+right' ],
  'Search': [ 'ctrl+/', 'ctrl+f' ],
  'Menu': [ 'ctrl+p', 'ctrl+,' ],
  'Navigator': [ 'ctrl+c' ],
  'History': [ 'ctrl+y' ],
  'Bookmarks': [ 'ctrl+b' ],
  'Clear Display': [ 'esc' ],
}
