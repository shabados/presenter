import '@testing-library/jest-dom/vitest'

import { vi } from 'vitest'

vi.mock( 'detect-browser' )
vi.mock( 'notistack' )

global.fetch = vi.fn()
