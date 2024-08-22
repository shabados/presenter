import defaultTheme from '@presenter/themes/presenter/Day.css?url'
import { useContext } from 'react'

import { PRESENTER_THEMES_URL } from '~/helpers/consts'
import { StatusContext } from '~/helpers/contexts'

type ThemeLoaderProps = { name: string }

const ThemeLoader = ( { name = 'Day' }: ThemeLoaderProps ) => {
  const { connectedAt } = useContext( StatusContext )

  return (
    <link
      key={`${name}-${connectedAt?.toDateString() || ''}`}
      rel="stylesheet"
      href={name ? `${PRESENTER_THEMES_URL}/${name}.css` : defaultTheme}
    />
  )
}

export default ThemeLoader
