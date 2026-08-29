const { existsSync } = require( 'fs' )
const { join } = require( 'path' )
const { notarize } = require( '@electron/notarize' )

const { APPLE_ID: appleId, APPLE_PASSWORD: appleIdPassword, APPLE_TEAM_ID: teamId } = process.env
const { build: { appId: appBundleId } } = require( '../package.json' )

module.exports = async params => {
  // Only notarize the app on Mac OS
  if ( process.platform !== 'darwin' ) return

  const appPath = join( params.appOutDir, `${params.packager.appInfo.productFilename}.app` )

  if ( !existsSync( appPath ) ) throw new Error( `Cannot find application at: ${appPath}` )

  console.log( `Notarizing ${appBundleId} found at ${appPath}` )

  await notarize( { tool: 'notarytool', appBundleId, appPath, appleId, appleIdPassword, teamId } )
    .catch( error => console.error( error ) )

  console.log( `Done notarizing ${appBundleId}` )
}
