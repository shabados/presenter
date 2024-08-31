import { ToOptions, useRouter } from '@tanstack/react-router'

export const useNavigateUtils = () => {
  const router = useRouter()

  const open = ( location: ToOptions ) => {
    const { href } = router.buildLocation( location )

    window.open( href, '_blank' )
  }

  return { open }
}
