import { useContext } from 'react'

import { THEMES_URL } from '../lib/consts'
import { StatusContext } from '../lib/contexts'
import defaultTheme from '../Presenter/themes/Day.css'

type ThemeLoaderProps = { name?: string }

/**
 * Component to load a theme using a `<link>` tag.
 * @param {string} name The name of the CSS theme to load from the server.
 * @constructor
 */
const ThemeLoader = ( { name = 'Day' }: ThemeLoaderProps ) => {
  const { connectedAt } = useContext( StatusContext )

  return (
    <link
      key={`${name}-${connectedAt?.toDateString() || ''}`}
      rel="stylesheet"
      href={name ? `${THEMES_URL}/${name}.css` : defaultTheme}
    />
  )
}

export default ThemeLoader
