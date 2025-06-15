import { contextBridge, ipcRenderer } from 'electron'
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
  const isDev =
    process.env.ELECTRON_RENDERER_URL || // electron-vite dev
    process.defaultApp || // `electron .`
    /node_modules[\\/]electron[\\/]/.test(process.execPath)

  const dir = isDev
    ? join(__dirname, '..', '..', 'out', 'renderer', 'pyodide') // dev
    : join(
        process.resourcesPath,
        'app.asar.unpacked',
        'out',
        'renderer',
        'pyodide',
        'pyodide',
      ) // prod

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
