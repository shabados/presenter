import { isElectron } from './consts'

// eslint-disable-next-line global-require, import/no-extraneous-dependencies
const electron = () => window.require( '@electron/remote' )

export const toggleFullscreen = isElectron
  ? () => {
    const window = electron().getCurrentWindow()
    window.setFullScreen( !window.isFullScreen() )
  }
  : () => ( document.fullscreenElement
    ? document.exitFullscreen()
    : document.documentElement.requestFullscreen( document.fullscreenElement ) )
