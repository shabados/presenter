import { render } from '@testing-library/react'

import { StatusContext } from '~/helpers/contexts'
import ThemeLoader from './ThemeLoader'

jest.mock( '../helpers/consts', () => ( {
  isMac: false,
} ) )

describe( 'ThemeLoader', () => {
  it( 'should generate a link element with a href of the default Day.css value', () => {
    const { container } = render(
      <StatusContext.Provider
        value={{ connected: false, connectedAt: null, status: null }}
      >
        <ThemeLoader />
      </StatusContext.Provider>
    )

    const link = container.querySelector( 'link' )

    expect( link ).toBeInTheDocument()
    expect( link?.getAttribute( 'href' ) ).toMatch( /Day.css/ )
  } )

  it(
    'should generate a link element with a href of the given name value',
    () => {
      const { container } = render(
        <StatusContext.Provider
          value={{ connected: false, connectedAt: null, status: null }}
        >
          <ThemeLoader name="Night" />
        </StatusContext.Provider>
      )

      const link = container.querySelector( 'link' )

      expect( link ).toBeInTheDocument()
      expect( link?.getAttribute( 'href' ) ).toMatch( /Night.css/ )
    }
  )
} )
