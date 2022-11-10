import pino from 'pino'

const SilentPino = () => pino( { level: 'silent' } )

export default SilentPino
