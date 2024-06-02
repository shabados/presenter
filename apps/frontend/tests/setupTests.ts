import '@testing-library/jest-dom/vitest'

import { vi } from 'vitest'

vi.mock( 'detect-browser' )

global.fetch = vi.fn()
