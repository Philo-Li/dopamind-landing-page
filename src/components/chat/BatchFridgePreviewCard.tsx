'use client'

import { useMemo, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Apple,
  Carrot,
  Check,
  CheckCircle2,
  ChevronDown,
  Cookie,
  Drumstick,
  List,
  Package,
  Sandwich,
  UtensilsCrossed,
  X,
  XCircle,
  CupSoda
} from 'lucide-react'

import { useThemeColors } from '@/hooks/useThemeColor'
import { useLocalization } from '@/hooks/useLocalization'

export type BatchCategoryKey =
  | 'beverages'
  | 'fruits'
  | 'vegetables'
  | 'meat'
  | 'fast_food'
  | 'food'
  | 'snacks'
  | 'other'

interface CategoryMeta {
  Icon: LucideIcon
  color: string
}

export const BATCH_CATEGORY_ICON_MAP: Record<BatchCategoryKey, CategoryMeta> = {
  beverages: { Icon: CupSoda, color: '#007AFF' },
  fruits: { Icon: Apple, color: '#FF6B35' },
  vegetables: { Icon: Carrot, color: '#34C759' },
  meat: { Icon: Drumstick, color: '#FF3B30' },
  fast_food: { Icon: Sandwich, color: '#AF52DE' },
  food: { Icon: UtensilsCrossed, color: '#FF9500' },
  snacks: { Icon: Cookie, color: '#FFCC00' },
  other: { Icon: Package, color: '#8E8E93' }
}

// 直接通过category映射图标，与移动端保持一致


export type CategoryVisual =
  | { type: 'emoji'; emoji: string; color: string }
  | { type: 'icon'; Icon: LucideIcon; color: string }

export const resolveCategoryVisual = (category: BatchCategoryKey, rawIcon?: unknown): CategoryVisual => {
  const base = BATCH_CATEGORY_ICON_MAP[category] ?? BATCH_CATEGORY_ICON_MAP.other

  // 直接使用category映射的图标，与移动端保持一致
  return { type: 'icon', Icon: base.Icon, color: base.color }
}
interface BatchFridgePreviewCardProps {
  metadata: any
  bubbleBackgroundColor?: string
  onNavigate?: () => void
}

interface NormalizedBatchItem {
  original: any
  name: string
  quantity?: number
  unit?: string
  category: BatchCategoryKey
  success: boolean
  wasExisting?: boolean
  error?: string
}

export const normalizeBatchCategory = (category?: string): BatchCategoryKey => {
  if (!category) return 'other'
  const normalized = category.toLowerCase() as BatchCategoryKey
  return (normalized in BATCH_CATEGORY_ICON_MAP ? normalized : 'other') as BatchCategoryKey
}

const getItemName = (item: any): string => {
  return (
    item?.name ||
    item?.fridgeItemName ||
    item?.itemName ||
    (typeof item?.item?.name === 'string' ? item.item.name : '') ||
    ''
  )
}

const normalizeItems = (items: any[]): NormalizedBatchItem[] => {
  return items.map((item) => {
    const name = getItemName(item)
    const quantity = item?.quantity ?? item?.fridgeItemQuantity
    const unit = item?.unit ?? item?.fridgeItemUnit
    const categorySource =
      item?.category ??
      item?.fridgeItemCategory ??
      (typeof item?.item?.category === 'string' ? item.item.category : undefined)

    return {
      original: item,
      name,
      quantity,
      unit,
      category: normalizeBatchCategory(categorySource),
      success: item?.success !== false,
      wasExisting: item?.wasExisting,
      error: typeof item?.error === 'string' ? item.error : undefined
    }
  })
}

const deriveBatchFridgeMetrics = (metadata: any, items: NormalizedBatchItem[]) => {
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

const BatchFridgePreviewCard = ({
  metadata,
  bubbleBackgroundColor,
  onNavigate
}: BatchFridgePreviewCardProps) => {
  const colors = useThemeColors()
  const { t } = useLocalization()
  const [isExpanded, setIsExpanded] = useState(false)

  const rawItems = useMemo(() => {
    if (Array.isArray(metadata?.batchFridgeItems)) {
      return metadata.batchFridgeItems
    }
    if (Array.isArray(metadata?.items)) {
      return metadata.items
    }
    return []
  }, [metadata])

  const items = useMemo(() => normalizeItems(rawItems), [rawItems])

  const { totalProcessed, successCount, failureCount, successItems, failedItems } =
    useMemo(() => deriveBatchFridgeMetrics(metadata, items), [metadata, items])

  const operationType = metadata?.actionType || metadata?.action || 'BATCH_PROCESSED'

  const title = useMemo(() => {
    if (failureCount > 0 && successCount === 0) {
      return (
        t('batch_fridge.card_title.all_failed', { count: failureCount }) ||
        `Batch Addition Failed (${failureCount} items)`
      )
    }
    if (failureCount > 0) {
      return (
        t('batch_fridge.card_title.partial_success', {
          success: successCount,
          total: totalProcessed
        }) || `${successCount}/${totalProcessed} completed`
      )
    }
    return (
      t('batch_fridge.card_title.all_success', { count: successCount }) ||
      `Batch Added Successfully (${successCount} items)`
    )
  }, [failureCount, successCount, totalProcessed, t])

  const subtitle = useMemo(() => {
    const formatNames = (list: NormalizedBatchItem[]) => {
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

  const operationLabel = useMemo(() => {
    if (operationType === 'MULTIPLE_FRIDGE_ITEMS_FAILED') {
      return t('batch_fridge.batch_failed') || 'Batch Failed'
    }
    if (operationType === 'MULTIPLE_FRIDGE_ITEMS_ADDED') {
      return t('batch_fridge.batch_added') || 'Batch Added'
    }
    return t('batch_fridge.batch_processed') || 'Batch Processed'
  }, [operationType, t])

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
              <Package className="w-5 h-5" strokeWidth={1.8} />
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
                {t('batch_fridge.stats.success', { count: successCount }) || `Success ${successCount}`}
              </span>
            </div>
          )}

          {failureCount > 0 && (
            <div className="flex items-center gap-1.5" style={{ color: '#FF3B30' }}>
              <XCircle className="w-4 h-4" strokeWidth={2} />
              <span style={{ fontSize: '13px', fontWeight: 500 }}>
                {t('batch_fridge.stats.failed', { count: failureCount }) || `Failed ${failureCount}`}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5" style={{ color: colors.textSecondary }}>
            <List className="w-4 h-4" strokeWidth={1.8} />
            <span style={{ fontSize: '13px', fontWeight: 500 }}>
              {t('batch_fridge.stats.total', { count: totalProcessed }) || `Total ${totalProcessed}`}
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
                  const visual = resolveCategoryVisual(item.category, item.original?.icon)
                  const iconColor = visual.color
                  const IconComponent = visual.type === 'icon' ? visual.Icon : null
                  const detailParts: string[] = []

                  if (item.quantity !== undefined && item.quantity !== null) {
                    const unit = renderUnit(item.unit)
                    detailParts.push(`${item.quantity}${unit ? ` ${unit}` : ''}`)
                  }

                  if (item.wasExisting) {
                    detailParts.push(t('batch_fridge.item_status.merged') || 'Merged')
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
                          backgroundColor: `${iconColor}21`,
                          color: iconColor
                        }}
                      >
                        {visual.type === 'emoji' ? (
                          <span aria-hidden="true" className="text-base leading-none">{visual.emoji}</span>
                        ) : IconComponent ? (
                          <IconComponent className="w-[18px] h-[18px]" strokeWidth={1.8} />
                        ) : null}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate" style={{ color: colors.text }}>
                          {item.name || 'Unknown Item'}
                        </div>
                        {detailParts.length > 0 && (
                          <div
                            className="text-xs truncate"
                            style={{ color: colors.textSecondary, opacity: 0.85 }}
                          >
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
            {operationLabel}
          </span>
        </div>
      </div>
    </div>
  )
}

export default BatchFridgePreviewCard






