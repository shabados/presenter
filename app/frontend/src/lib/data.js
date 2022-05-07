/**
 *! Shared with backend. To be refactored into shared location.
 */
import { toEnglish, toHindi, toShahmukhi, toUnicode } from 'gurmukhi-utils'
import { invert } from 'lodash'

// Bani IDs
export const BANIS = {
  ASA_KI_VAAR: 11,
}

// Language IDs
export const LANGUAGES = {
  english: 1,
  punjabi: 2,
  spanish: 3,
  hindi: 4,
  urdu: 5,
}

// Languages by keyed by IDs
export const LANGUAGE_NAMES = invert( LANGUAGES )

// The transliterator functions for each language, presuming ascii input
export const TRANSLITERATORS = Object.entries( {
  [ LANGUAGES.english ]: toEnglish,
  [ LANGUAGES.hindi ]: toHindi,
  [ LANGUAGES.urdu ]: toShahmukhi,
} ).reduce( ( transliterators, [ language, fn ] ) => ( {
  ...transliterators,
  [ language ]: ( ascii ) => fn( toUnicode( ascii ) ),
} ), {} )

// The order of translations
export const TRANSLATION_ORDER = [
  LANGUAGES.english,
  LANGUAGES.punjabi,
  LANGUAGES.spanish,
].reduce( ( acc, language, index ) => ( { ...acc, [ language ]: index } ), {} )

// The order of transliterations
export const TRANSLITERATION_ORDER = [
  LANGUAGES.english,
  LANGUAGES.hindi,
  LANGUAGES.urdu,
].reduce( ( acc, language, index ) => ( { ...acc, [ language ]: index } ), {} )

//! Until ShabadOS/database#1767 is resolved
export const SOURCE_ABBREVIATIONS = {
  1: 'SGGS Ji',
  2: 'Sri Dasam Granth Ji',
  3: 'Vaaran',
  4: 'Kabit Svaiye',
  5: 'Ghazals',
  6: 'Zindagi Naama',
  7: 'Ganj Naama',
  8: 'Jot Bigaas',
  9: 'Ardaas',
  10: 'Rehitname',
  11: 'Sri Sarabloh Granth Ji',
  12: 'Uggardanti',
}

// Line type IDs
export const LINE_TYPES = {
  manglaCharan: 1,
  sirlekh: 2,
  rahao: 3,
  pankti: 4,
}
