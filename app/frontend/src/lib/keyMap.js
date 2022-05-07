/* Default keymap for hotkeys */

/**
 * Adds a group to a given keymap.
 * @param {*} keymap The keymap to decorate.
 */
const decorateGroup = ( keymap ) => ( group ) => Object
  .entries( keymap )
  .reduce( ( obj, [ name, content ] ) => ( {
    ...obj,
    [ name ]: { group, ...content },
  } ), {} )

// Jump to navigation line ordered hot keys
export const LINE_HOTKEYS = Array.from( '1234567890qwertyuiopasdfg' )

// Keys that are not assignable anywhere
export const RESTRICTED_STROKES = [
  'ctrl+a',
  'ctrl+r',
]

// Global hotkeys
export const GLOBAL_SHORTCUTS = decorateGroup( {
  toggleFullscreen: {
    name: 'Toggle Fullscreen',
    sequences: [ 'ctrl+f' ],
    required: true,
  },
  toggleFullscreenController: {
    name: 'Toggle Fullscreen Controller',
    sequences: [ 'ctrl+shift+f' ],
    required: true,
  },
  newController: {
    name: 'New Controller',
    description: 'Opens a new, popped out controller window',
    sequences: [ 'ctrl+x', 'ctrl+shift+x' ],
  },
  toggleController: {
    name: 'Toggle Controller',
    sequences: [ 'ctrl+h', 'ctrl+shift+h' ],
    required: true,
  },
  zoomInController: {
    name: 'Zoom Controller In',
    sequences: [ 'ctrl++', 'ctrl+shift+=' ],
    required: true,
  },
  zoomOutController: {
    name: 'Zoom Controller Out',
    sequences: [ 'ctrl+-' ],
    required: true,
  },
  zoomResetController: {
    name: 'Reset Controller Zoom',
    sequences: [ 'ctrl+0' ],
    required: true,
  },
  search: {
    name: 'Search',
    sequences: [ 'ctrl+/' ],
    required: true,
  },
  settings: {
    name: 'Settings',
    sequences: [ 'ctrl+,', 'ctrl+p' ],
    required: true,
  },
  navigator: {
    name: 'Navigator',
    sequences: [ 'ctrl+g' ],
    required: true,
  },
  history: {
    name: 'History',
    sequences: [ 'ctrl+y' ],
    required: true,
  },
  bookmarks: {
    name: 'Bookmarks',
    sequences: [ 'ctrl+b' ],
    required: true,
  },
  clearDisplay: {
    name: 'Clear Display',
    sequences: [ 'esc', 'ctrl+shift+b' ],
    required: true,
  },
  quit: {
    name: 'Quit',
    sequences: [ 'ctrl+q' ],
    required: true,
  },
} )( 'Global' )

export const COPY_SHORTCUTS = decorateGroup( {
  copyAllLinesUnicode: {
    name: 'Copy All Lines (Unicode)',
    sequences: [ 'ctrl+c a' ],
  },
  copyAllLinesAscii: {
    name: 'Copy All Lines (ASCII)',
    sequences: [ 'ctrl+c shift+a' ],
  },
  copyCitation: {
    name: 'Copy Citation',
    sequences: [ 'ctrl+c c' ],
  },
  copyGurmukhiUnicode: {
    name: 'Copy Gurmukhi (Unicode)',
    sequences: [ 'ctrl+c g' ],
  },
  copyGurmukhiAscii: {
    name: 'Copy Gurmukhi (ASCII)',
    sequences: [ 'ctrl+c shift+g' ],
  },
  copyEnglishTranslation: {
    name: 'Copy English Translation',
    sequences: [ 'ctrl+c e' ],
  },
  copyPunjabiTranslation: {
    name: 'Copy Punjabi Translation',
    sequences: [ 'ctrl+c p' ],
  },
  copySpanishTranslation: {
    name: 'Copy Spanish Translation',
    sequences: [ 'ctrl+c s' ],
  },
  copyEnglishTransliteration: {
    name: 'Copy English Transliteration',
    sequences: [ 'ctrl+c shift+e' ],
  },
  copyHindiTransliteration: {
    name: 'Copy Hindi Transliteration',
    sequences: [ 'ctrl+c shift+h' ],
  },
  copyUrduTransliteration: {
    name: 'Copy Urdu Transliteration',
    sequences: [ 'ctrl+c shift+u' ],
  },
} )( 'Copying' )

// Navigator-specific hotkeys
export const NAVIGATOR_SHORTCUTS = decorateGroup( {
  restoreLine: {
    name: 'Activate Line',
    description: 'Activates the line prior to a cleared screen',
    sequences: [ 'enter', 'return' ],
    required: true,
  },
  nextLine: {
    name: 'Next Line',
    sequences: [ 'down', 'right', 'tab', 'PageDown', 'l' ],
    required: true,
  },
  previousLine: {
    name: 'Previous Line',
    sequences: [ 'up', 'left', 'shift+tab', 'PageUp', 'j' ],
    required: true,
  },
  firstLine: {
    name: 'First Line',
    description: 'Go to first line. If on first line, then go to last line of previous entry.',
    sequences: [ 'ctrl+up', 'home' ],
  },
  lastLine: {
    name: 'Last Line',
    description: 'Go to last line. If on last line, then go to first line of next entry.',
    sequences: [ 'ctrl+down', 'end' ],
  },
  autoToggle: {
    name: 'Autoselect Line',
    description: 'Go to main line or next jump line.',
    sequences: [ 'space', 'b' ],
    required: true,
  },
  setMainLine: {
    name: 'Reset Main Line',
    sequences: [ 'ctrl+space' ],
  },
  goMainLine: {
    description: 'Go to main line without changing position of next jump line.',
    name: 'Skip to Main Line',
    sequences: [ 'shift+,' ],
    required: true,
  },
  goJumpLine: {
    name: 'Skip to Jump Line',
    description: 'Go to the non-main, jump line.',
    sequences: [ 'shift+.' ],
    required: true,
  },
} )( 'Navigator' )

export default { ...GLOBAL_SHORTCUTS, ...COPY_SHORTCUTS, ...NAVIGATOR_SHORTCUTS }
