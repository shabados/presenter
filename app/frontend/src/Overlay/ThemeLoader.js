import React from 'react'
import { bool, string } from 'prop-types'

import { OVERLAY_THEMES_URL } from '../lib/consts'

/**
 * Component to load a theme using a `<link>` tag.
 * @param name The name of the CSS theme to load from the server.
 * @constructor
 */
const ThemeLoader = ( { name, connected } ) => connected && (
  <link
    rel="stylesheet"
    href={`${OVERLAY_THEMES_URL}/${name}.css`}
  />
)

ThemeLoader.propTypes = {
  name: string.isRequired,
  connected: bool.isRequired,
}

export default ThemeLoader
