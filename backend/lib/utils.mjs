/**
 * Collection of utility functions.
 * @ignore
 */

import path from 'path'

import download from 'download'
import ProgressBar from 'progress'

/**
 * Returns the download URL for a database release on github.
 * @param version The version to retrieve the download URL for
 */
export const dbDownloadURL = version =>
  `https://github.com/ShabadOS/database/releases/tag/${version}/database.sqlite`

/**
 * Download file to destination, with a progress bar.
 * @param url The target URL
 * @param destination The destination (folder)
 */
export const downloadFile = async ( url, destination ) => {
  const filename = path.basename( url )

  // Setup progress bar
  const bar = new ProgressBar( `${filename} [:bar] :percent :etas`, {
    complete: '=',
    incomplete: ' ',
    width: 100,
    total: 0,
  } )

  // Return download promise, as well as configuring the progress bar
  return download( url, destination )
    .on( 'response', res => {
      // Tick the bar when data is received
      bar.total = res.headers[ 'content-length' ]
      res.on( 'data', ( { length } ) => bar.tick( length ) )
    } )
}
