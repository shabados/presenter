import { readFile, writeFile } from 'node:fs/promises'

export const readJSON = <JSON>(
  path: string
) => readFile( path, { encoding: 'utf-8' } ).then( ( data ) => JSON.parse( data ) as JSON )

export const writeJSON = (
  path: string,
  data: any
) => writeFile( path, JSON.stringify( data, null, 2 ) )
