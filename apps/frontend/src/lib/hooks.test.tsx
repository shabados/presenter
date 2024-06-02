import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import copy from 'copy-to-clipboard'
import { describe, expect, it, vi } from 'vitest'

import { useCopyToClipboard } from './hooks'

vi.mock( 'copy-to-clipboard', () => ( { default: vi.fn() } ) )

type TestHooksComponentProps = { text: string, fallback?: string }

const TestHooksComponent = ( { text, fallback = '' }: TestHooksComponentProps ) => {
  const copyToClipboard = useCopyToClipboard()

  return (
    <button type="button" onClick={() => copyToClipboard( text, fallback )}>Click me</button>
  )
}

describe( 'hooks', () => {
  describe( 'useCopyToClipboard()', () => {
    it.only( 'should return a function to copy the given text to the clipboard', async () => {
      render( <TestHooksComponent text="text to copy to the clipboard" /> )
      const user = userEvent.setup()

      const button = screen.getByText( 'Click me' )
      await user.click( button )

      expect( copy ).toHaveBeenCalledWith( 'text to copy to the clipboard' )
    } )

    it.todo( 'should truncate the snackbar message to a max of 30 characters' )
    it.todo( 'should return the fallback text in the snackbar if a falsy value is passed' )
  } )
} )
