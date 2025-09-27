// src/constants/focusConstants.ts
import { TimerMode, TimerConfig } from '../types/focus';

// Static configuration without labels (for when translation is not available)
export const TIMER_CONFIGS: Record<TimerMode, TimerConfig> = {
  focus: {
    duration: 25 * 60,
    label: '专注', // fallback
    color: '#4A90E2',
    icon: 'hourglass-start',
    statusText: '专注中...' // fallback
  },
  shortBreak: {
    duration: 5 * 60,
    label: '短休息', // fallback
    color: '#50E3C2',
    icon: 'coffee',
    statusText: '休息中...' // fallback
  },
  longBreak: {
    duration: 15 * 60,
    label: '长休息', // fallback
    color: '#8B5CF6',
    icon: 'bed',
    statusText: '深度休息...' // fallback
  },
  countup: {
    duration: 0, // No fixed duration for countup
    label: '正计时', // fallback
    color: '#F39C12',
    icon: 'clock',
    statusText: '自由专注...' // fallback
  }
};

// Function to get localized timer configs
export const getLocalizedTimerConfigs = (): Record<TimerMode, TimerConfig> => {
  return {
    focus: {
      ...TIMER_CONFIGS.focus,
      label: '专注',
      statusText: '专注中...'
    },
    shortBreak: {
      ...TIMER_CONFIGS.shortBreak,
      label: '短休息',
      statusText: '休息中...'
    },
    longBreak: {
      ...TIMER_CONFIGS.longBreak,
      label: '长休息',
      statusText: '深度休息...'
    },
    countup: {
      ...TIMER_CONFIGS.countup,
      label: '正计时',
      statusText: '自由专注...'
    }
  };
};