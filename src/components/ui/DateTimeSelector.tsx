'use client'

import React from 'react'
import { useLocalization } from '@/hooks/useLocalization'

// 内联样式用于日期选择器的暗色模式支持
const dateTimePickerStyles = `
  .date-time-picker {
    color-scheme: light;
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
  }

  .date-time-picker::-webkit-calendar-picker-indicator {
    filter: invert(0);
  }

  .dark .date-time-picker {
    color-scheme: dark;
  }

  .dark .date-time-picker::-webkit-calendar-picker-indicator {
    filter: brightness(0) invert(1);
    opacity: 0.9;
  }
`

interface DateTimeSelectorProps {
  dueDate: string
  dueTime: string
  onDateChange: (date: string) => void
  onTimeChange: (time: string) => void
  disabled?: boolean
  showOptionalText?: boolean
  className?: string
  dateOnly?: boolean
  dateLabel?: string
  timeLabel?: string
  minDate?: string
  maxDate?: string
  customStyles?: {
    backgroundColor?: string
    borderColor?: string
    textColor?: string
  }
}

export function DateTimeSelector({
  dueDate,
  dueTime,
  onDateChange,
  onTimeChange,
  disabled = false,
  showOptionalText = true,
  className = '',
  dateOnly = false,
  dateLabel,
  timeLabel,
  minDate,
  maxDate,
  customStyles
}: DateTimeSelectorProps) {
  const { t } = useLocalization()

  const defaultInputStyles = "date-time-picker w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-dopamind-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"

  const getInputStyles = () => {
    if (customStyles) {
      return `date-time-picker w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dopamind-500 transition-colors duration-200`
    }
    return defaultInputStyles
  }

  const getInputStyleProps = () => {
    if (customStyles) {
      return {
        style: {
          backgroundColor: customStyles.backgroundColor,
          borderColor: customStyles.borderColor,
          color: customStyles.textColor,
          borderWidth: '1.5px'
        }
      }
    }
    return {}
  }

  return (
    <div className={className}>
      {/* 内联样式 */}
      <style dangerouslySetInnerHTML={{ __html: dateTimePickerStyles }} />

      {/* Date and Time layout */}
      <div className={dateOnly ? "" : "grid grid-cols-2 gap-4"}>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {dateLabel || t('task_form.due_date')}
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => onDateChange(e.target.value)}
            className={getInputStyles()}
            disabled={disabled}
            min={minDate}
            max={maxDate}
            {...getInputStyleProps()}
          />
        </div>

        {!dateOnly && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {timeLabel || t('task_form.due_time')}
            </label>
            <input
              type="time"
              value={dueTime}
              onChange={(e) => onTimeChange(e.target.value)}
              className={getInputStyles()}
              disabled={disabled}
              placeholder="Optional"
              {...getInputStyleProps()}
            />
          </div>
        )}
      </div>

      {showOptionalText && !dateOnly && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {t('task_form.due_time_optional')}
        </p>
      )}
    </div>
  )
}

// Utility function to extract date and time parts from various formats
export const extractDueDateParts = (rawValue?: string | null) => {
  if (!rawValue) {
    return { dueDate: '', dueTime: '' }
  }

  const normalized = rawValue.replace(' ', 'T')
  const [datePart, timePartRaw = ''] = normalized.split('T')
  const cleanedTime = timePartRaw
    .replace(/Z$/i, '')
    .replace(/([+-]\d{2}:?\d{2})$/i, '')
    .trim()

  return {
    dueDate: datePart || '',
    dueTime: cleanedTime ? cleanedTime.substring(0, 5) : ''
  }
}

// Utility function to combine date and time into a single value
export const combineDateTimeValues = (dueDate: string, dueTime: string): string | undefined => {
  if (!dueDate) return undefined

  if (dueTime) {
    // Combine date and time into ISO string
    return `${dueDate}T${dueTime}:00`
  } else {
    // Just date, no time specified
    return dueDate
  }
}