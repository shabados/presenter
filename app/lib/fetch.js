import fetch from 'node-fetch'

const fetchJson = async ( url, params ) => {
  const response = await fetch( url, params )

  const contentType = response.headers.get( 'content-type' )
  const isJson = contentType.startsWith( 'application/json' )

  const body = await ( isJson ? response.json() : response.text() )

  if ( response.status >= 400 ) throw new Error( `Failed call to resource ${url} with status code ${response.status}\nResponse body: ${JSON.stringify( body, null, 2 )}` )

  return body
}

export default fetchJson
