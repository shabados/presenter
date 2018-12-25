import { faPaintBrush, faShieldAlt, faEllipsisH, faArrowsAltH, faEye, faWrench } from '@fortawesome/fontawesome-free-solid'
import { faKeyboard } from '@fortawesome/fontawesome-free-regular'

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
export const HISTORY_URL = `${CONTROLLER_URL}/history`
export const HISTORY_DOWNLOAD_URL = `${BACKEND_URL}/history.csv`
export const THEME_URL = `${BACKEND_URL}/themes`

export const CONFIGURATOR_URL = '/configurator'
export const CONFIGURATOR_SETTINGS_URL = `${CONFIGURATOR_URL}/settings`
export const CONFIGURATOR_SERVER_SETTINGS_URL = `${CONFIGURATOR_SETTINGS_URL}/server`

export const CONFIGURATOR_TOOLS_URL = `${CONFIGURATOR_URL}/tools`
export const CONFIGURATOR_OVERLAY_URL = `${CONFIGURATOR_TOOLS_URL}/overlay`

export const OVERLAY_URL = '/overlay'
export const SCREEN_READER_URL = '/screenreader'

// URL states
export const STATES = {
  controllerOnly: 'controllerOnly', // Fullscreen controller
  showShortcuts: 'showShortcuts', // Shortcut help pane
}

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

export const PRIVACY_TYPES = {
  local: Symbol( 'Local' ),
  private: Symbol( 'Private Locally' ),
  global: Symbol( 'Server Global' ),
}

// Option names and possible values
export const OPTIONS = {
  spacing: {
    name: 'Spacing',
    type: OPTION_TYPES.dropdown,
    icon: faArrowsAltH,
    privacy: PRIVACY_TYPES.local,
    values: [
      { name: 'Space Around', value: 'space-around' },
      { name: 'Space Evenly', value: 'space-evenly' },
      { name: 'Space Between', value: 'space-between' },
      { name: 'Top', value: 'flex-start' },
      { name: 'Middle', value: 'center' },
      { name: 'Bottom', value: 'flex-end' },
    ],
  },
  larivaarGurbani: { name: 'Larivaar Gurbani', type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  splitGurbani: { name: 'Split Gurbani Lines', type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  englishTranslation: { name: 'English Translation', type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  punjabiTranslation: { name: 'Punjabi Translation', type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  englishTransliteration: { name: 'English Transliteration', type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  nextLine: { name: 'Next Line', type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  fontSize: { name: 'Font Size', type: OPTION_TYPES.slider, range: [ 20, 100 ], privacy: PRIVACY_TYPES.local },
  themeName: { name: 'Theme Name', type: OPTION_TYPES.dropdown, values: [ ], privacy: PRIVACY_TYPES.local },
  backgroundImage: { name: 'Background Image', type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  vishraamColors: { name: 'Vishraam Colors', type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  vishraamCharacters: { name: 'Vishraam Characters', type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  vishraamLight: { name: 'Vishraam Light', type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  vishraamMedium: { name: 'Vishraam Medium', type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  vishraamHeavy: { name: 'Vishraam Heavy', type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  autoNextShabad: { name: 'Automatic Next Shabad', type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  analytics: { name: 'Usage Analytics', type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.global },
  launchOnStartup: { name: 'Launch On Startup', type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.global },
  private: { name: 'Private Settings', type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.private },
}

// Possible options groups
export const OPTION_GROUPS = {
  layout: {
    name: 'Layout',
    icon: faArrowsAltH,
  },
  theme: {
    name: 'Theme',
    icon: faPaintBrush,
  },
  vishraams: {
    name: 'Vishraams',
    icon: faEllipsisH,
  },
  navigation: {
    name: 'Navigation',
    icon: faKeyboard,
  },
  security: {
    name: 'Security',
    icon: faShieldAlt,
  },
  privacy: {
    name: 'Privacy',
    icon: faEye,
  },
  system: {
    name: 'System Options',
    icon: faWrench,
  },
}

// Options with default values
export const DEFAULT_OPTIONS = {
  local: {
    layout: {
      spacing: OPTIONS.spacing.values[ 0 ],
      larivaarGurbani: false,
      splitGurbani: true,
      englishTranslation: true,
      punjabiTranslation: false,
      englishTransliteration: true,
      nextLine: false,
    },
    theme: {
      themeName: OPTIONS.themeName.values[ 0 ],
      backgroundImage: true,
      fontSize: 40,
    },
    vishraams: {
      vishraamColors: true,
      vishraamCharacters: false,
      vishraamLight: true,
      vishraamMedium: true,
      vishraamHeavy: true,
    },
    navigation: {
      autoNextShabad: false,
    },
    security: {
      private: false,
    },
  },
  // Special serverside settings
  // ! Must be in sync with settings.default.json
  global: {
    privacy: {
      analytics: true,
    },
    system: {
      launchOnStartup: false,
    },
  },
}
