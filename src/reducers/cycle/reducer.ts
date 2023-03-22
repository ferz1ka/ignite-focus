import { CycleReducerActionTypes } from "./actions"

export interface Cycle {
  id: string
  task: string
  timeAmount: number
  startedAt: Date
  completedAt?: Date
  interruptedAt?: Date
}

interface CycleReducerState {
  cycles: Cycle[]
  activeCycleId: string | null
}

export function cycleReducer(state: CycleReducerState, action: any) {
  console.log(state)
  switch (action.type) {
    case CycleReducerActionTypes.START_NEW_CYCLE:
      return {
        cycles: [...state.cycles, action.payload.newCycle],
        activeCycleId: action.payload.newCycle.id,
      }
    case CycleReducerActionTypes.INTERRUPT_CURRENT_CYCLE:
      return {
        cycles: state.cycles.map(cycle => {
          if (cycle.id === state.activeCycleId) cycle.interruptedAt = new Date()
          return cycle
        }),
        activeCycleId: null
      }
    case CycleReducerActionTypes.COMPLETE_CURRENT_CYCLE:
      return {
        cycles: state.cycles.map(cycle => {
          if (cycle.id === state.activeCycleId) cycle.completedAt = new Date()
          return cycle
        }),
        activeCycleId: null
      }
    default: return state
  }
}