import '@testing-library/jest-dom/vitest'

import { afterEach, beforeEach, vi } from 'vitest'

vi.mock( 'detect-browser' )
vi.mock( 'notistack' )

global.fetch = vi.fn()

const actualConsole = console.error

// We do not want to know about any errors that occur during teardown
afterEach( () => {
  console.error = vi.fn()
} )

beforeEach( () => {
  console.error = actualConsole
} )
