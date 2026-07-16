const { contextBridge, ipcRenderer } = require( 'electron' )

contextBridge.exposeInMainWorld( 'electron', {
  toggleFullscreen: () => ipcRenderer.send( 'toggle-fullscreen' ),
} )
