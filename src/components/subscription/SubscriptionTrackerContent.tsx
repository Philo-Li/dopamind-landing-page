'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useThemeColors } from '@/hooks/useThemeColor'
import { useLocalization } from '@/hooks/useLocalization'
import { useSubscriptionTracker } from '@/hooks/useSubscriptionTracker'
import { SubscriptionFormModal } from './SubscriptionFormModal'
import {
  CreditCard,
  Plus,
  Play,
  Pause,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Video,
  Music,
  FileText,
  Palette,
  Github,
  Cloud,
  Gamepad2,
  Shield,
  Star,
  TrendingUp,
  Calendar,
  X,
  Check
} from 'lucide-react'
import {
  SubscriptionTracker,
  BILLING_CYCLE_CONFIG,
  calculateNextBillingDate,
  getDaysUntilNextBilling,
  getAnnualCost,
  getCurrencyDisplay,
  formatPrice,
  calculateCostsByCurrency,
  CURRENCY_CONFIG,
  BASE_CURRENCY
} from '@/types/subscriptionTracker'

// 获取服务图标的工具函数
const getServiceIcon = (serviceName: string) => {
  const name = serviceName.toLowerCase();
  if (name.includes('netflix') || name.includes('爱奇艺') || name.includes('bilibili') || name.includes('优酷')) return Video;
  if (name.includes('spotify') || name.includes('apple music') || name.includes('网易云')) return Music;
  if (name.includes('office') || name.includes('word') || name.includes('excel')) return FileText;
  if (name.includes('adobe') || name.includes('photoshop') || name.includes('ai')) return Palette;
  if (name.includes('github') || name.includes('coding') || name.includes('gitlab')) return Github;
  if (name.includes('cloud') || name.includes('dropbox') || name.includes('icloud')) return Cloud;
  if (name.includes('game') || name.includes('steam') || name.includes('游戏')) return Gamepad2;
  if (name.includes('vpn') || name.includes('proxy')) return Shield;
  return Star;
};

// 获取服务图标的颜色
const getServiceIconColor = (serviceName: string): string => {
  const name = serviceName.toLowerCase();
  if (name.includes('netflix')) return '#E50914';
  if (name.includes('spotify')) return '#1DB954';
  if (name.includes('adobe')) return '#FF0000';
  if (name.includes('github')) return '#333333';
  if (name.includes('office')) return '#0078D4';
  if (name.includes('apple')) return '#007AFF';
  if (name.includes('google')) return '#4285F4';
  return '#6366F1'; // 默认紫色
};

// 单个订阅项组件
const SubscriptionItem = ({
  item,
  colors,
  t,
  locale,
  onEdit,
  onToggleStatus
}: {
  item: SubscriptionTracker;
  colors: any;
  t: (key: string, params?: any) => string;
  locale: string;
  onEdit: (subscription: SubscriptionTracker) => void;
  onToggleStatus: (id: number) => void;
}) => {
  const nextBillingDate = calculateNextBillingDate(item);
  const daysUntilBilling = getDaysUntilNextBilling(item);
  const annualCost = getAnnualCost(item);
  const currencyDisplay = getCurrencyDisplay(item.currency);
  const ServiceIcon = getServiceIcon(item.name);
  const serviceIconColor = getServiceIconColor(item.name);

  // 根据续费时间确定紧急程度和颜色
  const getUrgencyStatus = () => {
    if (!item.isActive) return { color: colors.textSecondary, label: t('subscription.status.paused'), bgColor: colors.textSecondary + '20' };
    if (daysUntilBilling <= 3) return { color: '#FF3B30', label: t('subscription.status.expiring_soon'), bgColor: '#FF3B3020' };
    if (daysUntilBilling <= 7) return { color: '#FF9500', label: t('subscription.status.expiring_week'), bgColor: '#FF950020' };
    if (daysUntilBilling <= 30) return { color: '#34C759', label: t('subscription.status.expiring_month'), bgColor: '#34C75920' };
    return { color: colors.textSecondary, label: t('subscription.status.normal'), bgColor: colors.textSecondary + '10' };
  };

  const urgencyStatus = getUrgencyStatus();

  return (
    <div
      className="mx-4 mb-3 bg-white rounded-xl shadow-sm border overflow-hidden"
      style={{
        backgroundColor: colors.card.background,
        borderColor: colors.card.border,
        opacity: item.isActive ? 1 : 0.7
      }}
    >
      {/* 顶部状态指示条 */}
      <div
        className="h-1 w-full"
        style={{ backgroundColor: item.isActive ? serviceIconColor : colors.textSecondary }}
      />

      {/* 紧凑的内容区域 */}
      <div className="p-4">
        {/* 主要信息行 */}
        <div className="flex items-start mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mr-3 border"
            style={{
              backgroundColor: serviceIconColor + '15',
              borderColor: serviceIconColor + '30'
            }}
          >
            <ServiceIcon
              size={20}
              color={serviceIconColor}
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <h3
                className="text-base font-bold truncate"
                style={{ color: colors.text }}
              >
                {item.name}
              </h3>
              <div
                className="px-2 py-1 rounded-lg"
                style={{ backgroundColor: urgencyStatus.bgColor }}
              >
                <span
                  className="text-xs font-semibold uppercase"
                  style={{ color: urgencyStatus.color }}
                >
                  {urgencyStatus.label}
                </span>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              <span
                className="text-sm font-semibold"
                style={{ color: colors.text }}
              >
                {currencyDisplay.flag} {formatPrice(item.price, item.currency)}
              </span>
              <div
                className="px-2 py-0.5 rounded-md"
                style={{ backgroundColor: BILLING_CYCLE_CONFIG[item.billingCycle].color + '15' }}
              >
                <span
                  className="text-xs font-semibold"
                  style={{ color: BILLING_CYCLE_CONFIG[item.billingCycle].color }}
                >
                  {t(`subscription.billing_cycles.${item.billingCycle}`)}
                </span>
              </div>
              <span
                className="text-xs"
                style={{ color: colors.textSecondary }}
              >
                {t('subscription.annual_equivalent', { amount: formatPrice(annualCost, item.currency) })}
              </span>
            </div>
          </div>

          {/* 编辑和状态切换按钮 - 完全按照移动端设计 */}
          <div className="flex gap-3 ml-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors active:scale-95"
              style={{
                backgroundColor: colors.accent.blue + '15',
                border: 'none'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                  stroke={colors.accent.blue}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"
                  stroke={colors.accent.blue}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(item.id);
              }}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors active:scale-95"
              style={{ backgroundColor: item.isActive ? '#FF950015' : '#34C75915' }}
            >
              {item.isActive ? (
                <Pause size={16} color="#FF9500" />
              ) : (
                <Play size={16} color="#34C759" />
              )}
            </button>
          </div>
        </div>

        {/* 续费信息（仅活跃订阅显示） */}
        {item.isActive && (
          <div
            className="px-3 py-2 rounded-lg"
            style={{ backgroundColor: urgencyStatus.bgColor }}
          >
            <p
              className="text-xs font-medium text-center"
              style={{ color: urgencyStatus.color }}
            >
              {daysUntilBilling > 0
                ? t('subscription.next_billing', {
                    days: t('subscription.days_until_billing', { days: daysUntilBilling }),
                    date: nextBillingDate.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')
                  })
                : t('subscription.next_billing_today', {
                    date: nextBillingDate.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')
                  })
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function SubscriptionTrackerContent() {
  const colors = useThemeColors()
  const { t, language } = useLocalization()
  const router = useRouter()

  // 使用真实的 hook 替代 mock 数据
  const {
    subscriptions,
    loading,
    refreshing,
    error,
    refreshSubscriptions,
    handleToggleStatus
  } = useSubscriptionTracker()

  const [isStatsExpanded, setIsStatsExpanded] = useState(false)
  const [displayCurrency, setDisplayCurrency] = useState(BASE_CURRENCY)
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false)
  const [isPullingState, setIsPullingState] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)

  // 弹窗状态管理
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingSubscriptionId, setEditingSubscriptionId] = useState<number | undefined>()

  // 处理下拉刷新
  const handleRefresh = useCallback(() => {
    refreshSubscriptions()
  }, [refreshSubscriptions])

  // Touch handling for pull-to-refresh
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    const scrollTop = e.currentTarget.scrollTop

    if (scrollTop === 0) {
      setIsPullingState(true);
      // Store initial touch position
      (e.currentTarget as HTMLElement).dataset.startY = touch.clientY.toString()
    }
  }, [setIsPullingState])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPullingState) return

    const touch = e.touches[0]
    const startY = parseFloat((e.currentTarget as HTMLElement).dataset.startY || '0')
    const currentY = touch.clientY
    const distance = Math.max(0, currentY - startY)

    setPullDistance(distance)

    // Add some resistance
    if (distance > 100) {
      e.preventDefault()
    }
  }, [isPullingState])

  const handleTouchEnd = useCallback(() => {
    if (isPullingState && pullDistance > 80) {
      handleRefresh()
    }

    setIsPullingState(false)
    setPullDistance(0)
  }, [isPullingState, pullDistance, handleRefresh])

  // 编辑订阅
  const handleEdit = useCallback((subscription: SubscriptionTracker) => {
    setEditingSubscriptionId(subscription.id)
    setShowFormModal(true)
  }, [])

  // 切换订阅状态的处理函数
  const onToggleStatus = useCallback(async (id: number) => {
    try {
      await handleToggleStatus(id)
      // 显示成功提示
      console.log('订阅状态切换成功')
    } catch (error) {
      console.error('切换订阅状态失败:', error)
      // 显示错误提示
      // TODO: 添加 toast 通知
    }
  }, [handleToggleStatus])

  // 添加订阅
  const handleAddSubscription = useCallback(() => {
    console.log('Add new subscription')
    setEditingSubscriptionId(undefined)
    setShowFormModal(true)
  }, [])

  // 处理加载错误
  const handleLoadError = useCallback(() => {
    console.log('重新加载订阅数据')
    refreshSubscriptions()
  }, [refreshSubscriptions])

  // 弹窗处理函数
  const handleModalClose = useCallback(() => {
    setShowFormModal(false)
    setEditingSubscriptionId(undefined)
  }, [])

  const handleModalSuccess = useCallback(() => {
    // 刷新订阅列表
    refreshSubscriptions()
  }, [refreshSubscriptions])

  // 计算统计信息（按货币分组 + 汇总）
  const {
    monthlyCosts,
    annualCosts,
    activeCount,
    totalMonthlyInBase,
    totalAnnualInBase,
    baseCurrency
  } = calculateCostsByCurrency(subscriptions, displayCurrency)

  // 货币选择器
  const handleCurrencySelect = (currency: string) => {
    setDisplayCurrency(currency)
    setShowCurrencyPicker(false)
  }

  // 渲染货币选择器
  const renderCurrencyPicker = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-2xl max-w-sm w-full max-h-96 overflow-hidden"
        style={{ backgroundColor: colors.card.background }}
      >
        <div
          className="flex items-center justify-between p-5 border-b"
          style={{ borderColor: colors.card.border }}
        >
          <h3
            className="text-lg font-semibold"
            style={{ color: colors.text }}
          >
            {t('subscription.select_display_currency')}
          </h3>
          <button
            onClick={() => setShowCurrencyPicker(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.textSecondary + '20' }}
          >
            <X size={16} color={colors.textSecondary} />
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {Object.entries(CURRENCY_CONFIG).map(([code, config]) => (
            <button
              key={code}
              onClick={() => handleCurrencySelect(code)}
              className="w-full flex items-center justify-between px-5 py-4 transition-colors border-b last:border-b-0"
              style={{
                backgroundColor: displayCurrency === code ? colors.accent.blue + '15' : 'transparent',
                borderColor: colors.card.border + '50'
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{config.flag}</span>
                <div className="text-left">
                  <div
                    className="font-semibold"
                    style={{ color: colors.text }}
                  >
                    {config.label}
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    {code}
                  </div>
                </div>
              </div>
              {displayCurrency === code && (
                <Check size={16} color={colors.accent.blue} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  // 渲染空状态
  const renderEmptyState = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <CreditCard size={64} color={colors.textSecondary} />
      <h3
        className="text-xl font-bold mt-4 mb-2"
        style={{ color: colors.text }}
      >
        {t('subscription.empty.title')}
      </h3>
      <p
        className="text-center mb-6"
        style={{ color: colors.textSecondary }}
      >
        {t('subscription.empty.subtitle')}
      </p>
      <button
        onClick={handleAddSubscription}
        className="flex items-center gap-2 px-6 py-3 rounded-full"
        style={{ backgroundColor: colors.accent.blue }}
      >
        <Plus size={20} color="white" />
        <span className="text-white font-semibold">
          {t('subscription.empty.add_button')}
        </span>
      </button>
    </div>
  )

  // 渲染错误状态
  const renderErrorState = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: colors.textSecondary + '20' }}
      >
        <X size={32} color={colors.textSecondary} />
      </div>
      <h3
        className="text-xl font-bold mb-2"
        style={{ color: colors.text }}
      >
        加载失败
      </h3>
      <p
        className="text-center mb-6"
        style={{ color: colors.textSecondary }}
      >
        无法加载订阅数据，请检查网络连接
      </p>
      <button
        onClick={handleLoadError}
        className="flex items-center gap-2 px-6 py-3 rounded-full border"
        style={{
          borderColor: colors.border,
          backgroundColor: colors.background
        }}
      >
        <span style={{ color: colors.text }}>重新加载</span>
      </button>
    </div>
  )

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: colors.accent.blue }}></div>
          <p style={{ color: colors.textSecondary }}>
            {t('subscription.loading')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 border-b h-16"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.border
        }}
      >
        <h1 className="text-xl font-semibold" style={{ color: colors.text }}>
          {t('subscription.title')}
        </h1>
        <button
          onClick={handleAddSubscription}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: colors.accent.blue }}
        >
          <Plus size={20} color="white" />
        </button>
      </div>

      {/* Content */}
      {showCurrencyPicker && renderCurrencyPicker()}

      <div
        className="flex-1 overflow-y-auto relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: isPullingState ? `translateY(${Math.min(pullDistance * 0.5, 50)}px)` : 'none',
          transition: isPullingState ? 'none' : 'transform 0.3s ease'
        }}
      >
        {/* Pull to refresh indicator */}
        {(refreshing || (isPullingState && pullDistance > 40)) && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full shadow-lg"
              style={{
                backgroundColor: colors.card.background,
                borderColor: colors.border,
                border: `1px solid ${colors.border}`,
                opacity: isPullingState ? Math.min(pullDistance / 80, 1) : 1
              }}
            >
              <div
                className={`rounded-full h-4 w-4 border-b-2 ${refreshing ? 'animate-spin' : ''}`}
                style={{
                  borderColor: colors.accent.blue,
                  transform: isPullingState && !refreshing ? `rotate(${pullDistance * 2}deg)` : 'none'
                }}
              ></div>
              <span className="text-sm" style={{ color: colors.text }}>
                {refreshing ? '刷新中...' : isPullingState && pullDistance > 80 ? '松开刷新' : '下拉刷新'}
              </span>
            </div>
          </div>
        )}

        {error && subscriptions.length === 0 ? renderErrorState() :
         subscriptions.length === 0 && !loading ? renderEmptyState() : (
          <>
            {/* Statistics Card */}
            {activeCount > 0 && (
              <div
                className="mx-4 mt-4 mb-2 p-5 rounded-2xl border shadow-lg"
                style={{
                  backgroundColor: colors.card.background,
                  borderColor: colors.card.border,
                  boxShadow: `0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)`
                }}
              >
                {/* 顶部标题区域 */}
                <div className="flex items-start justify-between mb-5">
                  <button
                    onClick={() => setIsStatsExpanded(!isStatsExpanded)}
                    className="flex items-center flex-1 mr-3"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                      style={{ backgroundColor: colors.accent.blue + '15' }}
                    >
                      <BarChart3 size={18} color={colors.accent.blue} />
                    </div>
                    <div className="flex-1 text-left">
                      <h2
                        className="text-lg font-bold"
                        style={{ color: colors.text }}
                      >
                        {t('subscription.stats_title')}
                      </h2>
                      <p
                        className="text-sm"
                        style={{ color: colors.textSecondary }}
                      >
                        {t('subscription.active_subscriptions', { count: activeCount })}
                      </p>
                    </div>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.card.border + '30' }}
                    >
                      {isStatsExpanded ? (
                        <ChevronUp size={14} color={colors.textSecondary} />
                      ) : (
                        <ChevronDown size={14} color={colors.textSecondary} />
                      )}
                    </div>
                  </button>

                  {/* 货币选择器按钮 */}
                  <button
                    onClick={() => setShowCurrencyPicker(true)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full border"
                    style={{
                      backgroundColor: colors.accent.purple + '15',
                      borderColor: colors.accent.purple + '30'
                    }}
                  >
                    <span className="text-base">
                      {getCurrencyDisplay(displayCurrency).flag}
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: colors.accent.purple }}
                    >
                      {displayCurrency}
                    </span>
                    <ChevronDown size={12} color={colors.accent.purple} />
                  </button>
                </div>

                {/* 主要统计卡片 */}
                <div className="flex gap-3 mb-6">
                  <div
                    className="flex-1 p-4 rounded-xl border"
                    style={{
                      backgroundColor: colors.accent.blue + '10',
                      borderColor: colors.accent.blue + '20',
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center mb-3"
                      style={{ backgroundColor: colors.accent.blue }}
                    >
                      <Calendar size={16} color="white" />
                    </div>
                    <p
                      className="text-xs font-semibold uppercase tracking-wide mb-1"
                      style={{ color: colors.textSecondary }}
                    >
                      {t('subscription.monthly_cost')}
                    </p>
                    <p
                      className="text-lg font-bold"
                      style={{ color: colors.accent.blue }}
                    >
                      {getCurrencyDisplay(baseCurrency).flag} {formatPrice(totalMonthlyInBase, baseCurrency)}
                    </p>
                  </div>

                  <div
                    className="flex-1 p-4 rounded-xl border"
                    style={{
                      backgroundColor: colors.accent.mint + '10',
                      borderColor: colors.accent.mint + '20',
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center mb-3"
                      style={{ backgroundColor: colors.accent.mint }}
                    >
                      <TrendingUp size={16} color="white" />
                    </div>
                    <p
                      className="text-xs font-semibold uppercase tracking-wide mb-1"
                      style={{ color: colors.textSecondary }}
                    >
                      {t('subscription.annual_cost')}
                    </p>
                    <p
                      className="text-lg font-bold"
                      style={{ color: colors.accent.mint }}
                    >
                      {getCurrencyDisplay(baseCurrency).flag} {formatPrice(totalAnnualInBase, baseCurrency)}
                    </p>
                  </div>
                </div>

                {/* 货币分组详情 */}
                {isStatsExpanded && (
                  <div className="border-t pt-4" style={{ borderColor: colors.card.border }}>
                    <h4
                      className="text-base font-semibold mb-4"
                      style={{ color: colors.text }}
                    >
                      {t('subscription.currency_breakdown')}
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <p
                          className="text-sm font-semibold uppercase tracking-wide mb-2"
                          style={{ color: colors.textSecondary }}
                        >
                          {t('subscription.monthly_cost')}
                        </p>
                        <div className="space-y-2">
                          {Object.entries(monthlyCosts).map(([currency, amount]) => {
                            const display = getCurrencyDisplay(currency);
                            return (
                              <div
                                key={`monthly-${currency}`}
                                className="flex items-center justify-between p-3 rounded-lg border"
                                style={{
                                  backgroundColor: colors.background,
                                  borderColor: colors.card.border,
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-lg">{display.flag}</span>
                                  <span
                                    className="font-semibold"
                                    style={{ color: colors.text }}
                                  >
                                    {formatPrice(amount, currency)}
                                  </span>
                                </div>
                                <span
                                  className="text-sm"
                                  style={{ color: colors.textSecondary }}
                                >
                                  {display.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <p
                          className="text-sm font-semibold uppercase tracking-wide mb-2"
                          style={{ color: colors.textSecondary }}
                        >
                          {t('subscription.annual_cost')}
                        </p>
                        <div className="space-y-2">
                          {Object.entries(annualCosts).map(([currency, amount]) => {
                            const display = getCurrencyDisplay(currency);
                            return (
                              <div
                                key={`annual-${currency}`}
                                className="flex items-center justify-between p-3 rounded-lg border"
                                style={{
                                  backgroundColor: colors.background,
                                  borderColor: colors.card.border,
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-lg">{display.flag}</span>
                                  <span
                                    className="font-semibold"
                                    style={{ color: colors.text }}
                                  >
                                    {formatPrice(amount, currency)}
                                  </span>
                                </div>
                                <span
                                  className="text-sm"
                                  style={{ color: colors.textSecondary }}
                                >
                                  {display.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 底部说明 */}
                {isStatsExpanded && (
                  <div
                    className="flex items-center justify-center gap-2 p-3 rounded-lg mt-4"
                    style={{ backgroundColor: colors.background }}
                  >
                    <div
                      className="w-3 h-3 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.accent.blue }}
                    >
                      <span className="text-xs text-white">i</span>
                    </div>
                    <p
                      className="text-xs font-medium"
                      style={{ color: colors.textSecondary }}
                    >
                      {t('subscription.cost_converted_note', { currency: getCurrencyDisplay(baseCurrency).label })}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Subscription List */}
            <div className="pb-4">
              {subscriptions.map((item) => (
                <SubscriptionItem
                  key={item.id}
                  item={item}
                  colors={colors}
                  t={t}
                  locale={language || 'en'}
                  onEdit={handleEdit}
                  onToggleStatus={onToggleStatus}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* 订阅表单弹窗 */}
      <SubscriptionFormModal
        isOpen={showFormModal}
        onClose={handleModalClose}
        subscriptionId={editingSubscriptionId}
        onSuccess={handleModalSuccess}
      />
    </div>
  )
}