import { createContext, ReactNode, useEffect, useReducer, useState } from "react";

import { completeCurrentCycleAction, CycleReducerActionTypes, interruptCurrentCycleAction, startNewCycleAction } from "../reducers/cycle/actions";
import { Cycle, cycleReducer } from "../reducers/cycle/reducer";

interface CycleContextProps {
  cycles: Cycle[]
  activeCycle?: Cycle
  activeCycleId?: string | null
  countDownSecods: number
  startNewCycle: (newCycle: Cycle) => void
  interruptCurrentCycle: () => void
  completeCurrentCycle: () => void
  updateCountDownSecods: (timeAmount: number) => void
}

export const CycleContext = createContext({} as CycleContextProps)



export function CycleContextProvider({ children }: { children: ReactNode }) {

  const [cycleState, dispatch] = useReducer(cycleReducer, {
    cycles: [],
    activeCycleId: null,
  }, reducerInitializer)

  const { cycles, activeCycleId } = cycleState || {}
  const activeCycle = cycleState?.cycles.find(cycle => cycle.id === activeCycleId)

  useEffect(() => {
    const stateJSON = JSON.stringify(cycleState)
    localStorage.setItem('@ignite-focus:cycleState-v1', stateJSON)
  }, [cycleState])

  const [countDownSecods, setCountDownSecods] = useState<number>(() => {
    if (activeCycleId) {
      const now = new Date().getTime()
      const timePassedInSeconds = Math.floor((now - new Date(activeCycle.startedAt).getTime()) / 1000)
      const timeAmountInSeconds = activeCycle.timeAmount * 60
      return timeAmountInSeconds - timePassedInSeconds
    } else return 0
  })

  function reducerInitializer() {
    const storedStateJSON = localStorage.getItem("@ignite-focus:cycleState-v1")
    if (storedStateJSON) return JSON.parse(storedStateJSON)
  }

  function startNewCycle(newCycle: Cycle) {
    setCountDownSecods(newCycle.timeAmount * 60)
    dispatch(startNewCycleAction(newCycle))
  }

  function interruptCurrentCycle() {
    setCountDownSecods(0)
    dispatch(interruptCurrentCycleAction())
  }

  function completeCurrentCycle() {
    setCountDownSecods(0)
    dispatch(completeCurrentCycleAction())
  }

  function updateCountDownSecods(timeAmount: number) {
    setCountDownSecods(timeAmount)
  }

  return (
    <CycleContext.Provider value={{
      cycles,
      activeCycle,
      activeCycleId,
      countDownSecods,
      startNewCycle,
      interruptCurrentCycle,
      completeCurrentCycle,
      updateCountDownSecods
    }}>
      {children}
    </CycleContext.Provider>
  )
}