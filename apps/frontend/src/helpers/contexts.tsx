import { Bani, Line, Shabad } from '@presenter/contract'
import { ComponentType, Context, createContext } from 'react'

import { SettingsState } from './options'

export const
  withContext = <T extends JSX.IntrinsicAttributes,>( Context: Context<T> ) => (
    Component: ComponentType
  ) => ( props: T ) => (
    <Context.Consumer>
      {( context ) => <Component {...context} {...props} />}
    </Context.Consumer>
  )

export const SettingsContext = createContext( {} as SettingsState )

type Content = {
  bani: Bani | null,
  shabad: Shabad | null,
  lineId: string,
}

export const ContentContext = createContext<Content>( {
  bani: null,
  shabad: null,
  lineId: '',
} )

type TransitionHistory = {
  length: number,
}

export const HistoryContext = createContext( {
  transitionHistory: {} as TransitionHistory,
  latestLines: {},
  viewedLines: {},
} )

type RecommendedSources = {
  pageNameEnglish: string,
}

export const RecommendedSourcesContext = createContext( {} as RecommendedSources )

export const WritersContext = createContext( {} )

export const BookmarksContext = createContext( [] )

type Status = {
  connected: boolean,
  connectedAt: Date | null,
  status: string | null,
}

export const StatusContext = createContext<Status>( {
  connected: false, connectedAt: null, status: null,
} )
