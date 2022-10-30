import { ChildProcess } from 'node:child_process'

import { EventEmitter } from 'eventemitter3'

type EventPayload = {
  event: string,
  payload: unknown,
}

export type ElectronIpcEvents = {
  'server:ready': undefined,
  'settings:change': undefined,
  'electron-update:check': undefined,
  'action:open-window': undefined,
}

export type ServerIpcEvents = {
  'electron-update:downloaded': undefined,
  'electron-update:available': undefined,
  'electron-update:checked': undefined,
}

export const createIpc = <
  SendableEvents extends Record<string, any>,
  ReceivableEvents extends Record<string, any>,
>( process: NodeJS.Process | ChildProcess ) => {
  const emitter = new EventEmitter()

  const send = <EventName extends keyof SendableEvents>(
    event: EventName,
    payload: SendableEvents[EventName]
  ) => process.send?.( { event, payload } )

  const on = <EventName extends keyof ReceivableEvents>(
    event: EventName,
    handler: ( payload: ReceivableEvents[EventName] ) => any
  ) => emitter.on( event as string, handler )

  const once = <EventName extends keyof ReceivableEvents>(
    event: EventName,
    handler: ( payload: ReceivableEvents[EventName] ) => any
  ) => emitter.on( event as string, handler )

  const registerListener = () => process.on(
    'message',
    ( { event, payload }: EventPayload ) => emitter.emit( event, payload )
  )

  return { send, on, once, registerListener }
}
