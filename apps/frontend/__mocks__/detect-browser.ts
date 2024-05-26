import { vi } from 'vitest'

export const detect = vi.fn().mockReturnValue( {
  os: 'Windows 10',
} )
