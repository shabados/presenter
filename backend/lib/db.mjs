import { Lines } from '@shabados/database'

import { MAX_RESULTS } from './consts.mjs'

export const getShabadForLetters = letters => Lines
  .query()
  .firstLetters( letters )
  .then( lines => lines.$relatedQuery( 'shabad' ).eager( '[lines]' ) )
  .then( shabad => console.log( shabad ) )


export const searchLines = letters => Lines.query().firstLetters( letters ).limit( MAX_RESULTS )
