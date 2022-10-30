import { createIpc, ElectronIpcEvents, ServerIpcEvents } from '@presenter/node'

const ipc = createIpc<ElectronIpcEvents, ServerIpcEvents>( process )

export default ipc
