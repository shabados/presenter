import '@testing-library/jest-dom'

jest.mock( './src/helpers/consts' )

global.fetch = jest.fn().mockResolvedValue( {
  json: () => Promise.resolve( {} ),
} )
