import { mapPlatformKey } from './utils'

const isMacMockGetter = jest.fn()

jest.mock( './consts', () => ( {
  get isMac() {
    return isMacMockGetter()
  },
} ) )

describe( 'utils', () => {
  describe( 'mapPlatformKey', () => {
    it( 'should map ctrl to cmd if on Mac', () => {
      isMacMockGetter.mockReturnValue( true )

      expect( mapPlatformKey( 'alt+V' ) ).toBe( 'alt+V' )
      expect( mapPlatformKey( 'ctrl+V' ) ).toBe( 'cmd+V' )
    } )

    it( 'should keep the key as-is if not on Mac', () => {
      isMacMockGetter.mockReturnValue( false )

      expect( mapPlatformKey( '' ) ).toBe( '' )
      expect( mapPlatformKey( 'ctrl+D' ) ).toBe( 'ctrl+D' )
    } )
  } )

  describe( 'mapPlatformKeys', () => {
    it( 'should not fail if passed an empty object', () => {
      const result = mapPlatformKeys( {} )

      expect( result ).toEqual( {} )
    } )

    it( 'should return the keyMap argument as-is if not on Mac', () => {
      isMacMockGetter.mockReturnValue( false )
      mapPlatformKeys( {} )
    } )

    it.todo( 'should transform ctrl to cmd in key bindings if on Mac' )
  } )
} )
