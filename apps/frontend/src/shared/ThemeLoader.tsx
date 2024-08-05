import { useContext } from 'react'

import { THEMES_URL } from '~/lib/consts'
import { StatusContext } from '~/lib/contexts'
import defaultTheme from '~/Presenter/themes/Day.css?url'

type ThemeLoaderProps = { name: string }

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
