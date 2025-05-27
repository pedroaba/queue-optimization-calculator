import { Outlet } from 'react-router-dom'

import { Container } from '@renderer/components/container'
import { Copyright } from '@renderer/components/copyright'
import { Title } from '@renderer/components/title'
import { useEffect, useState } from 'react'
import { clientEvents } from './constants/client-events'

export function MainLayout() {
  const [windowTitle, setWindowTitle] = useState('Modelos de filas')

  useEffect(() => {
    window.addEventListener(clientEvents.setWindowTitle, (event: Event) => {
      const { title } = (event as CustomEvent<{ title: string }>).detail

      setWindowTitle(title)
    })
  }, [])

  return (
    <Container>
      <Title>{windowTitle}</Title>
      <Outlet />

      <Copyright />
    </Container>
  )
}
