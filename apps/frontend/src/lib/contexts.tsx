import { ComponentType, Context, createContext } from 'react'

import { Line } from '../types/api'
import { SettingsState } from './options'

export const withContext = <T,>( Context: Context<T> ) => ( Component: ComponentType ) => ( props: T ) => (
  <Context.Consumer>
    {( context ) => <Component {...context} {...props} />}
  </Context.Consumer>
)

export const SettingsContext = createContext( {} as SettingsState )

type Content = {
  bani: { lines: Line[] } | null,
  shabad: { lines: Line[] } | null,
  lineId: string,
}

export const ContentContext = createContext<Content>( {
  bani: null,
  shabad: null,
  lineId: '',
} )

export const HistoryContext = createContext( {
  transitionHistory: {},
  latestLines: {},
  viewedLines: {},
} )

export const RecommendedSourcesContext = createContext( {} )

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
