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
export const THEME_URL = `${BACKEND_URL}/themes`

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
export const SEARCH_CHARS = {
  wildcard: '_',
  wordAnywhere: '#',
  wordOrder: '^',
  larivaarAccentless: '%',
}

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

// Shortcut Keys
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


/* Options */
// Unique symbols for each option type
export const OPTION_TYPES = {
  dropdown: Symbol( 'Dropdown' ),
  toggle: Symbol( 'Toggle' ),
  slider: Symbol( 'Slider' ),
  radio: Symbol( 'Radio' ),
  colorPicker: Symbol( 'Color Picker' ),
}

// Categories that can appear in the menu
export const OPTION_CATEGORIES = {
  layout: 'Layout',
  theme: 'Theme',
  experimental: 'Experimental',
}

// Possible options
export const OPTIONS = {
  spacing: 'Spacing',
  controllerHeight: 'Controller Height',
  larivaarGurbani: 'Larivaar Gurbani',
  splitGurbani: 'Split Gurbani Lines',
  englishTranslation: 'English Translation',
  punjabiTranslation: 'Punjabi Translation',
  englishTransliteration: 'English Transliteration',
  nextLine: 'Next Line',
  fontSize: 'Font Size',
  themeName: 'Theme Name',
  backgroundImage: 'Background Image',
  vishraamColors: 'Vishraam Colors',
  vishraamCharacters: 'Vishraam Characters',
  vishraamLight: 'Vishraam Light',
  vishraamMedium: 'Vishraam Medium',
  vishraamHeavy: 'Vishraam Heavy',
}

// Groupings of options
export const OPTIONS_GROUPS = {
  [ OPTION_CATEGORIES.experimental ]: {
    [ OPTIONS.spacing ]: {
      type: OPTION_TYPES.dropdown,
      options: [
        { name: 'Space Around', value: '' },
        { name: 'Normal', value: '' },
        { name: 'Space Between', value: '' },
        { name: 'Space Evenly', value: '' },
      ],
    },
    [ OPTIONS.controllerHeight ]: {
      type: OPTION_TYPES.dropdown,
      options: [
        { name: 'Short', value: '450px' },
        { name: 'Medium', value: '450px' },
        { name: 'Tall', value: '450px' },
      ],
    },
    larivaarGurbani: { type: OPTION_TYPES.toggle },
    splitGurbani: { type: OPTION_TYPES.toggle },
    englishTranslation: { type: OPTION_TYPES.toggle },
    punjabiTranslation: { type: OPTION_TYPES.toggle },
    englishTransliteration: { type: OPTION_TYPES.toggle },
    fontSize: { type: OPTION_TYPES.slider, range: [ 10, 50 ] },
  },
}
