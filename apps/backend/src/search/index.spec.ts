import { createServer, createSocketClient } from '../../test/utils/socket'
import createSearchModule from '.'

const setup = () => {
  const { httpServer, socketServer } = createServer()

  const createClient = createSocketClient( { httpServer } )
  const client = createClient()

  const module = createSearchModule( { socketServer } )

  return { module, client }
}

describe( 'Search', () => {
  it( 'should return no results given an unreasonable query', async () => {
    const { client } = setup()

    client.sendEvent( 'search:first-letter', { query: 'pppppppppppppppp' } )
    const results = await client.waitForEvent( 'search:results' )

    expect( results ).toHaveLength( 0 )
  } )

  it( 'should return first letter results', async () => {
    const { client } = setup()

    client.sendEvent( 'search:first-letter', { query: 'hhhg' } )
    const results = await client.waitForEvent( 'search:results' )

    expect( results.length ).toBeGreaterThan( 0 )
  } )

  it( 'should return full word results', async () => {
    const { client } = setup()

    client.sendEvent( 'search:full-word', { query: 'hir gun gwvY' } )
    const results = await client.waitForEvent( 'search:results' )

    expect( results.length ).toBeGreaterThan( 0 )
  } )

  it( 'should not return extra fields determined by options', async () => {
    const { client } = setup()

    client.sendEvent( 'search:first-letter', { query: 'hggmssp' } )
    const results = await client.waitForEvent( 'search:results' )

    expect( results[ 0 ].shabad ).toBeUndefined()
    expect( results[ 0 ].translations ).toBeUndefined()
    expect( results[ 0 ].transliterations ).toBeUndefined()
  } )

  describe( 'given options', () => {
    it( 'should return citations with results', async () => {
      const { client } = setup()

      client.sendEvent( 'search:first-letter', { query: 'hggmssp', options: { citations: true } } )
      const results = await client.waitForEvent( 'search:results' )

      expect( results[ 0 ].shabad!.section ).toBeDefined()
    } )

    it( 'should return translations with results', async () => {
      const { client } = setup()

      client.sendEvent( 'search:first-letter', { query: 'hggmssp', options: { translations: true } } )
      const results = await client.waitForEvent( 'search:results' )

      expect( results[ 0 ].translations ).toBeDefined()
    } )

    it( 'should return transliterations with results', async () => {
      const { client } = setup()

      client.sendEvent( 'search:first-letter', { query: 'hggmssp', options: { transliterations: true } } )
      const results = await client.waitForEvent( 'search:results' )

      expect( results[ 0 ].transliterations ).toBeDefined()
    } )
  } )
} )
