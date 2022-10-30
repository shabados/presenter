import fetch, { RequestInit } from 'node-fetch'

const fetchJson = async <Response = unknown>( url: string, params?: RequestInit ) => {
  const response = await fetch( url, params )

  const contentType = response.headers.get( 'content-type' )
  const isJson = contentType?.startsWith( 'application/json' )

  const body = await ( isJson ? response.json() : response.text() )

  if ( response.status >= 400 ) throw new Error( `Failed call to resource ${url} with status code ${response.status}\nResponse body: ${JSON.stringify( body, null, 2 )}` )

  return body as Response
}

export default fetchJson
