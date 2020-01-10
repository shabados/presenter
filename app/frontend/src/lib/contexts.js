import React, { createContext } from 'react'

export const withContext = Context => Component => props => (
  <Context.Consumer>
    {context => <Component {...context} {...props} />}
  </Context.Consumer>
)

export const SettingsContext = createContext( {} )

export const ContentContext = createContext( {
  bani: null,
  shabad: null,
  lineId: null,
} )

export const HistoryContext = createContext( {
  transitionHistory: {},
  latestLines: {},
  viewedLines: {},
} )

export const RecommendedSourcesContext = createContext( {} )

export const BookmarksContext = createContext( [] )

export const StatusContext = createContext( { connected: false, status: null } )
