import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute( '/settings/' )( {
  validateSearch: z.object( {
    server: z.string().optional(),
    client: z.string().optional(),
  } ),
  beforeLoad: () => redirect( { to: '/settings/client/display' } ), //
} )
