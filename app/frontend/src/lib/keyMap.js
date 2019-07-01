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
    sequences: [ 'f11', 'ctrl+f' ],
  },
  toggleFullscreenController: {
    name: 'Toggle Fullscreen Controller',
    sequences: [ 'shift+f' ],
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
  menu: {
    name: 'Menu',
    sequences: [ 'ctrl+p', 'ctrl+,' ],
  },
  navigator: {
    name: 'Navigator',
    sequences: [ 'ctrl+c', 'ctrl+enter' ],
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

export default { ...GLOBAL_SHORTCUTS }
