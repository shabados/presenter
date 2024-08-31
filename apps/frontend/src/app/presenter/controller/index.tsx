import { createFileRoute, Navigate } from '@tanstack/react-router'

import { useControllerLocationHistory } from '../-controller-location-history'

const Redirect = () => {
  const lastControllerUrl = useControllerLocationHistory()

  return <Navigate to={lastControllerUrl} replace />
}

export const Route = createFileRoute( '/presenter/controller/' )( {
  component: Redirect,
} )
