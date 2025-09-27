'use client'

import { useState, useEffect } from 'react'
import { useThemeColors } from '@/hooks/useThemeColor'
import { useLocalization } from '@/hooks/useLocalization'
import { ThemedView, ThemedText, ThemedButton } from '@/components/themed/ThemedComponents'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DateTimeSelector } from '@/components/ui/DateTimeSelector'
import {
  X,
  Check,
  Trash2,
  Loader2,
  Calendar,
  ChevronLeft,
  ChevronRight
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

interface SubscriptionFormModalProps {
  isOpen: boolean
  onClose: () => void
  subscriptionId?: number // 如果提供则为编辑模式
  onSuccess: () => void // 成功后的回调，用于刷新列表
}

export function SubscriptionFormModal({
  isOpen,
  onClose,
  subscriptionId,
  onSuccess
}: SubscriptionFormModalProps) {
  const colors = useThemeColors()
  const { t } = useLocalization()
  const isEditing = Boolean(subscriptionId)

  // 状态管理
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: '',
    currency: 'CNY',
    billingCycle: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    notes: ''
  })

  // For DateTimeSelector component
  const [startTime, setStartTime] = useState('')

  // 重置表单
  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      currency: 'CNY',
      billingCycle: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      notes: ''
    })
    setStartTime('')
    setError(null)
    setLoading(false)
    setSaving(false)
    setShowDeleteDialog(false)
  }

  // 加载订阅数据（编辑模式）
  useEffect(() => {
    const loadSubscription = async () => {
      if (!subscriptionId || !isOpen) return

      setLoading(true)
      setError(null)

      try {
        const subscription = await getSubscription(subscriptionId)

        // 确保日期格式正确转换为 YYYY-MM-DD
        const startDate = subscription.startDate.includes('T')
          ? subscription.startDate.split('T')[0]  // 如果是ISO格式，取日期部分
          : subscription.startDate // 如果已经是YYYY-MM-DD格式

        setFormData({
          name: subscription.name,
          price: subscription.price.toString(),
          currency: subscription.currency,
          billingCycle: subscription.billingCycle,
          startDate: startDate,
          notes: subscription.notes || ''
        })
        setStartTime('')
      } catch (error: any) {
        console.error('加载订阅失败:', error)
        setError(t('subscription.form.load_failed_desc'))
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      if (isEditing) {
        loadSubscription()
      } else {
        resetForm()
      }
    }
  }, [isOpen, subscriptionId, isEditing, t])

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
        const updateData: UpdateSubscriptionRequest = {
          name: formData.name.trim(),
          price,
          currency: formData.currency,
          billingCycle: formData.billingCycle,
          startDate: formData.startDate,
          notes: formData.notes.trim() || undefined
        }
        await updateSubscription(subscriptionId, updateData)
      } else {
        const createData: CreateSubscriptionRequest = {
          name: formData.name.trim(),
          price,
          currency: formData.currency,
          billingCycle: formData.billingCycle,
          startDate: formData.startDate,
          notes: formData.notes.trim() || undefined
        }
        await createSubscription(createData)
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('保存订阅失败:', error)
      setError(isEditing ? t('subscription.form.update_error') : t('subscription.form.create_error'))
    } finally {
      setSaving(false)
    }
  }

  // 处理日期时间变化
  const handleDateChange = (date: string) => {
    setFormData(prev => ({ ...prev, startDate: date }))
  }

  const handleTimeChange = (time: string) => {
    setStartTime(time)
  }

  // 删除订阅
  const handleDelete = () => {
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    setShowDeleteDialog(false)
    if (!subscriptionId) return

    setSaving(true)
    setError(null)

    try {
      await deleteSubscription(subscriptionId)
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('删除订阅失败:', error)
      setError(t('subscription.form.delete_error'))
    } finally {
      setSaving(false)
    }
  }

  // 货币选择器组件
  const CurrencyPicker = () => (
    <div className="space-y-4">
      <ThemedText className="text-sm font-semibold">
        {t('subscription.form.currency_type')}
      </ThemedText>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {Object.entries(CURRENCY_CONFIG).map(([code, config]) => (
          <ThemedButton
            key={code}
            variant={formData.currency === code ? 'primary' : 'secondary'}
            size="sm"
            className="flex flex-col items-center p-3 min-w-[80px] h-auto space-y-1 transition-all duration-200 hover:scale-105"
            onClick={() => setFormData(prev => ({ ...prev, currency: code }))}
          >
            <span className="text-xl">{config.flag}</span>
            <span className="text-xs font-semibold">
              {code}
            </span>
            <span className="text-xs opacity-80">
              {config.symbol}
            </span>
          </ThemedButton>
        ))}
      </div>
    </div>
  )

  // 计费周期选择器组件
  const BillingCyclePicker = () => (
    <div className="space-y-4">
      <ThemedText className="text-sm font-semibold">
        {t('subscription.form.billing_cycle')}
      </ThemedText>
      <div className="flex gap-3">
        {Object.entries(BILLING_CYCLE_CONFIG).map(([cycle, config]) => (
          <ThemedButton
            key={cycle}
            variant={formData.billingCycle === cycle ? 'primary' : 'secondary'}
            size="md"
            className="flex-1 py-4 transition-all duration-200 hover:scale-105"
            onClick={() => setFormData(prev => ({ ...prev, billingCycle: cycle as 'monthly' | 'yearly' }))}
          >
            <ThemedText className="font-semibold">
              {t(`subscription.billing_cycles.${cycle}`)}
            </ThemedText>
          </ThemedButton>
        ))}
      </div>
    </div>
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200">
      <ThemedView
        variant="card"
        className="rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-8 duration-300"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: colors.border }}
        >
          <ThemedText type="title" className="text-xl">
            {isEditing ? t('subscription.form.edit_title') : t('subscription.form.add_title')}
          </ThemedText>
          <ThemedButton
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-10 h-10 rounded-full p-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={18} color={colors.textSecondary} />
          </ThemedButton>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin mr-3" size={24} color={colors.accent.blue} />
              <ThemedText variant="secondary">
                {t('subscription.form.loading')}
              </ThemedText>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 错误提示 */}
              {error && (
                <ThemedView
                  className="p-4 rounded-xl border-l-4 animate-in slide-in-from-left-2 duration-300"
                  style={{
                    backgroundColor: colors.card.background,
                    borderLeftColor: '#EF4444',
                    borderColor: '#FECACA',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  }}
                >
                  <ThemedText className="text-sm font-medium text-red-600 dark:text-red-400">
                    {error}
                  </ThemedText>
                </ThemedView>
              )}

              {/* 订阅名称 */}
              <div className="space-y-3">
                <ThemedText className="text-sm font-semibold">
                  {t('subscription.form.name_label')}
                </ThemedText>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={t('subscription.form.name_placeholder')}
                  maxLength={50}
                  className="w-full p-3 rounded-xl border-2 focus:border-blue-500 transition-colors"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                />
              </div>

              {/* 价格和货币 */}
              <div className="space-y-3">
                <ThemedText className="text-sm font-semibold">
                  {t('subscription.form.price_label')}
                </ThemedText>
                <div className="flex gap-3 items-center">
                  {/* 货币选择下拉框 */}
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-28 h-12 p-3 rounded-xl border-2 outline-none focus:border-blue-500 transition-colors"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text
                    }}
                  >
                    {Object.entries(CURRENCY_CONFIG).map(([code, config]) => (
                      <option key={code} value={code}>
                        {config.flag} {code}
                      </option>
                    ))}
                  </select>

                  {/* 价格输入框 */}
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                    className="flex-1 h-12 p-3 rounded-xl border-2 focus:border-blue-500 transition-colors"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text
                    }}
                  />
                </div>
              </div>

              {/* 计费周期 */}
              <BillingCyclePicker />

              {/* 开始日期 */}
              <div className="space-y-3">
                <ThemedText className="text-sm font-semibold">
                  {t('subscription.form.start_date_label')}
                </ThemedText>
                <DateTimeSelector
                  dueDate={formData.startDate}
                  dueTime={startTime}
                  onDateChange={handleDateChange}
                  onTimeChange={handleTimeChange}
                  disabled={saving}
                  dateOnly={true}
                  showOptionalText={false}
                  dateLabel=""
                  customStyles={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    textColor: colors.text
                  }}
                />
              </div>

              {/* 备注 */}
              <div className="space-y-3">
                <ThemedText className="text-sm font-semibold">
                  {t('subscription.form.notes_label')}
                </ThemedText>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder={t('subscription.form.notes_placeholder')}
                  maxLength={200}
                  rows={3}
                  className="w-full p-3 rounded-xl border-2 outline-none resize-none focus:border-blue-500 transition-colors"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                />
                <ThemedText variant="muted" className="text-xs text-right">
                  {formData.notes.length}/200
                </ThemedText>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <ThemedView
          className="p-6 border-t backdrop-blur-sm"
          style={{ borderColor: colors.border }}
        >
          <div className="flex gap-4">
            {/* 删除按钮 - 仅在编辑模式下显示 */}
            {isEditing && (
              <ThemedButton
                variant="ghost"
                onClick={handleDelete}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border hover:border-red-400 transition-all duration-200 group shadow-sm hover:shadow-md"
                style={{
                  backgroundColor: saving ? colors.button.disabled : 'rgba(255, 59, 48, 0.1)',
                  borderColor: '#FF3B30',
                }}
              >
                <Trash2 size={16} className="text-red-600 group-hover:text-red-700 transition-colors" style={{ color: '#FF3B30' }} />
                <ThemedText className="text-sm font-semibold transition-colors" style={{ color: '#FF3B30' }}>
                  {t('subscription.form.delete')}
                </ThemedText>
              </ThemedButton>
            )}

            <div className="flex-1" />

            {/* 取消按钮 */}
            <ThemedButton
              variant="secondary"
              onClick={onClose}
              disabled={saving}
              className="px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <ThemedText className="font-semibold">
                {t('common.cancel')}
              </ThemedText>
            </ThemedButton>

            {/* 保存按钮 */}
            <ThemedButton
              variant="primary"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
            >
              {saving ? (
                <Loader2 size={16} color="white" className="animate-spin" />
              ) : (
                <Check size={16} color="white" />
              )}
              <span className="text-white font-semibold">
                {saving
                  ? t('subscription.form.saving')
                  : (isEditing ? t('subscription.form.update') : t('common.save'))
                }
              </span>
            </ThemedButton>
          </div>
        </ThemedView>
      </ThemedView>

      {/* 删除确认对话框 */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-5 animate-in fade-in-0 duration-300">
          <ThemedView
            variant="card"
            className="rounded-2xl max-w-xs w-full p-6 shadow-2xl animate-in zoom-in-95 duration-300 border"
            style={{
              borderColor: colors.card.border,
              minWidth: '280px'
            }}
          >
            {/* 图标 */}
            <div className="flex justify-center mb-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255, 59, 48, 0.1)' }}
              >
                <Trash2 size={32} color="#FF3B30" />
              </div>
            </div>

            {/* 标题 */}
            <ThemedText
              className="text-lg font-semibold text-center mb-3"
              style={{ color: colors.text }}
            >
              {t('subscription.form.delete_confirm_title')}
            </ThemedText>

            {/* 消息 */}
            <ThemedText
              variant="secondary"
              className="text-sm text-center leading-5 mb-6"
              style={{ color: colors.textSecondary }}
            >
              {t('subscription.form.delete_confirm_message', { name: formData.name })}
            </ThemedText>

            {/* 按钮组 */}
            <div className="flex gap-3 w-full">
              {/* 取消按钮 */}
              <ThemedButton
                variant="secondary"
                onClick={() => setShowDeleteDialog(false)}
                disabled={saving}
                className="flex-1 py-3 px-6 rounded-lg font-semibold transition-colors"
                style={{
                  backgroundColor: colors.button.secondary,
                  color: colors.text
                }}
              >
                {t('subscription.form.cancel')}
              </ThemedButton>

              {/* 确认删除按钮 */}
              <ThemedButton
                onClick={confirmDelete}
                disabled={saving}
                className="flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                style={{
                  backgroundColor: '#FF3B30',
                  color: 'white',
                  opacity: saving ? 0.6 : 1
                }}
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                {saving ? t('subscription.form.deleting') : t('subscription.form.delete')}
              </ThemedButton>
            </div>
          </ThemedView>
        </div>
      )}
    </div>
  )
}