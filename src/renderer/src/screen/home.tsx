import { Container } from '@renderer/components/container'
import { Copyright } from '@renderer/components/copyright'
import { QueueModelCard } from '@renderer/components/queue-model-card'
import { Title } from '@renderer/components/title'
import { models } from '@renderer/constants/models'

export function HomeScreen() {
  return (
    <Container>
      <Title>Modelos de filas</Title>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {models.map((model) => (
          <QueueModelCard key={model.id} model={model} />
        ))}
      </div>

      <Copyright />
    </Container>
  )
}
