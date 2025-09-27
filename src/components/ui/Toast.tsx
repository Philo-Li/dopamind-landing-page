'use client'

import React, { useEffect, useRef } from 'react'
import { useThemeColors } from '@/hooks/useThemeColor'
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react'

interface ToastProps {
  visible: boolean
  title?: string
  message?: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  onClose: () => void
}

export const Toast: React.FC<ToastProps> = ({
  visible,
  title = '',
  message = '',
  type,
  duration = 3000,
  onClose
}) => {
  const colors = useThemeColors()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          backgroundColor: '#10B981' + '20',
          borderColor: '#10B981',
          iconColor: '#10B981',
          textColor: '#10B981',
        }
      case 'error':
        return {
          icon: XCircle,
          backgroundColor: '#EF4444' + '20',
          borderColor: '#EF4444',
          iconColor: '#EF4444',
          textColor: '#EF4444',
        }
      case 'warning':
        return {
          icon: AlertTriangle,
          backgroundColor: '#F59E0B' + '20',
          borderColor: '#F59E0B',
          iconColor: '#F59E0B',
          textColor: '#F59E0B',
        }
      case 'info':
        return {
          icon: Info,
          backgroundColor: colors.tint + '20',
          borderColor: colors.tint,
          iconColor: colors.tint,
          textColor: colors.tint,
        }
      default:
        return {
          icon: Info,
          backgroundColor: colors.tint + '20',
          borderColor: colors.tint,
          iconColor: colors.tint,
          textColor: colors.tint,
        }
    }
  }

  const config = getToastConfig()
  const IconComponent = config.icon

  useEffect(() => {
    if (visible && duration > 0) {
      timeoutRef.current = setTimeout(() => {
        onClose()
      }, duration)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [visible, duration, onClose])

  if (!visible) return null

  return (
    <div
      className="fixed z-50 animate-in slide-in-from-top-2 fade-in duration-300"
      style={{
        top: '80px', // 导航栏高度 (h-16 = 64px) + 间距 16px
        left: '256px', // 侧边栏宽度 (w-64)
        right: '16px',
      }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <div
          className="flex items-center p-4 rounded-xl border-2 backdrop-blur-sm shadow-lg"
          style={{
            backgroundColor: colors.card.background + 'FA',
            borderColor: config.borderColor,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
          }}
        >
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full mr-3"
            style={{ backgroundColor: config.backgroundColor }}
          >
            <IconComponent size={20} style={{ color: config.iconColor }} />
          </div>

          <div className="flex-1">
            {title && (
              <div
                className="text-sm font-semibold mb-1"
                style={{ color: config.textColor }}
              >
                {title}
              </div>
            )}
            {message && (
              <div
                className="text-sm leading-5"
                style={{ color: config.textColor }}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}