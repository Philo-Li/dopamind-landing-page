'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { useThemeColors } from '@/hooks/useThemeColor'

interface PaywallModalProps {
  isOpen: boolean
  onClose: () => void
  onNavigateToPlans: () => void
  hasEverPaid?: boolean
}

export function PaywallModal({
  isOpen,
  onClose,
  onNavigateToPlans,
  hasEverPaid = false
}: PaywallModalProps) {
  const colors = useThemeColors()
  const [container, setContainer] = useState<HTMLElement | null>(() => {
    if (typeof document === 'undefined') {
      return null
    }
    return document.querySelector('[data-paywall-container]') as HTMLElement | null
  })

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    const target = document.querySelector('[data-paywall-container]') as HTMLElement | null
    setContainer(target)
  }, [])

  if (!isOpen) return null

  const handleButtonClick = () => {
    onClose()
    onNavigateToPlans()
  }

  const message = hasEverPaid ? '你的会员已到期' : '你当前的试用已到期'

  const overlayPosition = container ? 'absolute' : 'fixed'

  const modal = (
    <div className={`${overlayPosition} inset-0 z-50 flex items-center justify-center`}>
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleButtonClick}
      />

      {/* 弹窗内容 */}
      <div
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full mx-4 p-6"
        style={{ backgroundColor: colors.card.background }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 消息内容 */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {message}
          </h2>
        </div>

        {/* 按钮组 */}
        <div className="flex space-x-3">
          <Button
            onClick={handleButtonClick}
            variant="outline"
            className="flex-1"
          >
            取消
          </Button>

          <Button
            onClick={handleButtonClick}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
          >
            确定
          </Button>
        </div>
      </div>
    </div>
  )

  if (container) {
    return createPortal(modal, container)
  }

  return modal
}
