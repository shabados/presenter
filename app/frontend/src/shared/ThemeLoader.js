import React from 'react'
import PropTypes from 'prop-types'

import { THEME_URL } from '../lib/consts'
import defaultTheme from '../themes/Day.css'

/**
 * Component to load a theme using a `<link>` tag.
 * @param name The name of the CSS theme to load from the server.
 * @constructor
 */
const ThemeLoader = ( { name } ) => (
  <link
    rel="stylesheet"
    href={name ? `${THEME_URL}/${name}.css` : defaultTheme}
  />
)

ThemeLoader.propTypes = {
  name: PropTypes.string,
}

ThemeLoader.defaultProps = {
  name: 'Day',
}

export default ThemeLoader
