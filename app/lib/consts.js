/**
 * Constants file.
 * @ignore
 */

// Check every 15 seconds (in dev)
export const UPDATE_CHECK_INTERVAL = 1000 * 15

// Setting file locations
export const SETTINGS_FILE = `${__dirname}/../settings.json`
export const DEFAULT_SETTINGS_FILE = `${__dirname}/../settings.default.json`

// Temporary files directory
export const TEMP_DIR = 'tmp'

// Max Search results to return in one go
export const MAX_RESULTS = 20

// Backend port
export const PORT = process.env.NODE_ENV === 'production' ? 42424 : 8080
