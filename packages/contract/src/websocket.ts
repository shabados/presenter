import type { Merge } from 'type-fest'

import { BaniList, Content, Line, ViewedLines } from './data'
import { Settings } from './settings'

type DefineParameters<
  Name extends string,
  Parameters extends Partial<Record<Name, any>>
> = Merge<Record<Name, undefined>, Parameters>

export const serverEvents = [
  'shabads:current',
  'banis:current',
  'lines:current',
  'lines:main',
  'lines:next',
  'history:clear',
  'settings:all',
  'search:first-letter',
  'search:full-word',
  'action:open-overlay-folder',
  'action:open-logs-folder',
  'action:open-external-url',
  'action:open-window',
] as const

export type ServerEvent = typeof serverEvents[number]
export type ServerEventParameters = DefineParameters<ServerEvent, {
  'lines:current': { lineId: string, lineOrderId: string, transition?: boolean },
  'lines:main': string,
  'lines:next': string,
}>

export const clientEvents = [
  'shabads:current',
  'banis:current',
  'banis:list',
  'lines:current',
  'history:viewed-lines',
  'lines:main',
  'lines:next',
  'status',
  'history:transitions',
  'history:latest-lines',
  'settings:all',
  'results',
  'connection:ready',
] as const

export type ClientEvent = typeof clientEvents[number]
export type ClientEventParameters = DefineParameters<ClientEvent, {
  'content:current': Content | null,
  'banis:list': BaniList[],
  'lines:current': string | null,
  'lines:main': string | null,
  'lines:next': string | null,
  'status': string | null,
  'history:viewed-lines': ViewedLines,
  // 'history:transitions',
  // 'history:latest-lines',
  'settings:all': Settings,
  'results': Line[],
  // 'connection:ready',
}>
