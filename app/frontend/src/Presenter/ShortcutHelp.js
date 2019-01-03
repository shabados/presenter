import React from 'react'

import { Typography, GridList } from '@material-ui/core'

import { SHORTCUTS, DEFAULT_SHORTCUT_MAP } from '../lib/consts'

import './ShortcutHelp.css'

/**
 * Displays all shortcuts.
 */
const ShortcutHelp = () => (
  <div className="shortcut-help">
    <Typography className="title" type="title">Keyboard Shortcuts</Typography>
    <GridList className="shortcuts" cols={3} cellHeight="auto">
      {Object.entries( DEFAULT_SHORTCUT_MAP ).map( ( [ name, shortcut ] ) => (
        <dl className="shortcut" key={SHORTCUTS[ name ]}>
          <dt>{shortcut.join( ', ' )}</dt>
          <dd>{name}</dd>
        </dl>
      ) )}
    </GridList>
  </div>
)

export default ShortcutHelp
