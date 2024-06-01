import '@testing-library/jest-dom/vitest'
import '../src/__mocks__/network'

import { vi } from 'vitest'

vi.mock( 'detect-browser' )
