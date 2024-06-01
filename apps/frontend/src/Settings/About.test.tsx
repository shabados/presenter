import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import About from './About'

vi.mock( '../lib/controller', () => ( {
  default: () => ( {} ),
} ) )

describe( '<About />', () => {
  it( 'should display a loading spinner when the page is loading', async () => {
    const mockedFetch = vi.mocked( global.fetch, { partial: true } )

    mockedFetch.mockResolvedValueOnce( {
      json: () => Promise.resolve( null ),
    } )

    render( <About connected={0} /> )

    const loadingSpinner = await screen.findByRole( 'progressbar' )
    expect( loadingSpinner ).toBeInTheDocument()
  } )

  it.todo( 'should show the number of connected devices' )
} )
