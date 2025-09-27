'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useThemeColors } from '@/hooks/useThemeColor'
import { useLocalization } from '@/hooks/useLocalization'
import { useToast } from '@/contexts/ToastContext'
import { Gift, Clock, CheckCircle, AlertCircle, Info, RefreshCw } from 'lucide-react'
import { promoCodeApi, type ApiResponse } from '@/lib/api'
import type { PromoCodeHistory, PROMO_CODE_ERROR_CODES } from '@/types/promoCode'

export default function GiftCodeContent() {
  const colors = useThemeColors()
  const { t } = useLocalization()
  const { showSuccess, showError } = useToast()

  const [promoCode, setPromoCode] = useState('')
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [history, setHistory] = useState<PromoCodeHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const [lastError, setLastError] = useState<string | null>(null)

  // 防抖输入处理
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  // 处理输入变化，添加防抖
  const handlePromoCodeChange = useCallback((value: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      setPromoCode(value.toUpperCase())
      setLastError(null) // 清除之前的错误
    }, 300)
  }, [])

  // 加载兑换历史（带重试逻辑）
  const loadHistory = useCallback(async (isRetry = false) => {
    try {
      if (!isRetry) {
        setIsLoading(true)
        setLastError(null)
      }

      const response = await promoCodeApi.getHistory()

      if (response.success && response.data) {
        console.log('礼品码历史数据:', response.data)
        // 检查数据格式
        if (Array.isArray(response.data)) {
          response.data.forEach((item, index) => {
            console.log(`历史记录 ${index}:`, item)
            if (item.usedAt) {
              console.log(`兑换时间原始值:`, item.usedAt, '类型:', typeof item.usedAt)
            }
          })
        }
        setHistory(response.data as PromoCodeHistory[])
        setRetryCount(0) // 重置重试计数
      } else {
        console.error('Failed to load promo code history:', response.error)
        setHistory([])
        if (isRetry) {
          setLastError(t('promo_code.errors.history_load_failed'))
        }
      }
    } catch (error: any) {
      console.error('Failed to load promo code history:', error)
      setHistory([])

      // 处理不同类型的错误
      let errorMsg = t('promo_code.errors.network_error')

      if (error?.response?.status === 404) {
        errorMsg = t('promo_code.errors.feature_not_available')
      } else if (error?.response?.headers['content-type']?.includes('text/html')) {
        errorMsg = t('promo_code.errors.service_unavailable')
      } else if (error?.response?.status >= 500) {
        errorMsg = t('promo_code.errors.server_error')
      }

      if (isRetry && retryCount < 2) {
        // 最多重试2次
        setRetryCount(prev => prev + 1)
        setTimeout(() => loadHistory(true), 1000 * (retryCount + 1)) // 递增延迟
      } else if (isRetry) {
        setLastError(errorMsg)
      }
    } finally {
      if (!isRetry) {
        setIsLoading(false)
      }
    }
  }, [retryCount, t])

  // 手动重试加载历史
  const retryLoadHistory = useCallback(() => {
    setRetryCount(0)
    loadHistory()
  }, [loadHistory])

  // 清理函数
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const handleRedeem = async () => {
    if (!promoCode.trim()) {
      showError(t('promo_code.errors.empty_code'))
      return
    }

    try {
      setIsRedeeming(true)

      const response = await promoCodeApi.redeemCode(promoCode.trim())

      if (response.success && response.data) {
        showSuccess(
          t('promo_code.success.title'),
          t('promo_code.success.message', { days: (response.data as any)?.days || 0 })
        )
        setPromoCode('')
        // 刷新历史记录
        loadHistory()
      } else {
        // 根据后端返回的错误码显示相应错误信息
        const errorCode = response.error?.code
        let errorMessage = t('promo_code.errors.redeem_failed')

        switch (errorCode) {
          case 'INVALID_CODE':
            errorMessage = t('promo_code.errors.invalid_code')
            break
          case 'EXPIRED_CODE':
            errorMessage = t('promo_code.errors.expired_code')
            break
          case 'USED_CODE':
            errorMessage = t('promo_code.errors.used_code')
            break
          case 'MAX_USES_REACHED':
            errorMessage = t('promo_code.errors.max_uses_reached')
            break
          case 'DISABLED_CODE':
            errorMessage = t('promo_code.errors.disabled_code')
            break
          default:
            errorMessage = response.error?.message || t('promo_code.errors.redeem_failed')
        }

        showError(t('promo_code.errors.redeem_failed'), errorMessage)
      }
    } catch (error: any) {
      console.error('Redeem failed:', error)

      let errorMessage = t('promo_code.errors.redeem_failed')

      // 检查是否是API端点不存在的错误（通常返回HTML）
      if (error?.response?.status === 404) {
        errorMessage = t('promo_code.errors.feature_not_available')
      } else if (error?.response?.status === 401) {
        errorMessage = t('promo_code.errors.login_required')
      } else if (error?.response?.status >= 500) {
        errorMessage = t('promo_code.errors.server_error')
      } else if (error?.code === 'NETWORK_ERROR' || !error?.response) {
        errorMessage = t('promo_code.errors.network_error')
      } else if (error?.response?.headers['content-type']?.includes('text/html')) {
        // 检测到HTML响应，说明可能是路由不存在或服务器配置问题
        errorMessage = t('promo_code.errors.service_unavailable')
      } else {
        // 尝试从响应中提取错误信息
        const responseError = error?.response?.data?.error?.message ||
                             error?.response?.data?.message ||
                             error?.message

        // 如果错误信息包含HTML标签，则使用默认提示
        if (responseError && responseError.includes('<')) {
          errorMessage = t('promo_code.errors.service_unavailable')
        } else {
          errorMessage = responseError || t('promo_code.errors.redeem_failed')
        }
      }

      showError(t('promo_code.errors.redeem_failed'), errorMessage)
    } finally {
      setIsRedeeming(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRedeem()
    }
  }

  const formatDate = (dateString: string) => {
    try {
      // 如果dateString为空或无效，返回默认值
      if (!dateString || typeof dateString !== 'string') {
        return '日期未知'
      }

      // 清理日期字符串
      const cleanDateString = dateString.trim()

      // 尝试不同的日期格式
      let date: Date

      // 1. 直接尝试解析
      date = new Date(cleanDateString)
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }

      // 2. 尝试ISO格式（如果包含T）
      if (cleanDateString.includes('T')) {
        date = new Date(cleanDateString.replace('T', ' '))
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        }
      }

      // 3. 尝试解析时间戳（如果是数字字符串）
      if (/^\d+$/.test(cleanDateString)) {
        const timestamp = parseInt(cleanDateString)
        // 检查是否是毫秒或秒级时间戳
        const timestampMs = timestamp > 1e10 ? timestamp : timestamp * 1000
        date = new Date(timestampMs)
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        }
      }

      // 如果所有格式都失败，记录原始值并返回错误信息
      console.warn('Unable to parse date string:', cleanDateString)
      return `日期格式错误: ${cleanDateString.substring(0, 20)}...`

    } catch (error) {
      console.error('Date formatting error:', error, 'for date:', dateString)
      return '日期解析失败'
    }
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 border-b h-[64px]"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.border
        }}
      >
        <h1 className="text-xl font-semibold" style={{ color: colors.text }}>
          {t('promo_code.title')}
        </h1>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          {/* 副标题 */}
          <div className="text-center mb-6">
            <p className="text-base leading-6" style={{ color: colors.textSecondary }}>
              {t('promo_code.subtitle')}
            </p>
          </div>

          {/* 兑换卡片 */}
          <div
            className="p-6 rounded-2xl border shadow-sm mb-6"
            style={{
              backgroundColor: colors.card.background,
              borderColor: colors.card.border
            }}
          >
            <div className="flex items-center mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: colors.tint + '20' }}
              >
                <Gift size={20} style={{ color: colors.tint }} />
              </div>
              <h2 className="text-lg font-bold" style={{ color: colors.text }}>
                {t('promo_code.redeem_title')}
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value.toUpperCase())
                    setLastError(null)
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder={t('promo_code.input_placeholder')}
                  className="w-full px-4 py-3 rounded-lg border text-center text-lg font-mono tracking-wider uppercase transition-colors"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: lastError ? colors.status.error : colors.border,
                    color: colors.text
                  }}
                  disabled={isRedeeming}
                  maxLength={20}
                />
                {lastError && (
                  <p className="mt-2 text-sm text-center" style={{ color: colors.status.error }}>
                    {lastError}
                  </p>
                )}
              </div>

              <button
                onClick={handleRedeem}
                disabled={isRedeeming || !promoCode.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: colors.tint,
                  color: 'white'
                }}
              >
                {isRedeeming ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('promo_code.redeeming')}
                  </>
                ) : (
                  <>
                    <Gift size={16} />
                    {t('promo_code.redeem_button')}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 使用说明 */}
          <div
            className="p-6 rounded-2xl border shadow-sm mb-6"
            style={{
              backgroundColor: colors.card.background,
              borderColor: colors.card.border
            }}
          >
            <div className="flex items-center mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: colors.tint + '20' }}
              >
                <Info size={20} style={{ color: colors.tint }} />
              </div>
              <h2 className="text-lg font-bold" style={{ color: colors.text }}>
                {t('promo_code.instructions_title')}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5"
                  style={{
                    backgroundColor: colors.tint,
                    color: 'white'
                  }}
                >
                  1
                </div>
                <p className="text-sm leading-5" style={{ color: colors.textSecondary }}>
                  {t('promo_code.instructions.step1')}
                </p>
              </div>

              <div className="flex items-start">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5"
                  style={{
                    backgroundColor: colors.tint,
                    color: 'white'
                  }}
                >
                  2
                </div>
                <p className="text-sm leading-5" style={{ color: colors.textSecondary }}>
                  {t('promo_code.instructions.step2')}
                </p>
              </div>

              <div className="flex items-start">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5"
                  style={{
                    backgroundColor: colors.tint,
                    color: 'white'
                  }}
                >
                  3
                </div>
                <p className="text-sm leading-5" style={{ color: colors.textSecondary }}>
                  {t('promo_code.instructions.step3')}
                </p>
              </div>
            </div>
          </div>

          {/* 使用历史 */}
          <div
            className="p-6 rounded-2xl border shadow-sm"
            style={{
              backgroundColor: colors.card.background,
              borderColor: colors.card.border
            }}
          >
            <div className="flex items-center mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: colors.tint + '20' }}
              >
                <Clock size={20} style={{ color: colors.tint }} />
              </div>
              <h2 className="text-lg font-bold" style={{ color: colors.text }}>
                {t('promo_code.history_title')}
              </h2>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-pulse text-sm" style={{ color: colors.textSecondary }}>
                  {t('promo_code.loading')}
                </div>
              </div>
            ) : lastError ? (
              <div className="text-center py-8">
                <AlertCircle size={24} style={{ color: colors.status.error }} className="mx-auto mb-3" />
                <p className="text-sm mb-3" style={{ color: colors.status.error }}>
                  {lastError}
                </p>
                <button
                  onClick={retryLoadHistory}
                  className="flex items-center gap-2 mx-auto px-4 py-2 rounded-lg border transition-colors"
                  style={{
                    borderColor: colors.tint,
                    color: colors.tint,
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.tint + '10'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <RefreshCw size={16} />
                  重试
                </button>
              </div>
            ) : history.length > 0 ? (
              <div className="space-y-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.border
                    }}
                  >
                    <div className="flex items-center">
                      <CheckCircle size={16} style={{ color: colors.accent.green }} className="mr-3" />
                    <div>
                      <div className="font-mono text-sm font-medium" style={{ color: colors.text }}>
                        {item.promoCode.code}
                      </div>
                      <div className="text-xs" style={{ color: colors.textSecondary }}>
                        {formatDate(item.usedAt)}
                      </div>
                    </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium" style={{ color: colors.tint }}>
                        +{item.promoCode.days}{t('promo_code.days_suffix')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle size={24} style={{ color: colors.textSecondary }} className="mx-auto mb-3" />
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  {t('promo_code.history_empty')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
