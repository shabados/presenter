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
export const CONNECT_TO_URL = `${CONTROLLER_URL}/connect-to`
export const HISTORY_URL = `${CONTROLLER_URL}/history`
export const HISTORY_DOWNLOAD_URL = `${BACKEND_URL}/history.csv`
export const THEME_URL = `${BACKEND_URL}/themes`

export const CONFIGURATOR_URL = '/configurator'
export const CONFIGURATOR_SETTINGS_URL = `${CONFIGURATOR_URL}/settings`
export const CONFIGURATOR_TOOLS_URL = `${CONFIGURATOR_URL}/tools`

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
  devices: 'Devices',
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
  [ SHORTCUTS.devices ]: [ 'ctrl+d' ],
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
    privacy: PRIVACY_TYPES.local,
    values: [
      { name: 'Space Around', value: '' },
      { name: 'Unspaced', value: '' },
      { name: 'Space Between', value: '' },
    ],
  },
  controllerHeight: {
    name: 'Controller Height',
    type: OPTION_TYPES.dropdown,
    privacy: PRIVACY_TYPES.local,
    values: [
      { name: 'Short', value: '450px' },
      { name: 'Medium', value: '450px' },
      { name: 'Tall', value: '450px' },
    ],
  },
  larivaarGurbani: { name: 'Larivaar Gurbani', type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  splitGurbani: { name: 'Split Gurbani Lines', type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  englishTranslation: { name: 'English Translation', type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  punjabiTranslation: { name: 'Punjabi Translation', type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  englishTransliteration: { name: 'English Transliteration', type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  nextLine: { name: 'Next Line', type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  fontSize: { name: 'Font Size', type: OPTION_TYPES.slider, range: [ 20, 100 ], privacy: PRIVACY_TYPES.local },
  themeName: { name: 'Theme Name', type: OPTION_TYPES.dropdown, values: [ 'Day', 'Night' ], privacy: PRIVACY_TYPES.local },
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

// Options with default values
export const DEFAULT_OPTIONS = {
  local: {
    layout: {
      name: 'Layout',
      icon: faArrowsAltH,
      options: {
        spacing: OPTIONS.spacing.values[ 0 ],
        controllerHeight: OPTIONS.controllerHeight.values[ 0 ],
        larivaarGurbani: false,
        splitGurbani: true,
        englishTranslation: true,
        punjabiTranslation: false,
        englishTransliteration: true,
        nextLine: false,
      },
    },
    theme: {
      name: 'Theme',
      icon: faPaintBrush,
      options: {
        themeName: OPTIONS.themeName.values[ 0 ],
        backgroundImage: true,
        fontSize: 40,
      },
    },
    vishraams: {
      name: 'Vishraams/Pauses',
      icon: faEllipsisH,
      options: {
        vishraamColors: true,
        vishraamCharacters: false,
        vishraamLight: true,
        vishraamMedium: true,
        vishraamHeavy: true,
      },
    },
    navigation: {
      name: 'Navigation',
      icon: faKeyboard,
      options: {
        autoNextShabad: false,
      },
    },
    security: {
      name: 'Security',
      icon: faShieldAlt,
      options: {
        private: false,
      },
    },
  },
  // Special serverside settings
  // ! Must be in sync with settings.default.json
  global: {
    privacy: {
      name: 'Privacy',
      icon: faEye,
      options: {
        analytics: true,
      },
    },
    system: {
      name: 'System Options',
      icon: faWrench,
      options: {
        launchOnStartup: false,
      },
    },
  },
}
