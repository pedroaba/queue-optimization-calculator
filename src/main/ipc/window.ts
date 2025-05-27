import { BrowserWindow, ipcMain } from 'electron'

export function setupWindowListeners() {
  ipcMain.on('set-window-title', (event, title) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      window.setTitle(title)
    }
  })
}
