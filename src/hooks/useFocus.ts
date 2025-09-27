// src/hooks/useFocus.ts
'use client'

import { useEffect, useRef } from 'react'
import { shallow } from 'zustand/shallow'
import { TimerMode } from '@/types/focus'
import { getLocalizedTimerConfigs } from '@/constants/focusConstants'
import { useFocusTimerStore } from '@/stores/focusTimerStore'

interface UseFocusOptions {
  onComplete?: () => void
  onTick?: (timeLeft: number) => void
}

export function useFocus(options: UseFocusOptions = {}) {
  const optionsRef = useRef(options)

  useEffect(() => {
    optionsRef.current = options
  }, [options])

  const {
    timerState,
    mode,
    timeLeft,
    completionHandled,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    markCompletionHandled,
    setTimerState
  } = useFocusTimerStore(
    (state) => ({
      timerState: state.timerState,
      mode: state.mode,
      timeLeft: state.timeLeft,
      completionHandled: state.completionHandled,
      startTimer: state.startTimer,
      pauseTimer: state.pauseTimer,
      resetTimer: state.resetTimer,
      switchMode: state.switchMode,
      markCompletionHandled: state.markCompletionHandled,
      setTimerState: state.setTimerState
    }),
    shallow
  )

  const localizedTimerConfigs = getLocalizedTimerConfigs()

  useEffect(() => {
    optionsRef.current.onTick?.(timeLeft)
  }, [timeLeft])

  useEffect(() => {
    if (timerState === 'completed' && !completionHandled) {
      optionsRef.current.onComplete?.()
      markCompletionHandled()
    }
  }, [timerState, completionHandled, markCompletionHandled])

  useEffect(() => {
    if (timerState === 'completed') {
      setTimerState('idle')
    }
  }, [timerState, setTimerState])

  return {
    timerState,
    currentMode: mode as TimerMode,
    timeLeft,
    completionHandled,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    setTimerState,
    markCompletionHandled,
    localizedTimerConfigs
  }
}
