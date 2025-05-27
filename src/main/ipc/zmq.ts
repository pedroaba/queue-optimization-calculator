import { ipcMain } from 'electron'
import { initializeZmqClient, sendMessage } from '../../lib/zmq-client'

export function setupZmqIpc() {
  ipcMain.handle('initialize-zmq-client', async () => {
    await initializeZmqClient()

    return true
  })

  ipcMain.handle(
    'send-zmq-message',
    async (_, message: { inputs: string; model: string }) => {
      return await sendMessage(JSON.stringify(message))
    },
  )
}
