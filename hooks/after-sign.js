const { existsSync } = require( 'fs' )
const { join } = require( 'path' )
const { notarize } = require( 'electron-notarize' )

const { APPLE_ID: appleId, APPLE_PASSWORD: appleIdPassword } = process.env
const { build: { appId: appBundleId } } = require( '../package.json' )

module.exports = async params => {
  // Only notarize the app on Mac OS
  if ( process.platform !== 'darwin' ) return

  console.log( 'Attempting to notarizing Mac OS app with params:', params )

  const appPath = join( params.appOutDir, `${params.packager.appInfo.productFilename}.app` )

  if ( !existsSync( appPath ) ) throw new Error( `Cannot find application at: ${appPath}` )

  console.log( `Notarizing ${appBundleId} found at ${appPath}` )

  await notarize( { appBundleId, appPath, appleId, appleIdPassword } )
    .catch( error => console.error( error ) )

  console.log( `Done notarizing ${appBundleId}` )
}
