/**
 * Simple logging with bunyan
 * @ignore
 */

import bunyan from 'bunyan'

const logger = bunyan.createLogger( { name: 'shabadOS-backend' } )

export default logger
