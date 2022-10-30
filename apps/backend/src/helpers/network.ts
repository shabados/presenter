import { reverse } from 'dns'
import { hostname, networkInterfaces } from 'os'
import { promisify } from 'util'

const asyncReverse = promisify( reverse )

const timeoutPromise = <T>( ms: number, promise: Promise<T> ): Promise<T> => Promise.race( [
  new Promise<T>( ( _, reject ) => {
    const timeout = setTimeout( () => {
      clearTimeout( timeout )
      reject()
    }, ms )
  } ),
  promise,
] )

export const getHost = async ( hybridIP: string ) => {
  // Remove the IPv6 compoonent, if the address is a hybrid v4-v6
  const ip = hybridIP.replace( /^.*:/, '' )

  if ( ip === '127.0.0.1' || ip === '1' ) return hostname()

  try {
    const [ hostname ] = await timeoutPromise( 200, asyncReverse( hybridIP ) )

    return hostname ?? ip
  } catch ( err ) {
    return ip
  }
}

const publicInterfacesRegex = /^(ethernet|wifi|en|eth|wlan|wi-fi|wireless)/i

export const getNetworkedAddresses = () => Object.entries( networkInterfaces() )
  .filter( ( [ name ] ) => name.match( publicInterfacesRegex ) )
  .reduce( ( interfaces, [ name, addresses ] ) => {
    const { address } = addresses?.find( ( { family, internal } ) => !internal && family === 'IPv4' ) ?? {}

    return address ? { ...interfaces, [ name ]: address } : interfaces
  }, {} )
