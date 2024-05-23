import { Bani, Language, Shabad, Source, TranslationSource } from '@presenter/contract'
import { Banis, CommonBuilder, Languages, Lines, LinesBuilder, Model, Shabads, Sources, UnwrapModel, Writers } from '@shabados/database'
import gurmukhiUtils from 'gurmukhi-utils'
import { groupBy, last } from 'lodash-es'
import type { AsyncReturnType } from 'type-fest'

import { MAX_RESULTS } from '~/helpers/consts'

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
  ( letters: string ) => Lines.query().firstLetters( gurmukhiUtils.stripAccents( letters ) )
)

export const fullWordSearch = withSearchOptions(
  ( words: string ) => Lines.query().fullWord( words )
)

const queryShabad = ( query: CommonBuilder<Shabads> ) => query
  .withGraphJoined( '[lines, section]' )
  .withTranslations()
  .then( toJSON )
  .then( ( [ shabad ] ) => shabad as Shabad )

export const getShabad = ( shabadId: string ) => queryShabad( Shabads
  .query()
  .where( 'shabads.id', shabadId ) )

export const getShabadByOrderId = ( orderId: number ) => queryShabad( Shabads
  .query()
  .where( 'shabads.order_id', orderId ) )

export const getBanis = () => Banis.query().then( toJSON ) as Promise<( Bani & { id: number } )[]>

export const getBaniLines = ( baniId: number ) => Banis
  .query()
  .withGraphJoined( 'lines.shabad', { minimize: false, aliases: { lines: 'l' } } )
  .orderBy( [ 'line_group', 'l.order_id' ] )
  .where( 'banis.id', baniId )
  .withTranslations()
  .then( toJSON )
  .then( ( [ bani ] ) => bani as Bani )

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
  ]: [ string, ReturnType<typeof groupTranslationSources<Result>>[number] ]
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
