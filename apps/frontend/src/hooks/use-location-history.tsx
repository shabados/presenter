import { useRouter } from '@tanstack/react-router'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

type CreateUseLocationHistoryOptions = {
  filter?: ( href: string ) => boolean,
}

const createUseLocationHistory = (
  initial: string,
  { filter = () => true } : CreateUseLocationHistoryOptions = {}
) => {
  const HistoryContext = createContext( '/presenter/controller/search' )

  const Provider = ( { children }: { children: ReactNode } ) => {
    const router = useRouter()

    const [ location, setLocation ] = useState( initial )

    useEffect( () => router.subscribe( 'onBeforeNavigate', ( { toLocation: { href } } ) => {
      if ( !filter( href ) ) return

      setLocation( href )
    } ), [ router ] )

    return <HistoryContext.Provider value={location}>{children}</HistoryContext.Provider>
  }

  const useLocationHistory = () => useContext( HistoryContext )

  return { Provider, useLocationHistory }
}

export default createUseLocationHistory
