import { createRouter, RouterProvider } from '@tanstack/react-router'
import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'

import Empty from './components/Empty'
import { isDev } from './helpers/consts'
import { routeTree } from './routeTree.gen'
import controller from './services/controller'

const settings = controller.readSettings()

// if ( settings?.security?.displayAnalytics ) {
//   void analytics.initialise()
//   analytics.updateSettings( controller.readSettings( true ) )
// }

const router = createRouter( { routeTree } )

declare module '@tanstack/react-router' {

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Register {
    router: typeof router,
  }
}

const TanStackRouterDevtools = isDev
  ? lazy(
    // eslint-disable-next-line import/no-extraneous-dependencies
    () => import( '@tanstack/router-devtools' ).then( ( res ) => ( { default: res.TanStackRouterDevtools } ) )
  )
  : Empty

const DevTools = () => (
  <Suspense>
    <TanStackRouterDevtools router={router} />
  </Suspense>
)

createRoot( document.getElementById( 'root' )! ).render(
  <StrictMode>
    <RouterProvider router={router} />
    <DevTools />
  </StrictMode>
)
