export const decode = <T>( data: string ) => JSON.parse( data ) as T

export const encode = <T>( data: T ) => JSON.stringify( data )

export const humanEncode = <T>( data: T ) => JSON.stringify( data, null, 2 )
