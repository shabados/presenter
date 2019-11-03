const { execSync } = require( 'child_process' )
const { writeFileSync, unlinkSync } = require( 'fs' )
const { tmpdir } = require( 'os' )

const {
  WIN_CSC_LINK,
  WIN_CSC_KEY_PASSWORD,
  SIGN_TOOL_PATH = 'C:\\Program Files (x86)\\Windows Kits\\10\\bin\\x64\\signtool.exe',
  TIMESTAMP_SERVER = 'http://timestamp.digicert.com',
} = process.env

const SITE = 'https://shabados.com'

const certificate = Buffer.from( WIN_CSC_LINK, 'base64' )

exports.default = async ( { path, name } ) => {
  if ( !WIN_CSC_LINK ) return

  const isFile = WIN_CSC_LINK.includes( 'file://' )

  const certPath = isFile ? WIN_CSC_LINK.replace( 'file://', '' ) : `${tmpdir()}\\cert.pfx`

  if ( !isFile ) writeFileSync( certPath, certificate )

  const command = [
    [ `"${SIGN_TOOL_PATH}"` ],
    [ 'sign' ],
    [ '/t', `"${TIMESTAMP_SERVER}"` ],
    [ '/f', `"${certPath}"` ],
    [ '/d', `"${name}"` ],
    [ '/du', `"${SITE}"` ],
    [ '/p', `"${WIN_CSC_KEY_PASSWORD}"` ],
    [ `"${path}"` ],
  ].map( sub => sub.join( ' ' ) ).join( ' ' )

  try {
    execSync( command, { stdio: 'inherit' } )
  } catch {
    console.error( `Signing ${path} failed` )
  }

  if ( !isFile ) unlinkSync( certPath )
}
