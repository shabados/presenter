// Bridge API exposed by the Electron preload script (see electron/preload.cjs)
const electron = () => window.electron

export const toggleFullscreen = () => ( electron()
  ? electron().toggleFullscreen()
  : ( document.fullscreenElement
    ? document.exitFullscreen()
    : document.documentElement.requestFullscreen() ) )
