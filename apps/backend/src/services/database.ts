import { Language, Source, TranslationSource } from '@presenter/contract'
import { Banis, Languages, Lines, LinesBuilder, Model, Shabads, Sources, UnwrapModel, Writers } from '@shabados/database'
import { stripAccents } from 'gurmukhi-utils'
import { groupBy, last } from 'lodash'
import type { AsyncReturnType } from 'type-fest'

import { MAX_RESULTS } from '../helpers/consts'

const toJSON = <M extends Model>(
  models: M[]
) => models.map( ( m ) => m.toJSON() as unknown as UnwrapModel<M> )

type SearchOptions = {
  translations: boolean,
  transliterations: boolean,
  citations: boolean,
}

const withSearchOptions = ( queryFn: ( search: string ) => LinesBuilder ) => (
  query: string,
  options: Partial<SearchOptions> = {}
) => ( [
  [ options.transliterations, ( model: LinesBuilder ) => model.withTransliterations() ],
  [ options.translations, ( model: LinesBuilder ) => model.withTranslations() ],
  [ options.citations, ( model: LinesBuilder ) => model.eager( 'shabad.section' ) ],
] as const )
  .filter( ( [ option ] ) => option )
  .reduce(
    ( model, [ , modifier ] ) => modifier( model ),
    queryFn( query ).limit( MAX_RESULTS ),
  )
  .then( toJSON )

export const firstLetterSearch = withSearchOptions(
  ( letters: string ) => Lines.query().firstLetters( stripAccents( letters ) )
)

export const fullWordSearch = withSearchOptions(
  ( words: string ) => Lines.query().fullWord( words )
)

export const getShabad = ( shabadId: string ) => Shabads
  .query()
  .where( 'shabads.id', shabadId )
  .withGraphJoined( '[lines, section]' )
  .withTranslations()
  .then( toJSON )
  .then( ( [ shabad ] ) => shabad )

export const getShabadByOrderId = ( orderId: number ) => ( Shabads
  .query()
  .where( 'shabads.order_id', orderId )
  .withGraphJoined( '[lines, section]' ) )
  .withTranslations()
  .then( toJSON )
  .then( ( [ shabad ] ) => shabad )

export const getBanis = () => Banis.query().then( toJSON )

export const getBaniLines = ( baniId: number ) => Banis
  .query()
  .withGraphJoined( 'lines.shabad', { minimize: false, aliases: { lines: 'l' } } )
  .orderBy( [ 'line_group', 'l.order_id' ] )
  .where( 'banis.id', baniId )
  .withTranslations()
  .then( toJSON )
  .then( ( [ bani ] ) => bani )

const groupTranslationSources = <Result>(
  acc: Result,
  { translationSources, id, ...source }: Source
) => ( {
  ...acc,
  [ id ]: {
    ...source,
    translationSources: groupBy( translationSources, ( { languageId } ) => languageId ),
  },
} )

const generateRecommendedSources = <Result>(
  acc: Result,
  [
    id,
    { translationSources, ...source },
  ]: [ string, ReturnType<typeof groupTranslationSources>[number] ]
) => ( {
  ...acc,
  [ id ]: {
    ...source,
    translationSources: Object
      .entries( translationSources )
      .reduce(
        ( acc, [ id, sources ] ) => ( { ...acc, [ id ]: last( sources )! } ),
        {} as Record<string, TranslationSource>
      ),
  },
} )

export const getSources = () => Sources
  .query()
  .withGraphJoined( 'translationSources' )
  .then( toJSON )
  .then( ( sources ) => sources.reduce(
    groupTranslationSources,
    {} as ReturnType<typeof groupTranslationSources>
  ) )
  .then( ( sources ) => ( {
    sources,
    recommendedSources: Object
      .entries( sources )
      .reduce( generateRecommendedSources, {} as ReturnType<typeof generateRecommendedSources> ),
  } ) )

export type GetSourcesResult = AsyncReturnType<typeof getSources>

export const getLanguages = (): Promise<Language[]> => Languages.query().then( toJSON )

export const getWriters = () => Writers
  .query()
  .then( toJSON )

export const getShabadRange = () => Shabads
  .query()
  .min( 'order_id AS min' )
  .max( 'order_id AS max' )
  .first()
  .castTo<{ max: number, min: number }>()
  .then( ( { min, max } ) => [ min, max ] as const )
