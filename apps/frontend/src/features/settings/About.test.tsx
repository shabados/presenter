import { render, screen } from '@testing-library/react'

import About from './About'

jest.mock( '../lib/controller', jest.fn() )

describe( '<About />', () => {
  it( 'should display a loading spinner when the page is loading', async () => {
    render( <About connected={0} /> )

    const loadingSpinner = await screen.findByRole( 'progressbar' )
    expect( loadingSpinner ).toBeInTheDocument()
  } )

  it.todo( 'should show the number of connected devices' )
} )
