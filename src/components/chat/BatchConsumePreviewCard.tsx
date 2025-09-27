'use client'

import { useMemo, useState } from 'react'
import {
  Check,
  CheckCircle2,
  ChevronDown,
  List,
  UtensilsCrossed,
  X,
  XCircle
} from 'lucide-react'

import { useThemeColors } from '@/hooks/useThemeColor'
import { useLocalization } from '@/hooks/useLocalization'

import {
  BATCH_CATEGORY_ICON_MAP,
  BatchCategoryKey,
  normalizeBatchCategory
} from './BatchFridgePreviewCard'

interface BatchConsumePreviewCardProps {
  metadata: any
  bubbleBackgroundColor?: string
  onNavigate?: () => void
}

interface NormalizedConsumeItem {
  name: string
  success: boolean
  consumed?: number
  remaining?: number
  unit?: string
  category: BatchCategoryKey
  error?: string
}

const normalizeItems = (items: any[]): NormalizedConsumeItem[] => {
  return items.map((item) => {
    const name =
      item?.itemName || (typeof item?.item?.name === 'string' ? item.item.name : '') || ''
    const unit = item?.unit ?? item?.item?.unit
    const categorySource = item?.category ?? item?.item?.category

    return {
      name,
      success: item?.success === true,
      consumed: item?.consumed,
      remaining: item?.remaining,
      unit,
      category: normalizeBatchCategory(categorySource),
      error: typeof item?.error === 'string' ? item.error : undefined
    }
  })
}

const deriveBatchConsumeMetrics = (metadata: any, items: NormalizedConsumeItem[]) => {
  const totalFromMetadata = metadata?.batchTotalProcessed ?? metadata?.total
  const successFromMetadata = metadata?.batchSuccessCount ?? metadata?.success
  const failureFromMetadata = metadata?.batchFailureCount ?? metadata?.failed

  const successItems = items.filter((item) => item.success)
  const failedItems = items.filter((item) => !item.success)

  const totalProcessed = typeof totalFromMetadata === 'number' ? totalFromMetadata : items.length
  const successCount =
    typeof successFromMetadata === 'number' ? successFromMetadata : successItems.length
  const failureCount =
    typeof failureFromMetadata === 'number'
      ? failureFromMetadata
      : Math.max(totalProcessed - successCount, failedItems.length)

  return {
    totalProcessed,
    successCount,
    failureCount,
    successItems,
    failedItems
  }
}

const BatchConsumePreviewCard = ({
  metadata,
  bubbleBackgroundColor,
  onNavigate
}: BatchConsumePreviewCardProps) => {
  const colors = useThemeColors()
  const { t } = useLocalization()
  const [isExpanded, setIsExpanded] = useState(false)

  const rawItems = useMemo(() => {
    if (Array.isArray(metadata?.batchConsumeItems)) {
      return metadata.batchConsumeItems
    }
    return []
  }, [metadata])

  const items = useMemo(() => normalizeItems(rawItems), [rawItems])

  const { totalProcessed, successCount, failureCount, successItems, failedItems } =
    useMemo(() => deriveBatchConsumeMetrics(metadata, items), [metadata, items])

  const title = useMemo(() => {
    if (failureCount > 0 && successCount === 0) {
      return (
        t('batch_consume.card_title.all_failed', { count: failureCount }) ||
        `Batch Consumption Failed (${failureCount} items)`
      )
    }
    if (failureCount > 0) {
      return (
        t('batch_consume.card_title.partial_success', {
          success: successCount,
          total: totalProcessed
        }) || `${successCount}/${totalProcessed} completed`
      )
    }
    return (
      t('batch_consume.card_title.all_success', { count: successCount }) ||
      `Batch Consumed Successfully (${successCount} items)`
    )
  }, [failureCount, successCount, totalProcessed, t])

  const subtitle = useMemo(() => {
    const formatNames = (list: NormalizedConsumeItem[]) => {
      if (!list.length) return ''
      const names = list
        .map((item) => item.name)
        .filter(Boolean)
        .slice(0, 3)
        .join('、')
      const suffix = list.length > 3 ? t('common.etc') || ' etc.' : ''
      return `${names}${suffix}`
    }

    if (successCount > 0) {
      return formatNames(successItems)
    }
    if (failureCount > 0) {
      return formatNames(failedItems)
    }
    return ''
  }, [failureCount, successCount, successItems, failedItems, t])

  const statusColor = useMemo(() => {
    if (failureCount > 0 && successCount === 0) return '#FF3B30'
    if (failureCount > 0 && successCount > 0) return '#FF9500'
    return '#34C759'
  }, [failureCount, successCount])

  const successItemBackground = colors.background || '#FFFFFF'
  const successItemBorder = colors.card?.border || '#E5E7EB'
  const errorColor = colors.status?.error || '#FF3B30'
  const failureItemBackground = `${errorColor}10`
  const failureItemBorder = `${errorColor}30`
  if (!items.length) {
    return null
  }

  const handleCardClick = () => {
    onNavigate?.()
  }

  const handleToggleExpand = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setIsExpanded((prev) => !prev)
  }

  const renderUnit = (unit?: string) => {
    if (!unit) return ''
    const key = `fridge.units.${unit}`
    const translated = t(key)
    return translated || unit
  }

  return (
    <div
      role={onNavigate ? 'button' : undefined}
      tabIndex={onNavigate ? 0 : -1}
      className="flex mt-2.5 mb-1.5 items-stretch rounded-[16px] border transition-all duration-200"
      style={{
        backgroundColor: bubbleBackgroundColor || colors.card.background,
        borderColor: statusColor,
        boxShadow: `0 2px 8px ${statusColor}22`
      }}
      onClick={handleCardClick}
      onKeyDown={(event) => {
        if (!onNavigate) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onNavigate()
        }
      }}
    >
      <div className="w-[5px] rounded-sm mr-3 my-2" style={{ backgroundColor: statusColor }} />

      <div className="flex-1 flex flex-col p-[14px]">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-1 items-start gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: `${statusColor}20`,
                color: statusColor
              }}
            >
              <UtensilsCrossed className="w-5 h-5" strokeWidth={1.8} />
            </div>

            <div className="flex-1 min-w-0">
              <h4
                className="font-semibold leading-[22px] text-base truncate"
                style={{ color: colors.text }}
              >
                {title}
              </h4>
              {subtitle && (
                <p className="mt-1 text-sm truncate" style={{ color: colors.textSecondary }}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {items.length > 0 ? (
            <button
              type="button"
              onClick={handleToggleExpand}
              className="p-1.5 rounded-md transition-colors"
              style={{ color: colors.textSecondary }}
            >
              <ChevronDown
                className="w-5 h-5 transition-transform"
                style={{ transform: isExpanded ? 'rotate(180deg)' : undefined }}
              />
            </button>
          ) : (
            <ChevronDown className="w-5 h-5 opacity-0" />
          )}
        </div>

        <div className="flex flex-wrap items-center mt-3 gap-4 text-sm">
          {successCount > 0 && (
            <div className="flex items-center gap-1.5" style={{ color: '#34C759' }}>
              <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
              <span style={{ fontSize: '13px', fontWeight: 500 }}>
                {t('batch_consume.stats.success', { count: successCount }) || `Success ${successCount}`}
              </span>
            </div>
          )}

          {failureCount > 0 && (
            <div className="flex items-center gap-1.5" style={{ color: '#FF3B30' }}>
              <XCircle className="w-4 h-4" strokeWidth={2} />
              <span style={{ fontSize: '13px', fontWeight: 500 }}>
                {t('batch_consume.stats.failed', { count: failureCount }) || `Failed ${failureCount}`}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5" style={{ color: colors.textSecondary }}>
            <List className="w-4 h-4" strokeWidth={1.8} />
            <span style={{ fontSize: '13px', fontWeight: 500 }}>
              {t('batch_consume.stats.total', { count: totalProcessed }) || `Total ${totalProcessed}`}
            </span>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t" style={{ borderColor: colors.border }}>
            <div className="space-y-2">
              <div
                className="text-xs font-medium mb-2"
                style={{ color: colors.textSecondary }}
              >
                {t('batch_fridge.item_details') || 'Item Details'}:
              </div>

              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {items.map((item, index) => {
                  const { Icon, color } = BATCH_CATEGORY_ICON_MAP[item.category]
                  const detailParts: string[] = []

                  if (item.success && item.consumed !== undefined && item.consumed !== null) {
                    let consumedText =
                      t('batch_consume.item_status.consumed', { count: item.consumed }) ||
                      `Consumed ${item.consumed}`
                    const unit = renderUnit(item.unit)
                    if (unit) {
                      consumedText = `${consumedText} ${unit}`
                    }
                    detailParts.push(consumedText)
                  }

                  if (item.success && item.remaining !== undefined && item.remaining !== null) {
                    let remainingText =
                      t('batch_consume.item_status.remaining', { count: item.remaining }) ||
                      `Remaining ${item.remaining}`
                    const unit = renderUnit(item.unit)
                    if (unit) {
                      remainingText = `${remainingText} ${unit}`
                    }
                    detailParts.push(remainingText)
                  }

                  if (!item.success && item.error) {
                    detailParts.push(item.error)
                  }

                  const statusIconColor = item.success ? '#34C759' : '#FF3B30'

                  return (
                    <div
                      key={`${item.name || 'item'}-${index}`}
                      className="flex items-center gap-3 py-2 px-3 rounded-lg border"
                      style={{
                        backgroundColor: item.success ? successItemBackground : failureItemBackground,
                        borderColor: item.success ? successItemBorder : failureItemBorder
                      }}
                    >
                      <div
                        className="flex items-center justify-center w-8 h-8 rounded-full"
                        style={{
                          backgroundColor: `${color}21`,
                          color
                        }}
                      >
                        <Icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate" style={{ color: colors.text }}>
                          {item.name || 'Unknown Item'}
                        </div>
                        {detailParts.length > 0 && (
                          <div className="text-xs truncate" style={{ color: colors.textSecondary }}>
                            {detailParts.join(' • ')}
                          </div>
                        )}
                      </div>

                      <div className="ml-1 flex items-center" style={{ color: statusIconColor }}>
                        {item.success ? (
                          <Check className="w-4 h-4" strokeWidth={2} />
                        ) : (
                          <X className="w-4 h-4" strokeWidth={2} />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        <div className="mt-2.5 flex items-center">
          <span
            className="border uppercase tracking-[0.5px]"
            style={{
              fontSize: '12px',
              fontWeight: 600,
              padding: '3px 10px',
              borderRadius: '10px',
              backgroundColor: `${statusColor}18`,
              borderColor: statusColor,
              color: statusColor
            }}
          >
            {t('batch_consume.action_label') || 'Batch Consumption Complete'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default BatchConsumePreviewCard



