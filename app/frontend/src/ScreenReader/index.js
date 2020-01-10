import React, { useContext } from 'react'
import { hot } from 'react-hot-loader/root'

import { ContentContext } from '../lib/contexts'

import './index.css'

const ScreenReader = () => {
  const { shabad, bani } = useContext( ContentContext )

  const { lines = [] } = shabad || bani || {}

  return lines.map( ( { gurmukhi, id } ) => <p key={id}>{gurmukhi}</p> )
}

export default hot( ScreenReader )
