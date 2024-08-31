import createUseLocationHistory from '~/hooks/use-location-history'

export const {
  Provider: ControllerLocationHistoryProvider,
  useLocationHistory: useControllerLocationHistory,
} = createUseLocationHistory(
  '/presenter/controller/search',
  { filter: ( href ) => !!href.match( '/presenter/controller/.*' ) }
)
