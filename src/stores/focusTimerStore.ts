'use client'

import { create } from 'zustand'
import { TIMER_CONFIGS } from '@/constants/focusConstants'
import { TimerMode, TimerState } from '@/types/focus'

interface FocusTimerStore {
  mode: TimerMode
  timerState: TimerState
  timeLeft: number
  completionHandled: boolean
  startTimestamp: number | null
  pauseStartedAt: number | null
  accumulatedPausedMs: number
  startTimer: () => void
  tick: () => void
  pauseTimer: () => void
  resetTimer: () => void
  switchMode: (mode: TimerMode) => void
  markCompletionHandled: () => void
  setTimerState: (state: TimerState) => void
}

type IntervalHandle = ReturnType<typeof setInterval> | null

let tickInterval: IntervalHandle = null

const clearTickInterval = () => {
  if (tickInterval) {
    clearInterval(tickInterval)
    tickInterval = null
  }
}

const ensureTicking = (handler: () => void) => {
  if (tickInterval) return
  tickInterval = setInterval(handler, 1000)
}

const getModeDuration = (mode: TimerMode): number => {
  return mode === 'countup' ? 0 : TIMER_CONFIGS[mode].duration
}

export const useFocusTimerStore = create<FocusTimerStore>((set, get) => ({
  mode: 'focus',
  timerState: 'idle',
  timeLeft: getModeDuration('focus'),
  completionHandled: false,
  startTimestamp: null,
  pauseStartedAt: null,
  accumulatedPausedMs: 0,
  startTimer: () => {
    const now = Date.now()

    set(state => {
      const isIdleLike = state.timerState === 'idle' || state.timerState === 'completed'
      const initialDuration = getModeDuration(state.mode)

      const startTimestamp = isIdleLike || !state.startTimestamp ? now : state.startTimestamp
      const accumulatedPausedMs = state.pauseStartedAt
        ? state.accumulatedPausedMs + (now - state.pauseStartedAt)
        : state.accumulatedPausedMs
      const timeLeft = state.mode === 'countup'
        ? isIdleLike ? 0 : state.timeLeft
        : isIdleLike ? initialDuration : state.timeLeft

      return {
        timerState: 'running' as TimerState,
        completionHandled: false,
        startTimestamp,
        pauseStartedAt: null,
        accumulatedPausedMs,
        timeLeft
      }
    })

    ensureTicking(() => {
      if (get().timerState !== 'running') {
        clearTickInterval()
        return
      }
      get().tick()
    })

    get().tick()
  },
  tick: () => {
    const { mode, startTimestamp, accumulatedPausedMs, timerState } = get()
    if (!startTimestamp || timerState !== 'running') {
      return
    }

    const now = Date.now()
    const elapsedSeconds = Math.max(0, Math.floor((now - startTimestamp - accumulatedPausedMs) / 1000))

    if (mode === 'countup') {
      set({ timeLeft: elapsedSeconds })
      return
    }

    const duration = getModeDuration(mode)
    const remaining = Math.max(0, duration - elapsedSeconds)

    if (remaining <= 0) {
      clearTickInterval()
      set({
        timeLeft: 0,
        timerState: 'completed',
        completionHandled: false,
        startTimestamp: null,
        pauseStartedAt: null,
        accumulatedPausedMs: 0
      })
      return
    }

    set({ timeLeft: remaining })
  },
  pauseTimer: () => {
    if (get().timerState !== 'running') {
      return
    }

    get().tick()
    clearTickInterval()

    const now = Date.now()
    set(state => ({
      timerState: 'paused',
      pauseStartedAt: now,
      accumulatedPausedMs: state.accumulatedPausedMs
    }))
  },
  resetTimer: () => {
    clearTickInterval()
    const { mode } = get()
    set({
      timerState: 'idle',
      completionHandled: false,
      startTimestamp: null,
      pauseStartedAt: null,
      accumulatedPausedMs: 0,
      timeLeft: getModeDuration(mode)
    })
  },
  switchMode: (mode) => {
    clearTickInterval()
    set({
      mode,
      timerState: 'idle',
      completionHandled: false,
      startTimestamp: null,
      pauseStartedAt: null,
      accumulatedPausedMs: 0,
      timeLeft: getModeDuration(mode)
    })
  },
  markCompletionHandled: () => set({ completionHandled: true }),
  setTimerState: (state) => set({ timerState: state })
}))
