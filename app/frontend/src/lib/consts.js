/* eslint-disable quote-props */
/**
 * Application Constants
 * @ignore
 */

/* Backend Info */
// eslint-disable-next-line no-undef
export const BACKEND_HOST = window.location.hostname || 'localhost'
export const BACKEND_PORT = process.env.NODE_ENV === 'production' ? 42424 : 42425
export const BACKEND_URL = `http://${BACKEND_HOST}:${BACKEND_PORT}`
export const WS_URL = `ws://${BACKEND_HOST}:${BACKEND_PORT}`

// Theme CSS and asset files located here
export const THEME_URL = `${BACKEND_URL}/themes`

/* Navigator */
// URLs
export const CONTROLLER_URL = '/controller'
export const MENU_URL = `${CONTROLLER_URL}/menu`
export const SEARCH_URL = `${CONTROLLER_URL}/search`
export const BANIS_URL = `${CONTROLLER_URL}/banis`
export const NAVIGATOR_URL = `${CONTROLLER_URL}/navigator`
export const SETTINGS_URL = `${CONTROLLER_URL}/settings`
export const HISTORY_URL = `${CONTROLLER_URL}/history`
export const HISTORY_DOWNLOAD_URL = `${BACKEND_URL}/history.csv`

export const OVERLAY_URL = '/overlay'
export const SCREEN_READER_URL = '/screenreader'

// URL states
export const CONTROLLER_ONLY_QUERY = 'controllerOnly'
export const SHOW_SHORTCUTS_QUERY = 'showShortcuts'

// Search
export const MIN_SEARCH_CHARS = 2
export const MAX_RESULTS = 20

// Detect vishraams/pauses with characters
export const PAUSE_CHARS = {
  heavy: ';',
  medium: ',',
  light: '.',
}

// Searching modifiers
export const WILDCARD_CHAR = '_'
export const WORD_ANYWHERE_CHAR = '#'
export const WORD_ORDER_CHAR = '^'
export const LARIVAAR_ACCENTLESS_CHAR = '%'

/* Hotkeys and shortcuts */
// Jump to navigation line ordered hot keys
export const LINE_HOTKEYS = Array.from( '1234567890qwertyuiopasdfghjklzxcvbnm' )

// Global application shortcuts
export const SHORTCUTS = {
  toggleShorcutsHelp: 'Toggle Shortcuts Help',
  toggleFullscreen: 'Toggle Fullscreen',
  toggleFullscreenController: 'Toggle Fullscreen Controller',
  refresh: 'Refresh',
  newController: 'New Controller',
  toggleController: 'Toggle Controller',
  historyBack: 'History Back',
  historyForward: 'History Forward',
  search: 'Search',
  menu: 'Menu',
  navigator: 'Navigator',
  history: 'History',
  banis: 'Banis',
  clearDisplay: 'Clear Display',
}

export const SHORTCUT_MAP = {
  [ SHORTCUTS.toggleShorcutsHelp ]: [ '?', 'shift+/' ],
  [ SHORTCUTS.toggleFullscreen ]: [ 'f11' ],
  [ SHORTCUTS.toggleFullscreenController ]: [ 'shift+f' ],
  [ SHORTCUTS.refresh ]: [ 'ctrl+r' ],
  [ SHORTCUTS.newController ]: [ 'ctrl+x', 'ctrl+shift+x' ],
  [ SHORTCUTS.toggleController ]: [ 'ctrl+h', 'ctrl+shift+h' ],
  [ SHORTCUTS.historyBack ]: [ 'ctrl+left', 'alt+left' ],
  [ SHORTCUTS.historyForward ]: [ 'ctrl+right', 'alt+right' ],
  [ SHORTCUTS.search ]: [ 'ctrl+/', 'ctrl+f' ],
  [ SHORTCUTS.menu ]: [ 'ctrl+p', 'ctrl+,' ],
  [ SHORTCUTS.navigator ]: [ 'ctrl+c' ],
  [ SHORTCUTS.history ]: [ 'ctrl+y' ],
  [ SHORTCUTS.banis ]: [ 'ctrl+b' ],
  [ SHORTCUTS.clearDisplay ]: [ 'esc' ],
}
