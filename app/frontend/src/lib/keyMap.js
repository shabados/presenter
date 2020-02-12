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
  historyBack: {
    name: 'History Back',
    sequences: [ 'ctrl+left', 'alt+left' ],
  },
  historyForward: {
    name: 'History Forward',
    sequences: [ 'ctrl+right', 'alt+right' ],
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
  copyGurmukhi: {
    name: 'Copy Gurmukhi',
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
    name: 'Copy Author',
    sequences: [ 'ctrl+c a' ],
  },
} )( 'Copying' )

// Navigator-specific hotkeys
export const NAVIGATOR_SHORTCUTS = decorateGroup( {
  nextLine: {
    name: 'Go Next Line',
    description: 'Advances to the next line.',
    sequences: [ 'down', 'right', 'tab', 'PageDown', 'l' ],
  },
  previousLine: {
    name: 'Go Previous Line',
    description: 'Goes to the previous line.',
    sequences: [ 'up', 'left', 'shift+tab', 'PageUp', 'j' ],
  },
  firstLine: {
    name: 'Jump First Line',
    description: 'Jumps to first line. If on first line, jumps to last line of previous shabad.',
    sequences: [ 'ctrl+up', 'home' ],
  },
  lastLine: {
    name: 'Jump Last Line',
    description: 'Jumps to last line. If on last line, jumps to last line of previous shabad.',
    sequences: [ 'ctrl+down', 'end' ],
  },
  autoToggle: {
    name: 'Auto Jump',
    description: 'Jumps to main line, or to the next available line.',
    sequences: [ 'space', 'b' ],
  },
  setMainLine: {
    name: 'Set Main Line',
    description: 'Sets the main line.',
    sequences: [ 'ctrl+space' ],
  },
  goJumpLine: {
    name: 'Jump Next Non-Main Line',
    description: 'Jumps to the next line if on the main line.',
    sequences: [ 'shift+.' ],
  },
  goMainLine: {
    name: 'Jump Main Line',
    description: 'Jumps to the main line.',
    sequences: [ 'shift+,' ],
  },
  restoreLine: {
    name: 'Restore Line',
    description: 'Restores the line prior to a cleared screen',
    sequences: [ 'enter', 'return' ],
  },
} )( 'Navigator' )

export default { ...GLOBAL_SHORTCUTS, ...COPY_SHORTCUTS, ...NAVIGATOR_SHORTCUTS }
