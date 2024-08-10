import { useContext } from 'react'

import defaultTheme from '~/features/presenter/themes/Day.css?url'
import { THEMES_URL } from '~/helpers/consts'
import { StatusContext } from '~/helpers/contexts'

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
