import { platform } from 'node:os'

export const electronVersion = process.versions.electron
export const isElectron = !!electronVersion

export const isProduction = process.env.NODE_ENV === 'production'
export const isProductionElectron = isProduction && isElectron
export const isDevelopment = !isProduction
export const isTest = process.env.NODE_ENV === 'test'

export const isWindows = platform() === 'win32'
export const isMac = platform() === 'darwin'
