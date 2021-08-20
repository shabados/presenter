// eslint-disable-next-line import/no-extraneous-dependencies
import { app, Menu, shell } from 'electron'

const initMenu = () => {
  if ( process.platform !== 'darwin' ) return
  const template = [
    {
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { role: 'selectall' },
      ],
    },
    {
      role: 'window',
      submenu: [

        { role: 'close' },
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' },
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click() { shell.openExternal( 'https://docs.shabados.com/presenter' ) },
        },
        {
          label: 'Report a bug',
          click() { shell.openExternal( 'https://github.com/shabados/presenter/issues/new?assignees=&labels=Status%3A+%3F+%3F+%3F%2C+Type%3A+Fix&template=bug_report.md&title=' ) },
        },
        {
          label: 'Request a feature',
          click() { shell.openExternal( 'https://github.com/shabados/presenter/issues/new?assignees=&labels=Type%3A+Feat&template=feature_request.md&title=' ) },
        },
        {
          label: 'Support and Feedback',
          click() { shell.openExternal( 'https://github.com/ShabadOS/.github/blob/main/SUPPORT.md' ) },
        },
      ],
    },
  ]

  const menu = Menu.buildFromTemplate( template )
  Menu.setApplicationMenu( menu )
}

export default initMenu
