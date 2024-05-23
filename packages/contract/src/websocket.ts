import type { Merge } from 'type-fest'

import { BaniList, Content, Line, ViewedLines } from './data'
import { SearchQuery } from './search'
import { Settings } from './settings'

type DefineParameters<
  Name extends string,
  Parameters extends Partial<Record<Name, unknown>>
> = Merge<Record<Name, undefined>, Parameters>

export const serverEvents = [
  'content:shabad:open',
  'content:open-previous',
  'content:open-next',
  'content:bani:open',
  'content:line:set-current',
  'content:line:set-next',
  'content:line:set-previous',
  'content:line:clear',
  'content:tracker:set-next-line',
  'content:tracker:set-main-line',
  'content:tracker:autojump',
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
  'content:shabad:open': { id: string, lineId?: string },
  'content:bani:open': { id: number, lineId?: string },
  'content:line:set-current': { transition?: boolean, id: string },
  'content:tracker:set-main-line': string,
  'content:tracker:set-next-line': string,
  'settings:all': Partial<Settings>,
  'search:full-word': SearchQuery,
  'search:first-letter': SearchQuery,
  'action:open-external-url': string,
}>

export const clientEvents = [
  'content:current',
  'content:bani:list',
  'content:line:current',
  'content:tracker:main-line',
  'content:tracker:next-line',
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
  'content:tracker:main-line': string | null,
  'content:tracker:next-line': string | null,
  'status': string | null,
  'history:viewed-lines': ViewedLines,
  // 'history:transitions',
  // 'history:latest-lines',
  'settings:all': Settings,
  'search:results': Line[],
}>
