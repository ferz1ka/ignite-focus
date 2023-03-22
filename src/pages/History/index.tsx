import { useContext } from 'react'
import { CycleContext } from '../../contexts/CycleContext'
import { formatRelativeTime } from '../../utils/relativeTimeFormatter'
import { HistoryContainer, HistoryTableContainer, Status } from './styles'

export function History() {

  const { cycles } = useContext(CycleContext)

  console.log(cycles)

  return (
    <HistoryContainer>
      <h1>Meu histórico</h1>

      <HistoryTableContainer>
        <table>
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Duração</th>
              <th>Início</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {cycles.map((cycle) => {
              const isCycleCompleted = !!cycle.completedAt
              const isCycleInterrupted = !!cycle.interruptedAt

              const statusLabel = isCycleCompleted ? 'Concluída' : isCycleInterrupted ? 'Interrompida' : 'Em andamento'
              const statusColor = isCycleCompleted ? 'green' : isCycleInterrupted ? 'red' : 'yellow'
              const startedDate = formatRelativeTime(new Date(cycle?.startedAt))

              return (
                <tr key={cycle.id}>
                  <td>{cycle.task}</td>
                  <td>{cycle.timeAmount} minutos</td>
                  <td>{startedDate}</td>
                  <td><Status statusColor={statusColor}>{statusLabel}</Status></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </HistoryTableContainer>
    </HistoryContainer>
  )
}