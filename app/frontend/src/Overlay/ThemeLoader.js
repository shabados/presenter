import React from 'react'
import { string, instanceOf } from 'prop-types'

import { OVERLAY_THEMES_URL } from '../lib/consts'
import { StatusContext, withContext } from '../lib/contexts'

/**
 * Component to load a theme using a `<link>` tag.
 * @param name The name of the CSS theme to load from the server.
 * @constructor
 */
const ThemeLoader = ( { name, connectedAt } ) => (
  <link
    rel="stylesheet"
    key={`${name}-${connectedAt}`}
    href={`${OVERLAY_THEMES_URL}/${name}.css`}
  />
)

ThemeLoader.propTypes = {
  name: string.isRequired,
  connectedAt: instanceOf( Date ).isRequired,
}

export default withContext( StatusContext )( ThemeLoader )
