import { readFile, writeFile } from 'node:fs/promises'

import { decode, humanEncode } from '@presenter/swiss-knife'

export const readJSON = <T>( path: string ) => readFile( path, { encoding: 'utf-8' } ).then( decode<T> )

export const writeJSON = ( path: string, data: unknown ) => writeFile( path, humanEncode( data ) )
