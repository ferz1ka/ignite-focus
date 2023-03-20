import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { HandPalm, Play } from 'phosphor-react'
import { CountDownContainer, CountDownSeparator, FormContainer, FormContainerTaskInput, FormContainerTimeAmountInput, HomeContainer, StartCountDownButton, StopCountDownButton } from './styles'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa.'),
  timeAmount: zod.number()
    .min(5, 'O cliclo precisa ser de, no mínimo, 5 minutos.')
    .max(60, 'O cliclo precisa ser de, no máximo, 60 minutos.')
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  timeAmount: number
  startDate: number
  status: "in progress" | "interrupted" | "completed"
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [countDownSecods, setCountDownSecods] = useState<number>(0)

  useEffect(() => {
    let interval: number
    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)
    if (activeCycle) {
      interval = setInterval(() => {
        const now = new Date().getTime()
        const timePassedInSeconds = Math.floor((now - activeCycle.startDate) / 1000)
        const timeAmountInSeconds = activeCycle.timeAmount * 60
        const newCountDownSecods = timeAmountInSeconds - timePassedInSeconds
        if (newCountDownSecods === 0) {
          handleCompleteCycle()
          clearInterval(interval)
        } else {
          setCountDownSecods(newCountDownSecods)
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [activeCycleId])

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      timeAmount: 0
    }
  })

  function handleCreateNewCycle(data: NewCycleFormData) {
    const newClycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      timeAmount: data.timeAmount,
      startDate: new Date().getTime(),
      status: 'in progress'
    }
    setCycles(prevCycles => [...prevCycles, newClycle])
    setActiveCycleId(newClycle.id)
    setCountDownSecods(newClycle.timeAmount * 60)
  }

  function handleInterruptCycle() {
    setCycles(prevCycles => prevCycles.map((cycle) => {
      if (cycle.id === activeCycleId) return { ...cycle, status: 'interrupted' }
      else return cycle
    }))
    setActiveCycleId(null)
    setCountDownSecods(0)
    reset()
  }

  function handleCompleteCycle() {
    setCycles(prevCycles => prevCycles.map((cycle) => {
      if (cycle.id === activeCycleId) return { ...cycle, status: 'completed' }
      else return cycle
    }))
    setActiveCycleId(null)
    setCountDownSecods(0)
    reset()
  }

  // console.log('formState', formState.errors)

  const task = watch('task')
  const isSubmitDisabled = !task

  const minutesRemaining = Math.floor(countDownSecods / 60)
  const secondsRemaning = countDownSecods % 60

  const minutesRemainingToDisplay = String(minutesRemaining).padStart(2, '0')
  const secondsRemaningToDisplay = String(secondsRemaning).padStart(2, '0')

  if (!!activeCycleId) {
    document.title = `Ignite Focus - ${minutesRemainingToDisplay}:${secondsRemaningToDisplay}`
  } else {
    document.title = 'Ignite Focus'
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action=''>
        <FormContainer>
          <label htmlFor='task'>Vou trabalhar em</label>
          <datalist id='task-history'>
            <option value='Projeto 1' />
            <option value='Projeto 2' />
            <option value='Projeto 3' />
          </datalist>
          <FormContainerTaskInput
            id='task'
            list='task-history'
            placeholder='Dê um nome para o seu projeto'
            disabled={!!activeCycleId}
            {...register('task')}
          />
          <label htmlFor='timeAmount'>durante</label>
          <FormContainerTimeAmountInput
            id='timeAmount'
            type='number'
            placeholder='00'
            step='5'
            min='5'
            max='60'
            disabled={!!activeCycleId}
            {...register('timeAmount', { valueAsNumber: true })}
          />
          <span>minutos.</span>
        </FormContainer>

        <CountDownContainer>
          <span>{minutesRemainingToDisplay[0]}</span>
          <span>{minutesRemainingToDisplay[1]}</span>
          <CountDownSeparator>:</CountDownSeparator>
          <span>{secondsRemaningToDisplay[0]}</span>
          <span>{secondsRemaningToDisplay[1]}</span>
        </CountDownContainer>

        {
          !!activeCycleId
            ? <StopCountDownButton type='button' onClick={handleInterruptCycle}>
              <HandPalm size={24} />
              Interromper
            </StopCountDownButton>
            : <StartCountDownButton disabled={isSubmitDisabled} type='submit'>
              <Play size={24} />
              Começar
            </StartCountDownButton>
        }

      </form>

    </HomeContainer>
  )
}