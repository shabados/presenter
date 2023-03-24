import '@testing-library/jest-dom'

jest.mock( './src/lib/consts' )

global.fetch = jest.fn().mockResolvedValue( {
  json: () => Promise.resolve( {} ),
} )
