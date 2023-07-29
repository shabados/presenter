import '@testing-library/jest-dom'

jest.mock( 'detect-browser' )

global.fetch = jest.fn().mockResolvedValue( {
  json: () => Promise.resolve( {} ),
} )
