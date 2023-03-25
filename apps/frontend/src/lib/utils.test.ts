import { mapPlatformKey, mapPlatformKeys } from './utils'

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
} )
