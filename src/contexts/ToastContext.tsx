'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Toast } from '../components/ui/Toast'

interface ToastContextType {
  showSuccess: (title: string, message?: string) => void
  showError: (title: string, message?: string) => void
  showInfo: (title: string, message?: string) => void
  showWarning: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

interface ToastState {
  visible: boolean
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  })

  const showToast = (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => {
    setToast({
      visible: true,
      type,
      title,
      message,
    })
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }))
  }

  const showSuccess = (title: string, message?: string) => {
    showToast('success', title, message)
  }

  const showError = (title: string, message?: string) => {
    showToast('error', title, message)
  }

  const showInfo = (title: string, message?: string) => {
    showToast('info', title, message)
  }

  const showWarning = (title: string, message?: string) => {
    showToast('warning', title, message)
  }

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo, showWarning }}>
      {children}
      <Toast
        visible={toast.visible}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  )
}