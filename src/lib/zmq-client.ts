import zmq from 'zeromq'

let zmqClient: zmq.Request

export async function initializeZmqClient() {
  if (zmqClient) {
    return
  }

  let tries = 5
  let interval: NodeJS.Timeout
  interval = setInterval(() => {
    try {
      zmqClient = new zmq.Request()
      zmqClient.connect('tcp://localhost:5555')
      clearInterval(interval)
    } catch (error) {
      console.error('Error connecting to ZMQ server:', error)

      if (tries === 0) {
        clearInterval(interval)
        return
      }

      tries--
    }
  }, 1000)
}

export async function sendMessage(message: string) {
  try {
    if (!zmqClient) {
      await initializeZmqClient()
    }

    await zmqClient.send(message)
    const reply = await zmqClient.receive()
    return reply.toString()
  } catch (error) {
    console.error('Error sending message:', error)
    throw error
  }
}
