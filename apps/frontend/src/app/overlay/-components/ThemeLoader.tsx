import { useContext } from 'react'

import { API_URL } from '~/helpers/consts'
import { StatusContext } from '~/helpers/contexts'

const OVERLAY_THEMES_URL = `${API_URL}/themes/overlay`

type ThemeLoaderProps = { name: string }

const ThemeLoader = ( { name }: ThemeLoaderProps ) => {
  const { connectedAt } = useContext( StatusContext )

  return (
    <link
      rel="stylesheet"
      key={`${name}-${connectedAt?.toDateString() ?? ''}`}
      href={`${OVERLAY_THEMES_URL}/${name}.css`}
    />
  )
}

export default ThemeLoader
