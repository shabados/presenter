import React, { useContext } from 'react'
import { hot } from 'react-hot-loader/root'

import { ContentContext } from '../lib/contexts'

import { classifyWords } from '../lib/line'
import './index.css'

const titlesFuzzy = [
  '<>',
  '] jpu ]',
  'pwiqswhI 10',
  '] qÍ pRswid ]',
  '] qÍ pRswid kQqy ]',
  'BujMg pRXwq CMd ]',
  '] cwcrI CMd ]',
  '] sv`Xy ]',
  '] cOpeI ]',
  'mhlw 1',
  'mhlw 2',
  'mhlw 3',
  'mhlw 4',
  'mhlw 5',
  'mhlw 6',
  'mhlw 7',
  'mhlw 8',
  'mhlw 9',
  'mÚ 1',
  'mÚ 2',
  'mÚ 3',
  'mÚ 4',
  'mÚ 5',
  'mÚ 6',
  'mÚ 7',
  'mÚ 8',
  'mÚ 9',
]

const titlesExact = [
  'jwpu ]',
  'sloku ]',
  'pauVI ]',
  'AstpdI ]',
  'cwcrI CMd ]',
  'eyk ACrI CMd ]',
  'sÍYXw ]',
  'dohrw ]',
  'sRI BgauqI jI shwie ]',
  'vwr sRI BgauqI jI kI ]',
  'rhrwis swihb',
]

const isTitle = str => {
  if ( titlesFuzzy.some( subtitle => str.includes( subtitle ) )
    || titlesExact.some( title => title === str ) ) {
    return 'title'
  }
  return ''
}

const pauriEndingRegex = /][\d]+]/

const isEndOfPauri = str => {
  // if there is a line ending (॥੧॥) or ardas
  if ( pauriEndingRegex.test( str ) || str.includes( 'bolo jI vwihgurU [' ) ) {
    return 'end-of-pauri'
  }
  return ''
}

const ScreenReader = () => {
  const { shabad, bani } = useContext( ContentContext )

  const { lines = [] } = shabad || bani || {}

  return (
    <div className="lines-container">
      <div className="lines">
        {lines.map( ( { gurmukhi, id } ) => (
          <p
            key={id}
            className={`line ${isTitle( gurmukhi )} ${isEndOfPauri( gurmukhi )}`}
          >
            { /* eslint-disable-next-line react/no-array-index-key */ }
            {classifyWords( gurmukhi ).map( ( { word, type }, i ) => <span key={`${word}-${type}-${i}`} className={`word ${type}`}>{word}</span> )}
          </p>
        ) )}
      </div>
    </div>
  )
}

export default hot( ScreenReader )
