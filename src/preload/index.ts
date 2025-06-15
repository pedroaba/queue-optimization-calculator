import { contextBridge } from 'electron'
import { join } from 'path'
import { pathToFileURL } from 'url'
import { electronAPI, ElectronAPI } from '@electron-toolkit/preload'

export interface API {}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
    PYODIDE_BASE_URL?: string
  }
}

function resolvePyodidePath(): string {
  const isDev =
    process.env.ELECTRON_RENDERER_URL ||
    process.defaultApp ||
    /node_modules[\\/]electron[\\/]/.test(process.execPath)

  const devPath = join(__dirname, '..', '..', 'out', 'renderer', 'pyodide')
  const prodPath = join(
    process.resourcesPath,
    'app.asar.unpacked',
    'out',
    'renderer',
    'pyodide',
    'pyodide',
  )

  const dir = isDev ? devPath : prodPath
  return pathToFileURL(dir).href
}

const api = {}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('PYODIDE_BASE_URL', resolvePyodidePath())
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
  window.PYODIDE_BASE_URL = resolvePyodidePath()
}
