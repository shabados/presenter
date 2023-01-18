import './index.css'

import { useContext } from 'react'

import { ContentContext } from '../lib/contexts'

const ScreenReader = () => {
  const { shabad, bani } = useContext( ContentContext )

  const { lines = [] } = shabad ?? bani ?? {}

  return <>{lines.map( ( { gurmukhi, id } ) => <p key={id as string}>{gurmukhi}</p> )}</>
}

export default ScreenReader
