import { ipcRenderer } from 'electron'

export const clientEvents = {
  setWindowTitle: 'set-window-title',
}

export function setWindowTitle(title: string) {
  ipcRenderer.send('set-window-title', title)

  return window.dispatchEvent(
    new CustomEvent(clientEvents.setWindowTitle, {
      detail: {
        title,
      },
    }),
  )
}
