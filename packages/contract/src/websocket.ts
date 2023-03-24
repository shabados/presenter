import type { Merge } from 'type-fest'

import { BaniList, Content, Line, ViewedLines } from './data'
import { SearchQuery } from './search'
import { Settings } from './settings'

type DefineParameters<
  Name extends string,
  Parameters extends Partial<Record<Name, any>>
> = Merge<Record<Name, undefined>, Parameters>

export const serverEvents = [
  'content:shabad:next',
  'content:shabad:previous',
  'content:banis:current',
  'content:line:current',
  'content:line:main',
  'content:line:next',
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
  'content:line:open': { id: string, type: 'shabad' | 'bani' },
  'content:shabad:open': { id: string },
  'content:bani:open': { id: string },
  'content:line:current': { transition?: boolean } & ( { id: string | null } | { orderId: number } ),
  'content:line:main': string,
  'content:line:next': string,
  'settings:all': Partial<Settings>,
  'search:full-word': SearchQuery,
  'search:first-letter': SearchQuery,
  'action:open-external-url': string,
}>

export const clientEvents = [
  'content:current',
  'content:bani:list',
  'content:line:current',
  'content:line:main',
  'content:line:next',
  'history:viewed-lines',
  'status',
  'history:transitions',
  'history:latest-lines',
  'settings:all',
  'search:results',
] as const

export type ClientEvent = typeof clientEvents[number]
export type ClientEventParameters = DefineParameters<ClientEvent, {
  'content:current': Content | null,
  'content:bani:list': BaniList[],
  'content:line:current': string | null,
  'content:line:main': string | null,
  'content:line:next': string | null,
  'status': string | null,
  'history:viewed-lines': ViewedLines,
  // 'history:transitions',
  // 'history:latest-lines',
  'settings:all': Settings,
  'search:results': Line[],
}>
