/* Default keymap for hotkeys */

/**
 * Adds a group to a given keymap.
 * @param {*} keymap The keymap to decorate.
 */
const decorateGroup = keymap => group => Object
  .entries( keymap )
  .reduce( ( obj, [ name, content ] ) => ( {
    ...obj,
    [ name ]: { group, ...content },
  } ), {} )

// Jump to navigation line ordered hot keys
export const LINE_HOTKEYS = Array.from( '1234567890qwertyuiopasdfg' )

// Global hotkeys
export const GLOBAL_SHORTCUTS = decorateGroup( {
  toggleFullscreen: {
    name: 'Toggle Fullscreen',
    sequences: [ 'ctrl+f' ],
  },
  toggleFullscreenController: {
    name: 'Toggle Fullscreen Controller',
    sequences: [ 'ctrl+shift+f' ],
  },
  refresh: {
    name: 'Refresh',
    sequences: [ 'ctrl+r' ],
  },
  newController: {
    name: 'New Controller',
    description: 'Opens a new, popped out controller window',
    sequences: [ 'ctrl+x', 'ctrl+shift+x' ],
  },
  toggleController: {
    name: 'Toggle Controller',
    sequences: [ 'ctrl+h', 'ctrl+shift+h' ],
  },
  search: {
    name: 'Search',
    sequences: [ 'ctrl+/' ],
  },
  settings: {
    name: 'Settings',
    sequences: [ 'ctrl+,', 'ctrl+p' ],
  },
  navigator: {
    name: 'Navigator',
    sequences: [ 'ctrl+enter' ],
  },
  history: {
    name: 'History',
    sequences: [ 'ctrl+y' ],
  },
  bookmarks: {
    name: 'Bookmarks',
    sequences: [ 'ctrl+b' ],
  },
  clearDisplay: {
    name: 'Clear Display',
    sequences: [ 'esc', 'ctrl+shift+b' ],
  },
  quit: {
    name: 'Quit',
    sequences: [ 'ctrl+q' ],
  },
} )( 'Global' )

export const COPY_SHORTCUTS = decorateGroup( {
  copyGurmukhiAscii: {
    name: 'Copy Gurmukhi (ASCII)',
    sequences: [ 'ctrl+c shift+g' ],
  },
  copyGurmukhiUnicode: {
    name: 'Copy Gurmukhi (Unicode)',
    sequences: [ 'ctrl+c g' ],
  },
  copyEnglishTransliteration: {
    name: 'Copy English Transliteration',
    sequences: [ 'ctrl+c t' ],
  },
  copyHindiTransliteration: {
    name: 'Copy Hindi Transliteration',
    sequences: [ 'ctrl+c h' ],
  },
  copyUrduTransliteration: {
    name: 'Copy Urdu Transliteration',
    sequences: [ 'ctrl+c u' ],
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
  copyAuthor: {
    name: 'Copy Citation',
    sequences: [ 'ctrl+c a' ],
  },
} )( 'Copying' )

// Navigator-specific hotkeys
export const NAVIGATOR_SHORTCUTS = decorateGroup( {
  restoreLine: {
    name: 'Activate Line',
    description: 'Activates the line prior to a cleared screen',
    sequences: [ 'enter', 'return' ],
  },
  nextLine: {
    name: 'Next Line',
    sequences: [ 'down', 'right', 'tab', 'PageDown', 'l' ],
  },
  previousLine: {
    name: 'Previous Line',
    sequences: [ 'up', 'left', 'shift+tab', 'PageUp', 'j' ],
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
  },
  setMainLine: {
    name: 'Reset Main Line',
    sequences: [ 'ctrl+space' ],
  },
  goMainLine: {
    description: 'Go to main line without changing position of next jump line.',
    name: 'Skip to Main Line',
    sequences: [ 'shift+,' ],
  },
  goJumpLine: {
    name: 'Skip to Jump Line',
    description: 'Go to the non-main, jump line.',
    sequences: [ 'shift+.' ],
  },
} )( 'Navigator' )

export default { ...GLOBAL_SHORTCUTS, ...COPY_SHORTCUTS, ...NAVIGATOR_SHORTCUTS }
