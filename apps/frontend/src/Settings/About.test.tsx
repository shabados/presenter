import { render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it, Mock, vi } from 'vitest'

import About from './About'

beforeAll( () => {
  vi.mock( '../lib/controller', () => ( {
    default: () => ( {} ),
  } ) )
} )

describe( '<About />', () => {
  it( 'should display a loading spinner when the page is loading', async () => {
    ( fetch as Mock ).mockResolvedValueOnce( {
      json: () => Promise.resolve( null ),
    } )

    render( <About connected={0} /> )

    const loadingSpinner = await screen.findByRole( 'progressbar' )
    expect( loadingSpinner ).toBeInTheDocument()
  } )

  it.todo( 'should show the number of connected devices' )
} )
