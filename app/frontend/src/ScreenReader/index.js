import React, { useContext } from 'react'
import { hot } from 'react-hot-loader/root'

import { ContentContext } from '../lib/contexts'

import './index.css'

const VishraamJsx = word => {
  switch ( word.slice( -1 ) ) {
    case ';':
      return <span className="heavy">{word.slice( 0, -1 )}</span>
    case ',':
      return <span className="medium">{word.slice( 0, -1 )}</span>
    case '.':
      return <span className="light">{word.slice( 0, -1 )}</span>
    default:
      return <>{word}</>
  }
}

const ScreenReader = () => {
  const { shabad, bani } = useContext( ContentContext )

  const { lines = [] } = shabad || bani || {}

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

  return (
    <div className="lines-container">
      <div className="lines">
        {lines.map( ( { gurmukhi, id } ) => {
          const isTitle = titlesFuzzy.some( ele => gurmukhi.indexOf( ele ) >= 0 )
            || titlesExact.some( ele => ele === gurmukhi )

          const isEndOfPauri = /][\d]+]/.test( gurmukhi )
            || gurmukhi.indexOf( 'bolo jI vwihgurU [' ) >= 0

          return (
            <p
              key={id}
              className={`line ${isTitle ? 'title' : ''}${
                isEndOfPauri ? 'end-of-pauri' : ''
              }`}
            >
              {gurmukhi.split( ' ' ).map( ( word, index ) => {
                const betweenWords = index === 0 ? '' : ' '
                return (
                  <>
                    {betweenWords}
                    {VishraamJsx( word )}
                  </>
                )
              } )}
            </p>
          )
        } )}
      </div>
    </div>
  )
}

export default hot( ScreenReader )
