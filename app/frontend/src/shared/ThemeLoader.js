import React from 'react'
import { string, instanceOf } from 'prop-types'

import { THEMES_URL } from '../lib/consts'
import { withContext, StatusContext } from '../lib/contexts'

import defaultTheme from '../Presenter/themes/Day.css'

/**
 * Component to load a theme using a `<link>` tag.
 * @param name The name of the CSS theme to load from the server.
 * @constructor
 */
const ThemeLoader = ( { name, connectedAt } ) => (
  <link
    key={`${name}-${connectedAt}`}
    rel="stylesheet"
    href={name ? `${THEMES_URL}/${name}.css` : defaultTheme}
  />
)

ThemeLoader.propTypes = {
  name: string,
  connectedAt: instanceOf( Date ).isRequired,
}

ThemeLoader.defaultProps = {
  name: 'Day',
}

export default withContext( StatusContext )( ThemeLoader )
