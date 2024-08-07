import { useContext } from 'react'

import { THEMES_URL } from '~/helpers/consts'
import { StatusContext } from '~/helpers/contexts'
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
