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
  'content:lines:current',
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
  'content:open-line': { lineId: string, type: 'shabad' | 'bani' },
  'lines:current': { lineId: string, lineOrderId: string, transition?: boolean },
  'lines:main': string,
  'lines:next': string,
  'settings:all': Partial<Settings>,
  'search:full-word': SearchQuery,
  'search:first-letter': SearchQuery,
  'action:open-external-url': string,
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
  'search:results',
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
  'search:results': Line[],
}>
