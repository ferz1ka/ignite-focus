import { Cycle } from "./reducer";

export enum CycleReducerActionTypes {
  START_NEW_CYCLE = 'START_NEW_CYCLE',
  INTERRUPT_CURRENT_CYCLE = 'INTERRUPT_CURRENT_CYCLE',
  COMPLETE_CURRENT_CYCLE = 'COMPLETE_CURRENT_CYCLE'
}

export function startNewCycleAction(newCycle: Cycle) {
  return {
    type: CycleReducerActionTypes.START_NEW_CYCLE,
    payload: { newCycle }
  }
}

export function interruptCurrentCycleAction() {
  return {
    type: CycleReducerActionTypes.INTERRUPT_CURRENT_CYCLE,
  }
}

export function completeCurrentCycleAction() {
  return {
    type: CycleReducerActionTypes.COMPLETE_CURRENT_CYCLE,
  }
}