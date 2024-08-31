import {
  faBell,
  faClosedCaptioning as farClosedCaptioning,
  faKeyboard,
  faPauseCircle,
  IconDefinition,
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

import { API_URL } from './consts'
import { LANGUAGES } from './data'
import SHORTCUTS from './keyMap'

type CommonOption = {
  name: string,
  icon: IconDefinition,
}

type DropdownOption<T> = CommonOption & {
  type: 'dropdown',
  values: { name: string, value: T }[],
}

type SliderOption = CommonOption & {
  type: 'slider',
  min: number,
  max: number,
  step: number,
}

type ColorPickerOption = CommonOption & {
  type: 'colorPicker',
}

type TextInputOption = CommonOption & {
  type: 'textInput',
}

type ToggleOption = CommonOption & {
  type: 'toggle',
}

type UrlDropdownOption = CommonOption & {
  type: 'urlDropdown',
  values: string[],
  url: string,
}

type Option<T = unknown> = DropdownOption<T>
  | SliderOption
  | ColorPickerOption
  | TextInputOption
  | ToggleOption
  | UrlDropdownOption

type ClientOption<T = unknown> = Option<T> & {
  isProtected?: boolean,
}

type ServerOption<T = unknown> = Option<T>

export const CLIENT_OPTIONS = {
  controllerZoom: { name: 'Controller Zoom', icon: faSearchPlus, type: 'slider', min: 0.1, max: 2.5, step: 0.1 },
  presenterFontSize: { name: 'Font Size', icon: faFont, type: 'slider', min: 3, max: 13, step: 0.1 },
  relativeGurmukhiFontSize: { name: 'Relative Gurmukhi Font Size', icon: faPercentage, type: 'slider', min: 0.5, max: 1.5, step: 0.01 },
  relativeEnglishFontSize: { name: 'Relative Latin Font Size', icon: faPercentage, type: 'slider', min: 0.5, max: 1.5, step: 0.01 },
  relativePunjabiFontSize: { name: 'Relative Punjabi Font Size', icon: faPercentage, type: 'slider', min: 0.5, max: 1.5, step: 0.01 },
  relativeHindiFontSize: { name: 'Relative Hindi Font Size', icon: faPercentage, type: 'slider', min: 0.5, max: 1.5, step: 0.01 },
  relativeUrduFontSize: { name: 'Relative Urdu Font Size', icon: faPercentage, type: 'slider', min: 0.5, max: 1.5, step: 0.01 },
  centerText: { name: 'Center Align', icon: faAlignCenter, type: 'toggle' },
  justifyText: { name: 'Justify Multiple Lines', icon: faAlignJustify, type: 'toggle' },
  inlineTransliteration: { name: 'Inline Transliterations', icon: faCompressAlt, type: 'toggle' },
  inlineColumnGuides: { name: 'Inline Column Guides', icon: faCompressAlt, type: 'toggle' },
  splitOnVishraam: { name: 'Primary Pause Wrap Gurbani', icon: faParagraph, type: 'toggle' },
  spacing: {
    name: 'Current Line Spacing',
    type: 'dropdown',
    icon: faTextHeight,
    values: [
      { name: 'Space Between', value: 'space-between' },
      { name: 'Space Around', value: 'space-around' },
      { name: 'Space Evenly', value: 'space-evenly' },
      { name: 'Top', value: 'flex-start' },
      { name: 'Middle', value: 'center' },
      { name: 'Bottom', value: 'flex-end' },
    ],
  },
  previousLines: { name: 'Previous Lines', icon: faAlignJustify, type: 'slider', min: 0, max: 5, step: 1 },
  nextLines: { name: 'Next Lines', icon: faAlignJustify, type: 'slider', min: 0, max: 5, step: 1 },
  larivaarGurbani: { name: 'Larivaar', icon: faTextWidth, type: 'toggle' },
  larivaarAssist: { name: 'Larivaar Assist', icon: faMarker, type: 'toggle' },
  syllabicWeights: { name: 'Syllabic Weights', icon: faBalanceScale, type: 'toggle' },
  syllableCount: { name: 'Syllable Count', icon: faCalculator, type: 'toggle' },
  englishTranslation: { name: 'English Translation', icon: faClosedCaptioning, type: 'toggle' },
  spanishTranslation: { name: 'Spanish Translation', icon: faClosedCaptioning, type: 'toggle' },
  punjabiTranslation: { name: 'Punjabi Translation', icon: faClosedCaptioning, type: 'toggle' },
  englishTransliteration: { name: 'English Transliteration', icon: farClosedCaptioning, type: 'toggle' },
  hindiTransliteration: { name: 'Hindi Transliteration', icon: farClosedCaptioning, type: 'toggle' },
  urduTransliteration: { name: 'Urdu Transliteration', icon: farClosedCaptioning, type: 'toggle' },
  lineEnding: { name: 'Hide Line Ending', icon: faRemoveFormat, type: 'toggle' },
  themeName: { name: 'Theme Name', icon: faPalette, type: 'urlDropdown', values: [], url: `${API_URL}/themes/presenter` },
  simpleGraphics: { name: 'Remove Visual Effects', icon: faLowVision, type: 'toggle' },
  backgroundImage: { name: 'Background Image', icon: faImage, type: 'toggle' },
  highlightCurrentLine: { name: 'Current Line Background', icon: faFillDrip, type: 'toggle' },
  dimNextAndPrevLines: { name: 'Next and Previous Lines Background', icon: faFillDrip, type: 'toggle' },
  vishraamHeavy: { name: 'Primary Pause', icon: faPauseCircle, type: 'toggle' },
  vishraamMedium: { name: 'Secondary Pause', icon: faPauseCircle, type: 'toggle' },
  vishraamLight: { name: 'Tertiary Pause', icon: faPauseCircle, type: 'toggle' },
  vishraamCharacters: { name: 'Show Symbols', icon: faSubscript, type: 'toggle' },
  vishraamColors: { name: 'Show Colors', icon: faFill, type: 'toggle' },
  displayAnalytics: { name: 'Display Usage Analytics', icon: faChartPie, type: 'toggle' },
  private: { name: 'Private Settings', icon: faLock, type: 'toggle', isProtected: true },
  showResultCitations: { name: 'Show Citations', icon: faTags, type: 'toggle' },
  resultTranslationLanguage: {
    name: 'Translation',
    icon: faClosedCaptioning,
    type: 'dropdown',
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
    type: 'dropdown',
    values: [
      { name: 'None', value: false },
      { name: 'English', value: LANGUAGES.english },
      { name: 'Hindi', value: LANGUAGES.hindi },
      { name: 'Urdu', value: LANGUAGES.urdu },
    ],
  },
  overlayName: { name: 'Overlay Name', icon: faPalette, type: 'urlDropdown', values: [], url: `${API_URL}/themes/overlay` },
} satisfies Record<string, ClientOption>

export const SERVER_OPTIONS = {
  connectionEvents: { name: 'Connections', icon: faPlug, type: 'toggle' },
  disconnectionEvents: { name: 'Disconnections', icon: faPowerOff, type: 'toggle' },
  downloadEvents: { name: 'Update Download', icon: faDownload, type: 'toggle' },
  downloadedEvents: { name: 'Update Download Complete', icon: faServer, type: 'toggle' },
  launchOnStartup: { name: 'Launch On Startup', icon: faDoorOpen, type: 'toggle' },
  multipleDisplays: { name: 'Launch on All Displays', icon: faDesktop, type: 'toggle' },
  fullscreenOnLaunch: { name: 'Launch In Fullscreen', icon: faExpandArrowsAlt, type: 'toggle' },
  serverAnalytics: { name: 'Server Usage Analytics', icon: faChartPie, type: 'toggle' },
  automaticUpdates: { name: 'Automatic Updates', icon: faSync, type: 'toggle' },
  betaOptIn: { name: 'Beta Updates', icon: faFlask, type: 'toggle' },
  zoomApiToken: { name: 'Zoom API Token', icon: faShareSquare, type: 'textInput' },
} satisfies Record<string, ServerOption>

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
      isProtected: true,
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
      spacing: CLIENT_OPTIONS.spacing.values[ 2 ].value,
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
      resultTranslationLanguage: CLIENT_OPTIONS.resultTranslationLanguage.values[ 0 ].value,
      resultTransliterationLanguage: CLIENT_OPTIONS.resultTransliterationLanguage.values[ 0 ].value,
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

export type ClientSettings = typeof CLIENT_OPTIONS
export type ServerSettings = typeof SERVER_OPTIONS

export type SettingsState = Record<string, ClientSettings> & { global: ServerSettings }
