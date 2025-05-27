import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import { ElectronAPI } from '@electron-toolkit/preload'

export interface API {
  calculate: (params: { inputs: string; model: string }) => Promise<void>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}

const api = {
  calculate: async function (params: { inputs: string; model: string }) {
    const result = await ipcRenderer.invoke('send-zmq-message', params)
    console.log(result)
  },
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
