import { vi } from 'vitest'

export const useSnackbar = () => ( { enqueueSnackbar: vi.fn() } )
