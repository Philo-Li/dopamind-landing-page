'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useThemeColors } from '@/hooks/useThemeColor'
import { useLocalization } from '@/hooks/useLocalization'
import { useToast } from '@/contexts/ToastContext'
import { Link, Copy, Share2, Code, Trophy, Gift, Info } from 'lucide-react'
import { referralApi } from '@/lib/api'

interface ReferralInfo {
  referralCode: string
  referralLink: string
  creditDays: number
  referredUsers: Array<{
    id: number
    nickname: string
    email: string
    createdAt: string
  }>
  totalReferrals: number
}

export default function ReferralContent() {
  const colors = useThemeColors()
  const router = useRouter()
  const { t } = useLocalization()
  const { showSuccess, showError } = useToast()

  const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSharing, setIsSharing] = useState(false)

  const loadReferralInfo = useCallback(async () => {
    try {
      console.log('[Referral] 开始加载推荐信息')
      setIsLoading(true)
      const response = await referralApi.getReferralInfo()

      console.log('[Referral] API 响应:', response)

      if (response.success && response.data) {
        console.log('[Referral] 推荐信息加载成功:', response.data)
        // 直接使用后端返回的数据结构
        setReferralInfo(response.data as ReferralInfo)
      } else {
        console.error('[Referral] 推荐信息加载失败:', response.error)
        showError('加载失败', (response.error as any)?.message || response.error || '加载推荐信息失败，请重试')
      }
    } catch (error: any) {
      console.error('[Referral] 加载推荐信息异常:', error)
      showError('网络错误', error?.response?.data?.error || '无法加载推荐信息，请检查网络连接')
    } finally {
      console.log('[Referral] 加载完成，设置 loading 为 false')
      setIsLoading(false)
    }
  }, [showError])

  useEffect(() => {
    loadReferralInfo()
  }, [loadReferralInfo])

  const handleShare = async () => {
    if (!referralInfo?.referralLink) return

    try {
      setIsSharing(true)

      if (navigator.share) {
        await navigator.share({
          title: '邀请你加入 Dopamind',
          text: '一起来体验专注学习的乐趣吧！',
          url: referralInfo.referralLink
        })
        showSuccess('分享成功')
      } else {
        // 如果不支持 Web Share API，则复制到剪贴板
        await navigator.clipboard.writeText(referralInfo.referralLink)
        showSuccess('链接已复制', '分享链接已复制到剪贴板')
      }
    } catch (error) {
      console.error('分享失败:', error)
      showError('分享失败', '请重试')
    } finally {
      setIsSharing(false)
    }
  }

  const handleCopyLink = async () => {
    if (!referralInfo?.referralLink) return

    try {
      await navigator.clipboard.writeText(referralInfo.referralLink)
      showSuccess('链接已复制', '分享链接已复制到剪贴板')
    } catch (error) {
      console.error('复制失败:', error)
      showError('复制失败', '请重试')
    }
  }

  const handleCopyCode = async () => {
    if (!referralInfo?.referralCode) return

    try {
      await navigator.clipboard.writeText(referralInfo.referralCode)
      showSuccess('推荐码已复制', '推荐码已复制到剪贴板')
    } catch (error) {
      console.error('复制推荐码失败:', error)
      showError('复制失败', '请重试')
    }
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="animate-pulse text-lg" style={{ color: colors.textSecondary }}>
          加载中...
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: colors.background }}>
      {/* Header with title */}
      <div
        className="flex items-center justify-between px-6 border-b h-[64px]"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.border
        }}
      >
        <h1 className="text-xl font-semibold" style={{ color: colors.text }}>
          {t('referral.title')}
        </h1>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          {/* 副标题 */}
          <div className="text-center mb-6">
            <p className="text-base leading-6" style={{ color: colors.textSecondary }}>
              {t('referral.subtitle')}
            </p>
          </div>

          {/* 推荐链接卡片 */}
          <div
            className="p-6 rounded-2xl border shadow-sm mb-4"
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
                <Link size={20} style={{ color: colors.tint }} />
              </div>
              <h2 className="text-lg font-bold" style={{ color: colors.text }}>
                {t('referral.link_title')}
              </h2>
            </div>

            <div
              className="p-3 rounded-lg border mb-4"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.border
              }}
            >
              <p className="text-sm font-mono break-all" style={{ color: colors.tint }}>
                {referralInfo?.referralLink || t('referral.loading')}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors"
                style={{ backgroundColor: colors.tint, color: 'white' }}
                onClick={handleShare}
                disabled={isSharing}
              >
                {isSharing ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Share2 size={16} />
                )}
                {t('referral.share_link')}
              </button>

              <button
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border font-medium transition-colors"
                style={{
                  borderColor: colors.tint,
                  color: colors.tint,
                  backgroundColor: 'transparent'
                }}
                onClick={handleCopyLink}
              >
                <Copy size={16} />
                {t('referral.copy_link')}
              </button>
            </div>
          </div>

          {/* 推荐码卡片 */}
          <div
            className="p-6 rounded-2xl border shadow-sm mb-4"
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
                <Code size={20} style={{ color: colors.tint }} />
              </div>
              <h2 className="text-lg font-bold" style={{ color: colors.text }}>
                {t('referral.code_title')}
              </h2>
            </div>

            <div
              className="p-4 rounded-lg border mb-4 text-center"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.border
              }}
            >
              <p className="text-2xl font-bold font-mono tracking-wider" style={{ color: colors.tint }}>
                {referralInfo?.referralCode || t('referral.loading')}
              </p>
            </div>

            <button
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border font-medium transition-colors"
              style={{
                borderColor: colors.tint,
                color: colors.tint,
                backgroundColor: 'transparent'
              }}
              onClick={handleCopyCode}
            >
              <Copy size={16} />
              {t('referral.copy_code')}
            </button>
          </div>

          {/* 推荐成果统计 */}
          <div
            className="p-6 rounded-2xl border shadow-sm mb-4"
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
                <Trophy size={20} style={{ color: colors.tint }} />
              </div>
              <h2 className="text-lg font-bold" style={{ color: colors.text }}>
                {t('referral.results_title')}
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center py-3">
                <div className="text-2xl font-bold mb-1" style={{ color: colors.text }}>
                  {referralInfo?.totalReferrals || 0}
                </div>
                <div className="text-xs leading-4 font-medium" style={{ color: colors.textSecondary }}>
                  {t('referral.successful_referrals')}
                </div>
              </div>

              <div className="text-center py-3">
                <div className="text-2xl font-bold mb-1" style={{ color: colors.text }}>
                  {(referralInfo?.totalReferrals || 0) * 7}
                </div>
                <div className="text-xs leading-4 font-medium" style={{ color: colors.textSecondary }}>
                  {t('referral.total_days_earned')}
                </div>
              </div>

              <div className="text-center py-3">
                <div className="text-2xl font-bold mb-1" style={{ color: colors.text }}>
                  {referralInfo?.creditDays || 0}
                </div>
                <div className="text-xs leading-4 font-medium" style={{ color: colors.textSecondary }}>
                  {t('referral.available_days')}
                </div>
              </div>
            </div>
          </div>

          {/* 使用说明 */}
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
                <Info size={20} style={{ color: colors.tint }} />
              </div>
              <h2 className="text-lg font-bold" style={{ color: colors.text }}>
                {t('referral.instructions_title')}
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
                  {t('referral.instructions.step1')}
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
                  {t('referral.instructions.step2')}
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
                  {t('referral.instructions.step3')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
