import {
  faBell,
  faClosedCaptioning as farClosedCaptioning,
  faKeyboard,
  faPauseCircle,
} from '@fortawesome/free-regular-svg-icons'
import {
  faAlignCenter,
  faAlignJustify,
  faArrowsAltH,
  faBalanceScale,
  faBook,
  faCalculator,
  faChartPie,
  faClosedCaptioning,
  faCompressAlt,
  faDesktop,
  faDoorOpen,
  faDownload,
  faEllipsisH,
  faExpandArrowsAlt,
  faFill,
  faFillDrip,
  faFlask,
  faFont,
  faHeadphones,
  faImage,
  faInfo,
  faList,
  faLock,
  faLowVision,
  faMarker,
  faPaintBrush,
  faPalette,
  faParagraph,
  faPercentage,
  faPlug,
  faPowerOff,
  faRemoveFormat,
  faSearch,
  faSearchPlus,
  faServer,
  faShareSquare,
  faShieldAlt,
  faSubscript,
  faSync,
  faTags,
  faTextHeight,
  faTextWidth,
  faWindowMaximize,
  faWrench,
} from '@fortawesome/free-solid-svg-icons'
import type { RecommendedSources } from '@presenter/contract'

import { BACKEND_URL } from './consts'
import { LANGUAGES } from './data'
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
  urlDropdown: Symbol( 'URL Dropdown' ),
  textInput: Symbol( 'Text Input' ),
}

export const PRIVACY_TYPES = {
  local: Symbol( 'Local' ),
  private: Symbol( 'Private Locally' ),
  global: Symbol( 'Server Global' ),
}

// Option names and possible values
export const OPTIONS = {
  controllerZoom: { name: 'Controller Zoom', icon: faSearchPlus, type: OPTION_TYPES.slider, min: 0.1, max: 2.5, step: 0.1, privacy: PRIVACY_TYPES.local },
  presenterFontSize: { name: 'Font Size', icon: faFont, type: OPTION_TYPES.slider, min: 3, max: 13, step: 0.1, privacy: PRIVACY_TYPES.local },
  relativeGurmukhiFontSize: { name: 'Relative Gurmukhi Font Size', icon: faPercentage, type: OPTION_TYPES.slider, min: 0.5, max: 1.5, step: 0.01, privacy: PRIVACY_TYPES.local },
  relativeEnglishFontSize: { name: 'Relative Latin Font Size', icon: faPercentage, type: OPTION_TYPES.slider, min: 0.5, max: 1.5, step: 0.01, privacy: PRIVACY_TYPES.local },
  relativePunjabiFontSize: { name: 'Relative Punjabi Font Size', icon: faPercentage, type: OPTION_TYPES.slider, min: 0.5, max: 1.5, step: 0.01, privacy: PRIVACY_TYPES.local },
  relativeHindiFontSize: { name: 'Relative Hindi Font Size', icon: faPercentage, type: OPTION_TYPES.slider, min: 0.5, max: 1.5, step: 0.01, privacy: PRIVACY_TYPES.local },
  relativeUrduFontSize: { name: 'Relative Urdu Font Size', icon: faPercentage, type: OPTION_TYPES.slider, min: 0.5, max: 1.5, step: 0.01, privacy: PRIVACY_TYPES.local },
  centerText: { name: 'Center Align', icon: faAlignCenter, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  justifyText: { name: 'Justify Multiple Lines', icon: faAlignJustify, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  inlineTransliteration: { name: 'Inline Transliterations', icon: faCompressAlt, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  inlineColumnGuides: { name: 'Inline Column Guides', icon: faCompressAlt, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
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
  larivaarGurbani: { name: 'Larivaar', icon: faTextWidth, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  larivaarAssist: { name: 'Larivaar Assist', icon: faMarker, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  syllabicWeights: { name: 'Syllabic Weights', icon: faBalanceScale, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  syllableCount: { name: 'Syllable Count', icon: faCalculator, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  englishTranslation: { name: 'English Translation', icon: faClosedCaptioning, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  spanishTranslation: { name: 'Spanish Translation', icon: faClosedCaptioning, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  punjabiTranslation: { name: 'Punjabi Translation', icon: faClosedCaptioning, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  englishTransliteration: { name: 'English Transliteration', icon: farClosedCaptioning, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  hindiTransliteration: { name: 'Hindi Transliteration', icon: farClosedCaptioning, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  urduTransliteration: { name: 'Urdu Transliteration', icon: farClosedCaptioning, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  lineEnding: { name: 'Hide Line Ending', icon: faRemoveFormat, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  themeName: { name: 'Theme Name', icon: faPalette, type: OPTION_TYPES.dropdown, values: [], privacy: PRIVACY_TYPES.local },
  simpleGraphics: { name: 'Remove Visual Effects', icon: faLowVision, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  backgroundImage: { name: 'Background Image', icon: faImage, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  highlightCurrentLine: { name: 'Current Line Background', icon: faFillDrip, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  dimNextAndPrevLines: { name: 'Next and Previous Lines Background', icon: faFillDrip, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  vishraamHeavy: { name: 'Primary Pause', icon: faPauseCircle, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  vishraamMedium: { name: 'Secondary Pause', icon: faPauseCircle, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  vishraamLight: { name: 'Tertiary Pause', icon: faPauseCircle, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  vishraamCharacters: { name: 'Show Symbols', icon: faSubscript, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  vishraamColors: { name: 'Show Colors', icon: faFill, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  displayAnalytics: { name: 'Display Usage Analytics', icon: faChartPie, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  private: { name: 'Private Settings', icon: faLock, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.private },
  launchOnStartup: { name: 'Launch On Startup', icon: faDoorOpen, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.global },
  multipleDisplays: { name: 'Launch on All Displays', icon: faDesktop, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.global },
  fullscreenOnLaunch: { name: 'Launch In Fullscreen', icon: faExpandArrowsAlt, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.global },
  serverAnalytics: { name: 'Server Usage Analytics', icon: faChartPie, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.global },
  automaticUpdates: { name: 'Automatic Updates', icon: faSync, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.global },
  betaOptIn: { name: 'Beta Updates', icon: faFlask, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.global },
  connectionEvents: { name: 'Connections', icon: faPlug, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.global },
  disconnectionEvents: { name: 'Disconnections', icon: faPowerOff, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.global },
  downloadEvents: { name: 'Update Download', icon: faDownload, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.global },
  downloadedEvents: { name: 'Update Download Complete', icon: faServer, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.global },
  showResultCitations: { name: 'Show Citations', icon: faTags, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  resultTranslationLanguage: {
    name: 'Translation',
    icon: faClosedCaptioning,
    type: OPTION_TYPES.dropdown,
    privacy: PRIVACY_TYPES.local,
    values: [
      { name: 'None', value: false },
      { name: 'English', value: LANGUAGES.english },
      { name: 'Spanish', value: LANGUAGES.spanish },
      { name: 'Punjabi', value: LANGUAGES.punjabi },
    ],
  },
  resultTransliterationLanguage: {
    name: 'Transliteration',
    icon: farClosedCaptioning,
    type: OPTION_TYPES.dropdown,
    privacy: PRIVACY_TYPES.local,
    values: [
      { name: 'None', value: false },
      { name: 'English', value: LANGUAGES.english },
      { name: 'Hindi', value: LANGUAGES.hindi },
      { name: 'Urdu', value: LANGUAGES.urdu },
    ],
  },
  overlayName: { name: 'Overlay Name', icon: faPalette, type: OPTION_TYPES.urlDropdown, values: [], url: `${BACKEND_URL}/overlay/themes`, privacy: PRIVACY_TYPES.global },
  zoomApiToken: { name: 'Zoom API Token', icon: faShareSquare, type: OPTION_TYPES.textInput, privacy: PRIVACY_TYPES.global },
}

// Possible options groups
export const OPTION_GROUPS = {
  //* Linked to local -> settings default options
  none: {
    display: {
      name: 'Display',
      icon: faList,
    },
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
      privacy: PRIVACY_TYPES.private,
    },
  },
  activities: {
    search: {
      name: 'Search',
      icon: faSearch,
    },
  },
  //* Linked to global -> settings default options
  server: {
    notifications: {
      name: 'Notifications',
      icon: faBell,
    },
    system: {
      name: 'System Options',
      icon: faWrench,
    },
    about: {
      name: 'About',
      icon: faInfo,
    },
  },
  tools: {
    overlay: {
      name: 'Overlay',
      icon: faWindowMaximize,
    },
    closedCaptions: {
      name: 'Closed Captions',
      icon: faHeadphones,
    },
  },
}

type FlatOptionGroups = {
  display?: {
    name: string,
    icon: typeof faList,
  },
  layout?: {
    name: string,
    icon: typeof faArrowsAltH,
  },
  theme?: {
    name: string,
    icon: typeof faPaintBrush,
  },
  vishraams?: {
    name: string,
    icon: typeof faEllipsisH,
  },
  sources?: {
    name: string,
    icon: typeof faBook,
  },
  hotkeys?: {
    name: string,
    icon: typeof faKeyboard,
  },
  security?: {
    name: string,
    icon: typeof faShieldAlt,
    privacy: symbol,
  },

  search?: {
    name: string,
    icon: typeof faSearch,
  },

  notifications?: {
    name: string,
    icon: typeof faBell,
  },
  system?: {
    name: string,
    icon: typeof faWrench,
  },
  about?: {
    name: string,
    icon: typeof faInfo,
  },

  overlay?: {
    name: string,
    icon: typeof faWindowMaximize,
  },
  closedCaptions?: {
    name: string,
    icon: typeof faHeadphones,
  },
}

export const FLAT_OPTION_GROUPS = Object
  .values( OPTION_GROUPS )
  .reduce( ( groups, section ) => ( { ...groups, ...section } ), {} as FlatOptionGroups )

// Options with default values
export const DEFAULT_OPTIONS = {
  local: {
    display: {
      previousLines: 0,
      nextLines: 1,
      larivaarGurbani: false,
      larivaarAssist: false,
      syllabicWeights: false,
      syllableCount: false,
      englishTranslation: true,
      spanishTranslation: false,
      punjabiTranslation: false,
      englishTransliteration: true,
      hindiTransliteration: false,
      urduTransliteration: false,
      lineEnding: true,
    },
    layout: {
      controllerZoom: 1,
      presenterFontSize: 8,
      relativeGurmukhiFontSize: 1,
      relativeEnglishFontSize: 0.6,
      relativePunjabiFontSize: 0.7,
      relativeHindiFontSize: 0.71,
      relativeUrduFontSize: 0.5,
      centerText: true,
      justifyText: false,
      inlineTransliteration: false,
      inlineColumnGuides: false,
      splitOnVishraam: true,
      spacing: OPTIONS.spacing.values[ 2 ].value,
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
      vishraamColors: true,
      vishraamCharacters: false,
    },
    sources: {} as RecommendedSources['sources'],
    hotkeys: Object.values( SHORTCUTS ).reduce( ( hotkeys, { name, sequences } ) => ( {
      ...hotkeys,
      [ name ]: sequences,
    } ), {} ),
    security: {
      displayAnalytics: true,
      private: false,
    },
    search: {
      resultTranslationLanguage: OPTIONS.resultTranslationLanguage.values[ 0 ].value,
      resultTransliterationLanguage: OPTIONS.resultTransliterationLanguage.values[ 0 ].value,
      showResultCitations: false,
      lineEnding: true,
    },
  },
  // Special serverside settings
  // ! Must be in sync with settings.default.json
  global: {
    system: {
      //! Currently not implemented
      // launchOnStartup: false,
      multipleDisplays: true,
      fullscreenOnLaunch: false,
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
    overlay: {
      overlayName: 'Floating Top Captions',
      larivaarGurbani: false,
      larivaarAssist: false,
      englishTranslation: true,
      spanishTranslation: false,
      punjabiTranslation: false,
      englishTransliteration: false,
      hindiTransliteration: false,
      urduTransliteration: false,
      lineEnding: true,
    },
    closedCaptions: {
      zoomApiToken: null,
      larivaarGurbani: false,
      englishTranslation: true,
      spanishTranslation: false,
      punjabiTranslation: false,
      englishTransliteration: false,
      hindiTransliteration: false,
      urduTransliteration: false,
      lineEnding: true,
    },
  },
}

export type ClientSettings = typeof DEFAULT_OPTIONS.local
export type GlobalSettings = typeof DEFAULT_OPTIONS.global

export type SettingsState = { [host: string]: ClientSettings } & { global: GlobalSettings }
