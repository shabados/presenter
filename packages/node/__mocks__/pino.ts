import pino from 'pino'

const SilentPino = () => pino( { level: 'info' } )

export default SilentPino
