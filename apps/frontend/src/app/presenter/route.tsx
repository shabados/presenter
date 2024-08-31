import { createFileRoute, redirect } from '@tanstack/react-router'
import { zodSearchValidator } from '@tanstack/router-zod-adapter'
import { z } from 'zod'

import { isMobile } from '~/helpers/consts'

export const Route = createFileRoute( '/presenter' )( {
  beforeLoad: () => {
    if ( isMobile ) {
      redirect( {
        throw: true,
        to: '/presenter/controller',
        search: {
          controllerOnly: true,
        },
      } )
    }
  },
  validateSearch: zodSearchValidator( z.object( {
    controllerOnly: z.boolean().optional(),
  } ) ),
} )
