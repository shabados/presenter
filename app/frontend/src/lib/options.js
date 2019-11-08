import {
  faPaintBrush,
  faShieldAlt,
  faEllipsisH,
  faArrowsAltH,
  faWrench,
  faBook,
  faAlignCenter,
  faMarker,
  faParagraph,
  faTextWidth,
  faClosedCaptioning,
  faAlignJustify,
  faFont,
  faSubscript,
  faPercentage,
  faPalette,
  faImage,
  faLowVision,
  faFill,
  faFillDrip,
  faChartPie,
  faDoorOpen,
  faLock,
  faFlask,
  faPlug,
  faServer,
  faDownload,
  faPowerOff,
  faTextHeight,
  faSync,
  faList,
} from '@fortawesome/free-solid-svg-icons'
import {
  faKeyboard,
  faClosedCaptioning as farClosedCaptioning,
  faBell,
  faPauseCircle,
} from '@fortawesome/free-regular-svg-icons'

import SHORTCUTS from './keyMap'

/**
 * Options for settings.
 */


// Unique symbols for each option type
export const OPTION_TYPES = {
  dropdown: Symbol( 'Dropdown' ),
  toggle: Symbol( 'Toggle' ),
  slider: Symbol( 'Slider' ),
  colorPicker: Symbol( 'Color Picker' ),
}

export const PRIVACY_TYPES = {
  local: Symbol( 'Local' ),
  private: Symbol( 'Private Locally' ),
  global: Symbol( 'Server Global' ),
}

// Option names and possible values
export const OPTIONS = {
  presenterFontSize: { name: 'Font Size', icon: faFont, type: OPTION_TYPES.slider, min: 3, max: 13, step: 0.1, privacy: PRIVACY_TYPES.local },
  relativeGurmukhiFontSize: { name: 'Relative Gurmukhi Font Size', icon: faPercentage, type: OPTION_TYPES.slider, min: 0.5, max: 1.5, step: 0.01, privacy: PRIVACY_TYPES.local },
  relativeEnglishFontSize: { name: 'Relative Latin Font Size', icon: faPercentage, type: OPTION_TYPES.slider, min: 0.5, max: 1.5, step: 0.01, privacy: PRIVACY_TYPES.local },
  relativePunjabiFontSize: { name: 'Relative Punjabi Font Size', icon: faPercentage, type: OPTION_TYPES.slider, min: 0.5, max: 1.5, step: 0.01, privacy: PRIVACY_TYPES.local },
  relativeHindiFontSize: { name: 'Relative Hindi Font Size', icon: faPercentage, type: OPTION_TYPES.slider, min: 0.5, max: 1.5, step: 0.01, privacy: PRIVACY_TYPES.local },
  relativeUrduFontSize: { name: 'Relative Urdu Font Size', icon: faPercentage, type: OPTION_TYPES.slider, min: 0.5, max: 1.5, step: 0.01, privacy: PRIVACY_TYPES.local },
  centerText: { name: 'Center Align', icon: faAlignCenter, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  justifyText: { name: 'Justify Multiple Lines', icon: faAlignJustify, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  splitOnVishraam: { name: 'Primary Pause Wrap Gurbani', icon: faParagraph, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  spacing: {
    name: 'Current Line Spacing',
    type: OPTION_TYPES.dropdown,
    icon: faTextHeight,
    privacy: PRIVACY_TYPES.local,
    values: [
      { name: 'Space Between', value: 'space-between' },
      { name: 'Space Around', value: 'space-around' },
      { name: 'Space Evenly', value: 'space-evenly' },
      { name: 'Top', value: 'flex-start' },
      { name: 'Middle', value: 'center' },
      { name: 'Bottom', value: 'flex-end' },
    ],
  },
  previousLines: { name: 'Previous Lines', icon: faAlignJustify, type: OPTION_TYPES.slider, max: 5, step: 1, privacy: PRIVACY_TYPES.local },
  nextLines: { name: 'Next Lines', icon: faAlignJustify, type: OPTION_TYPES.slider, max: 5, step: 1, privacy: PRIVACY_TYPES.local },
  larivaarGurbani: { name: 'Larivaar Gurbani', icon: faTextWidth, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  larivaarAssist: { name: 'Larivaar Assist', icon: faMarker, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  englishTranslation: { name: 'English Translation', icon: faClosedCaptioning, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  spanishTranslation: { name: 'Spanish Translation', icon: faClosedCaptioning, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  punjabiTranslation: { name: 'Punjabi Translation', icon: faClosedCaptioning, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  englishTransliteration: { name: 'English Transliteration', icon: farClosedCaptioning, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  hindiTransliteration: { name: 'Hindi Transliteration', icon: farClosedCaptioning, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  urduTransliteration: { name: 'Urdu Transliteration', icon: farClosedCaptioning, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  themeName: { name: 'Theme Name', icon: faPalette, type: OPTION_TYPES.dropdown, values: [], privacy: PRIVACY_TYPES.local },
  simpleGraphics: { name: 'Remove Visual Effects', icon: faLowVision, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  backgroundImage: { name: 'Background Image', icon: faImage, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  highlightCurrentLine: { name: 'Current Line Background', icon: faFillDrip, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  dimNextAndPrevLines: { name: 'Next and Previous Lines Background', icon: faFillDrip, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  vishraamHeavy: { name: 'Primary Pause', icon: faPauseCircle, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  vishraamMedium: { name: 'Secondary Pause', icon: faPauseCircle, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  vishraamLight: { name: 'Tertiary Pause', icon: faPauseCircle, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  vishraamCharacters: { name: 'Show Symbols', icon: faSubscript, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  vishraamColors: { name: 'Gurmukhi Colors', icon: faFill, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  vishraamTransliterationColors: { name: 'Transliteration Colors', icon: faFill, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  displayAnalytics: { name: 'Display Usage Analytics', icon: faChartPie, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  private: { name: 'Private Settings', icon: faLock, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.private },
  launchOnStartup: { name: 'Launch On Startup', icon: faDoorOpen, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.global },
  serverAnalytics: { name: 'Server Usage Analytics', icon: faChartPie, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.global },
  automaticUpdates: { name: 'Automatic Updates', icon: faSync, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.global },
  betaOptIn: { name: 'Beta Updates', icon: faFlask, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.global },
  connectionEvents: { name: 'Connections', icon: faPlug, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.global },
  disconnectionEvents: { name: 'Disconnections', icon: faPowerOff, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.global },
  downloadEvents: { name: 'Update Download', icon: faDownload, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.global },
  downloadedEvents: { name: 'Update Download Complete', icon: faServer, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.global },
}

// Possible options groups
export const OPTION_GROUPS = {
  layout: {
    name: 'Layout',
    icon: faArrowsAltH,
  },
  display: {
    name: 'Display',
    icon: faList,
  },
  theme: {
    name: 'Theme',
    icon: faPaintBrush,
  },
  vishraams: {
    name: 'Vishraams',
    icon: faEllipsisH,
  },
  sources: {
    name: 'Sources',
    icon: faBook,
  },
  hotkeys: {
    name: 'Hotkeys',
    icon: faKeyboard,
  },
  security: {
    name: 'Security',
    icon: faShieldAlt,
  },
  notifications: {
    name: 'Notifications',
    icon: faBell,
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
      presenterFontSize: 8,
      relativeGurmukhiFontSize: 1,
      relativeEnglishFontSize: 0.6,
      relativePunjabiFontSize: 0.7,
      relativeHindiFontSize: 0.71,
      relativeUrduFontSize: 0.5,
      centerText: true,
      justifyText: false,
      splitOnVishraam: true,
      spacing: OPTIONS.spacing.values[ 2 ].value,
    },
    display: {
      previousLines: 0,
      nextLines: 1,
      larivaarGurbani: false,
      larivaarAssist: false,
      englishTranslation: true,
      spanishTranslation: false,
      punjabiTranslation: false,
      englishTransliteration: true,
      hindiTransliteration: false,
      urduTransliteration: false,
    },
    theme: {
      themeName: 'Day',
      simpleGraphics: false,
      backgroundImage: true,
      highlightCurrentLine: false,
      dimNextAndPrevLines: true,
    },
    vishraams: {
      vishraamHeavy: true,
      vishraamMedium: true,
      vishraamLight: true,
      vishraamCharacters: false,
      vishraamColors: true,
      vishraamTransliterationColors: true,
    },
    sources: {},
    hotkeys: Object.values( SHORTCUTS ).reduce( ( hotkeys, { name, sequences } ) => ( {
      ...hotkeys,
      [ name ]: sequences,
    } ), {} ),
    security: {
      displayAnalytics: true,
      private: true,
    },
  },
  // Special serverside settings
  // ! Must be in sync with settings.default.json
  global: {
    system: {
      launchOnStartup: false,
      serverAnalytics: true,
      automaticUpdates: true,
      betaOptIn: false,
    },
    notifications: {
      connectionEvents: true,
      disconnectionEvents: false,
      downloadEvents: true,
      downloadedEvents: true,
    },
  },
}
