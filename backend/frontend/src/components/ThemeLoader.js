import React from 'react'
import PropTypes from 'prop-types'

import { THEME_URL } from '../lib/consts'

/**
 * Component to load a theme using a `<link>` tag.
 * @param name The name of the CSS theme to load from the server.
 * @constructor
 */
const ThemeLoader = ( { name } ) => <link rel="stylesheet" href={`${THEME_URL}/${name}.css`} />

ThemeLoader.propTypes = {
  name: PropTypes.string.isRequired,
}

export default ThemeLoader
