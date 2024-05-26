import copy from 'copy-to-clipboard'
import { useSnackbar } from 'notistack'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import { useCopyToClipboard } from './hooks'

vi.mock( 'copy-to-clipboard', () => ( { default: vi.fn() } ) )
vi.mock( 'notistack', () => ( { useSnackbar: vi.fn().mockReturnValue( { enqueueSnackbar: vi.fn() } ) } ) )

const TestHooksComponent = () => {
  const copyToClipboard = useCopyToClipboard()

  return { copyToClipboard }
}

describe( 'hooks', () => {
  describe( 'useCopyToClipboard()', () => {
    let copyToClipboard: ( text: string, fallback?: string ) => void
    let enqueueSnackbar

    beforeAll( () => {
      ( { copyToClipboard } = TestHooksComponent() )
      ;( { enqueueSnackbar } = useSnackbar() )
    } )

    afterEach( () => {
      vi.clearAllMocks()
    } )

    it( 'should return a function to copy the given text to the clipboard', () => {
      copyToClipboard( 'text to copy to the clipboard' )

      expect( copy ).toHaveBeenCalledTimes( 2 )
      expect( copy ).toHaveBeenCalledWith( 'text to copy to the clipboard' )
    } )

    it( 'should truncate the snackbar message to a max of 30 characters', () => {
      copyToClipboard( 'this is 30 characters longggg. this should be truncated.' )

      // eslint-disable-next-line no-useless-escape
      expect( enqueueSnackbar ).toHaveBeenCalledWith( 'Copied \"this is 30 characters longggg....\" to clipboard', expect.any( Object ) )
    } )

    it( 'should return the fallback text in the snackbar if a falsy value is passed', () => {
      const { enqueueSnackbar } = useSnackbar()
      copyToClipboard( '', 'fallback text' )

      expect( copy ).not.toHaveBeenCalled()
      expect( enqueueSnackbar ).toHaveBeenCalledWith( 'fallback text', expect.any( Object ) )
    } )
  } )
} )
