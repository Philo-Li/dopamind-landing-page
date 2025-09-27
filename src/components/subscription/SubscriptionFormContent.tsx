'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useThemeColors } from '@/hooks/useThemeColor'
import { useLocalization } from '@/hooks/useLocalization'
import {
  ArrowLeft,
  Check,
  Calendar,
  ChevronDown,
  Trash2,
  Loader2
} from 'lucide-react'
import {
  getSubscription,
  createSubscription,
  updateSubscription,
  deleteSubscription
} from '@/services/subscriptionTrackerService'
import {
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  CURRENCY_CONFIG,
  BILLING_CYCLE_CONFIG,
  getCurrencyDisplay,
  SubscriptionTracker
} from '@/types/subscriptionTracker'

interface FormData {
  name: string
  price: string
  currency: string
  billingCycle: 'monthly' | 'yearly'
  startDate: string
  notes: string
}

export default function SubscriptionFormContent() {
  const colors = useThemeColors()
  const { t } = useLocalization()
  const router = useRouter()
  const searchParams = useSearchParams()
  const subscriptionId = searchParams.get('id')
  const isEditing = Boolean(subscriptionId)

  // 状态管理
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: '',
    currency: 'CNY',
    billingCycle: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    notes: ''
  })

  // 加载订阅数据（编辑模式）
  useEffect(() => {
    const loadSubscription = async () => {
      if (!subscriptionId) return

      setLoading(true)
      try {
        const subscription = await getSubscription(parseInt(subscriptionId))

        setFormData({
          name: subscription.name,
          price: subscription.price.toString(),
          currency: subscription.currency,
          billingCycle: subscription.billingCycle,
          startDate: subscription.startDate,
          notes: subscription.notes || ''
        })
      } catch (error: any) {
        console.error('加载订阅失败:', error)
        setError(t('subscription.form.load_failed_desc'))
        // 延迟返回，让用户看到错误消息
        setTimeout(() => router.back(), 2000)
      } finally {
        setLoading(false)
      }
    }

    if (isEditing && subscriptionId) {
      loadSubscription()
    }
  }, [isEditing, subscriptionId, router, t])

  // 表单验证
  const validateForm = (): boolean => {
    setError(null)

    if (!formData.name.trim()) {
      setError(t('subscription.form.name_required'))
      return false
    }

    const price = parseFloat(formData.price)
    if (isNaN(price) || price <= 0) {
      setError(t('subscription.form.price_invalid'))
      return false
    }

    if (!formData.startDate) {
      setError(t('subscription.form.date_invalid'))
      return false
    }

    return true
  }

  // 保存订阅
  const handleSave = async () => {
    if (!validateForm()) return

    setSaving(true)
    setError(null)

    try {
      const price = parseFloat(formData.price)

      if (isEditing && subscriptionId) {
        // 更新现有订阅
        const updateData: UpdateSubscriptionRequest = {
          name: formData.name.trim(),
          price,
          currency: formData.currency,
          billingCycle: formData.billingCycle,
          startDate: formData.startDate,
          notes: formData.notes.trim() || undefined
        }

        await updateSubscription(parseInt(subscriptionId), updateData)
        console.log(t('subscription.form.update_success'))
      } else {
        // 创建新订阅
        const createData: CreateSubscriptionRequest = {
          name: formData.name.trim(),
          price,
          currency: formData.currency,
          billingCycle: formData.billingCycle,
          startDate: formData.startDate,
          notes: formData.notes.trim() || undefined
        }

        await createSubscription(createData)
        console.log(t('subscription.form.create_success'))
      }

      router.back()
    } catch (error: any) {
      console.error('保存订阅失败:', error)
      setError(isEditing ? t('subscription.form.update_error') : t('subscription.form.create_error'))
    } finally {
      setSaving(false)
    }
  }

  // 删除订阅
  const handleDelete = () => {
    if (!isEditing || !subscriptionId) return
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    setShowDeleteDialog(false)
    if (!subscriptionId) return

    setSaving(true)
    setError(null)

    try {
      await deleteSubscription(parseInt(subscriptionId))
      console.log(t('subscription.form.delete_success'))
      router.back()
    } catch (error: any) {
      console.error('删除订阅失败:', error)
      setError(t('subscription.form.delete_error'))
    } finally {
      setSaving(false)
    }
  }

  // 货币选择器组件
  const CurrencyPicker = () => (
    <div className="mb-6">
      <label className="block text-base font-semibold mb-3" style={{ color: colors.text }}>
        {t('subscription.form.currency_type')}
      </label>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.entries(CURRENCY_CONFIG).map(([code, config]) => (
          <button
            key={code}
            type="button"
            className="flex flex-col items-center p-3 rounded-lg border min-w-[80px] transition-colors"
            style={{
              backgroundColor: formData.currency === code ? colors.accent.blue : colors.card.background,
              borderColor: colors.card.border
            }}
            onClick={() => setFormData(prev => ({ ...prev, currency: code }))}
          >
            <span className="text-xl mb-1">{config.flag}</span>
            <span
              className="text-sm font-semibold mb-0.5"
              style={{
                color: formData.currency === code ? 'white' : colors.text
              }}
            >
              {code}
            </span>
            <span
              className="text-xs"
              style={{
                color: formData.currency === code ? 'white' : colors.textSecondary
              }}
            >
              {config.symbol}
            </span>
          </button>
        ))}
      </div>
    </div>
  )

  // 计费周期选择器组件
  const BillingCyclePicker = () => (
    <div className="mb-6">
      <label className="block text-base font-semibold mb-3" style={{ color: colors.text }}>
        {t('subscription.form.billing_cycle')}
      </label>
      <div className="flex gap-3">
        {Object.entries(BILLING_CYCLE_CONFIG).map(([cycle, config]) => (
          <button
            key={cycle}
            type="button"
            className="flex-1 py-4 px-4 rounded-lg border transition-colors"
            style={{
              backgroundColor: formData.billingCycle === cycle ? colors.accent.blue : colors.card.background,
              borderColor: colors.card.border
            }}
            onClick={() => setFormData(prev => ({ ...prev, billingCycle: cycle as 'monthly' | 'yearly' }))}
          >
            <span
              className="text-base font-semibold"
              style={{
                color: formData.billingCycle === cycle ? 'white' : colors.text
              }}
            >
              {t(`subscription.billing_cycles.${cycle}`)}
            </span>
          </button>
        ))}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={32} color={colors.accent.blue} />
          <p style={{ color: colors.textSecondary }}>
            {t('subscription.form.loading')}
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
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: colors.card.background }}
        >
          <ArrowLeft size={20} color={colors.text} />
        </button>

        <h1 className="text-lg font-semibold" style={{ color: colors.text }}>
          {isEditing ? t('subscription.form.edit_title') : t('subscription.form.add_title')}
        </h1>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors"
          style={{
            backgroundColor: colors.accent.blue,
            opacity: saving ? 0.6 : 1
          }}
        >
          {saving ? (
            <Loader2 size={16} color="white" className="animate-spin" />
          ) : (
            <Check size={16} color="white" />
          )}
          {isEditing && (
            <span className="text-white text-sm font-semibold">
              {t('subscription.form.update')}
            </span>
          )}
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* 错误提示 */}
          {error && (
            <div
              className="p-4 rounded-lg border-l-4"
              style={{
                backgroundColor: '#FEF2F2',
                borderLeftColor: '#EF4444',
                borderColor: '#FECACA'
              }}
            >
              <p className="text-sm font-medium" style={{ color: '#DC2626' }}>
                {error}
              </p>
            </div>
          )}
          {/* 订阅名称 */}
          <div>
            <label className="block text-base font-semibold mb-3" style={{ color: colors.text }}>
              {t('subscription.form.name_label')}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder={t('subscription.form.name_placeholder')}
              maxLength={50}
              className="w-full p-3 rounded-lg border outline-none"
              style={{
                backgroundColor: colors.card.background,
                borderColor: colors.card.border,
                color: colors.text
              }}
            />
          </div>

          {/* 价格 */}
          <div>
            <label className="block text-base font-semibold mb-3" style={{ color: colors.text }}>
              {t('subscription.form.price_label')}
            </label>
            <div className="flex items-center gap-2">
              <span
                className="text-lg font-semibold"
                style={{ color: colors.textSecondary }}
              >
                {getCurrencyDisplay(formData.currency).symbol}
              </span>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0.00"
                className="flex-1 p-3 rounded-lg border outline-none"
                style={{
                  backgroundColor: colors.card.background,
                  borderColor: colors.card.border,
                  color: colors.text
                }}
              />
            </div>
          </div>

          {/* 货币选择 */}
          <CurrencyPicker />

          {/* 计费周期 */}
          <BillingCyclePicker />

          {/* 开始日期 */}
          <div>
            <label className="block text-base font-semibold mb-3" style={{ color: colors.text }}>
              {t('subscription.form.start_date_label')}
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full p-3 rounded-lg border outline-none"
                style={{
                  backgroundColor: colors.card.background,
                  borderColor: colors.card.border,
                  color: colors.text
                }}
              />
            </div>
            <p className="text-xs mt-2 italic" style={{ color: colors.textSecondary }}>
              {t('subscription.form.date_hint')}
            </p>
          </div>

          {/* 备注 */}
          <div>
            <label className="block text-base font-semibold mb-3" style={{ color: colors.text }}>
              {t('subscription.form.notes_label')}
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder={t('subscription.form.notes_placeholder')}
              maxLength={200}
              rows={3}
              className="w-full p-3 rounded-lg border outline-none resize-none"
              style={{
                backgroundColor: colors.card.background,
                borderColor: colors.card.border,
                color: colors.text
              }}
            />
          </div>

          {/* 保存按钮 */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-xl transition-colors"
            style={{
              backgroundColor: colors.accent.blue,
              opacity: saving ? 0.6 : 1
            }}
          >
            {saving ? (
              <Loader2 size={20} color="white" className="animate-spin" />
            ) : (
              <Check size={20} color="white" />
            )}
            <span className="text-white text-lg font-bold">
              {saving
                ? t('subscription.form.saving')
                : (isEditing ? t('subscription.form.update_subscription') : t('subscription.form.create_subscription'))
              }
            </span>
          </button>

          {/* 删除按钮 - 仅在编辑模式下显示 */}
          {isEditing && (
            <button
              onClick={handleDelete}
              disabled={saving}
              className="w-full flex items-center justify-center gap-3 p-4 rounded-xl border transition-colors"
              style={{
                borderColor: '#FF3B30',
                backgroundColor: colors.background,
                opacity: saving ? 0.6 : 1
              }}
            >
              <Trash2 size={18} color="#FF3B30" />
              <span className="text-base font-semibold" style={{ color: '#FF3B30' }}>
                {t('subscription.form.delete_subscription')}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* 删除确认对话框 */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="rounded-2xl max-w-sm w-full p-6"
            style={{ backgroundColor: colors.card.background }}
          >
            <h3 className="text-lg font-bold mb-2" style={{ color: colors.text }}>
              {t('subscription.form.delete_confirm_title')}
            </h3>
            <p className="mb-6" style={{ color: colors.textSecondary }}>
              {t('subscription.form.delete_confirm_message', { name: formData.name })}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 py-3 px-4 rounded-xl border"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  color: colors.text
                }}
              >
                {t('subscription.form.cancel')}
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 px-4 rounded-xl"
                style={{ backgroundColor: '#FF3B30', color: 'white' }}
              >
                {t('subscription.form.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
