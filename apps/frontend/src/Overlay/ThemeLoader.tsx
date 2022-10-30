import { useContext } from 'react'

import { OVERLAY_THEMES_URL } from '../lib/consts'
import { StatusContext } from '../lib/contexts'

type ThemeLoaderProps = { name: String }

/**
 * Component to load a theme using a `<link>` tag.
 * @param name The name of the CSS theme to load from the server.
 * @constructor
 */
const ThemeLoader = ( { name }: ThemeLoaderProps ) => {
  const { connectedAt } = useContext(StatusContext)
  
  return (
    <link
      rel="stylesheet"
      key={`${name}-${connectedAt}`}
      href={`${OVERLAY_THEMES_URL}/${name}.css`}
    />
  )
}

export default  ThemeLoader 
