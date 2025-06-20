import { contextBridge } from 'electron'
import { electronAPI, ElectronAPI } from '@electron-toolkit/preload'

export interface API {}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}

const api = {}

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
