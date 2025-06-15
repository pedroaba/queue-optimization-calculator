import { contextBridge, ipcRenderer, app } from 'electron'
import { join } from 'path'
import { pathToFileURL } from 'url'
import { electronAPI, ElectronAPI } from '@electron-toolkit/preload'

export interface API {
  calculate: (params: { inputs: string; model: string }) => Promise<void>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
    PYODIDE_BASE_URL?: string
  }
}

function getPyodideBase(): string {
  // Em dev:  <repo root>/out/renderer/pyodide
  // Em build: <Resources>/app.asar.unpacked/out/renderer/pyodide
  const dir = app.isPackaged
    ? join(
        process.resourcesPath,
        'app.asar.unpacked',
        'out',
        'renderer',
        'pyodide',
      )
    : join(__dirname, '..', '..', 'out', 'renderer', 'pyodide')

  // Transformamos em URL file:// para o loadPyodide
  return pathToFileURL(dir).href
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
    contextBridge.exposeInMainWorld('PYODIDE_BASE_URL', getPyodideBase())
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
  window.PYODIDE_BASE_URL = getPyodideBase()
}
