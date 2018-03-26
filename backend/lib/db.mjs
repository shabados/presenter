/**
 * Database related utility functions.
 * @ignore
 */

import { Lines, Shabads } from '@shabados/database'

import { MAX_RESULTS } from './consts.mjs'

/**
 * Queries the database for all lines with the first letters of each word.
 * @param letters The letters to search for.
 */
export const searchLines = letters => Lines.query().firstLetters( letters ).limit( MAX_RESULTS )

/**
 * Gets the Shabad of given `shabadId`, along with all the lines.
 * @param shabadId The id of the Shabad to fetch results for.
 */
export const getShabad = shabadId => Shabads
  .query()
  .where( 'id', shabadId )
  .first()
  .eager( 'lines' )
