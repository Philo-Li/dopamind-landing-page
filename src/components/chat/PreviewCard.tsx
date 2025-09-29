'use client'

import { useRouter } from 'next/navigation'
import { useThemeColors } from '@/hooks/useThemeColor'
import { useLocalization } from '@/hooks/useLocalization'
import BatchFridgePreviewCard from './BatchFridgePreviewCard'
import BatchConsumePreviewCard from './BatchConsumePreviewCard'

interface PreviewCardProps {
  metadata: {
    type: string
    [key: string]: any
  }
  bubbleBackgroundColor?: string
}

export default function PreviewCard({ metadata, bubbleBackgroundColor }: PreviewCardProps) {
  const router = useRouter()
  const colors = useThemeColors()
  const { t } = useLocalization()

  // 处理任务卡片点击导航
  const handleTaskCardClick = () => {
    const taskId = metadata.taskId
    if (taskId) {
      router.push(`/tasks/${taskId}`)
    }
  }

  // 处理习惯卡片点击导航
  const handleHabitCardClick = () => {
    router.push('/habits')
  }

  // 处理冰箱卡片点击导航
  const handleFridgeCardClick = () => {
    router.push('/fridge')
  }

  // 完全按照app端的逻辑推断卡片类型
  const determineCardType = () => {
    // 任务卡片 - 检查app端的字段
    if (metadata.taskId && metadata.taskTitle) {
      return 'task'
    }

    // 订阅卡片
    if (metadata.subscriptionId && metadata.subscriptionName) {
      return 'subscription'
    }

    // 习惯卡片
    if (metadata.habitId && metadata.habitTitle) {
      return 'habit'
    }

    // 冰箱物品卡片 - 按照移动端逻辑
    if (metadata.fridgeItemName &&
        (metadata.fridgeItemName || '').trim().length > 0 && (
          metadata.actionType === 'FRIDGE_ITEM_ADDED' ||
          metadata.actionType === 'FRIDGE_ITEM_CREATED' ||
          metadata.actionType === 'FRIDGE_ITEM_UPDATED' ||
          metadata.actionType === 'FRIDGE_ITEMS_QUERIED' ||
          metadata.actionType === 'FRIDGE_ITEM_CONSUMED' ||
          metadata.action === 'FRIDGE_ITEM_ADDED' ||
          metadata.action === 'FRIDGE_ITEM_CREATED' ||
          metadata.action === 'FRIDGE_ITEM_UPDATED' ||
          metadata.action === 'FRIDGE_ITEMS_QUERIED' ||
          metadata.action === 'FRIDGE_ITEM_CONSUMED' ||
          (metadata.fridgeItem && (metadata.actionType || metadata.action)) ||
          (metadata.fridgeItems && (metadata.actionType || metadata.action))
        )) {
      return 'fridge'
    }

    // 批量冰箱操作卡片 - 按照移动端逻辑
    const hasBatchData = metadata.batchFridgeItems && Array.isArray(metadata.batchFridgeItems) && metadata.batchFridgeItems.length > 0;
    const hasValidBatchAction = metadata.actionType === 'MULTIPLE_FRIDGE_ITEMS_ADDED' ||
                                metadata.actionType === 'MULTIPLE_FRIDGE_ITEMS_FAILED' ||
                                metadata.action === 'MULTIPLE_FRIDGE_ITEMS_ADDED' ||
                                metadata.action === 'MULTIPLE_FRIDGE_ITEMS_FAILED';
    const isSingleItemAction = metadata.actionType === 'FRIDGE_ITEM_CREATED' ||
                              metadata.actionType === 'FRIDGE_ITEM_ADDED' ||
                              metadata.actionType === 'FRIDGE_ITEM_UPDATED' ||
                              metadata.action === 'FRIDGE_ITEM_CREATED' ||
                              metadata.action === 'FRIDGE_ITEM_ADDED' ||
                              metadata.action === 'FRIDGE_ITEM_UPDATED';

    if (hasBatchData && hasValidBatchAction && !isSingleItemAction) {
      return 'batch_fridge'
    }

    const hasBatchConsumeData = metadata.batchConsumeItems && Array.isArray(metadata.batchConsumeItems) && metadata.batchConsumeItems.length > 0;
    const hasValidBatchConsumeAction = metadata.actionType === 'MULTIPLE_FRIDGE_ITEMS_CONSUMED' || metadata.action === 'MULTIPLE_FRIDGE_ITEMS_CONSUMED';

    if (hasBatchConsumeData && hasValidBatchConsumeAction) {
      return 'batch_consume'
    }

    // 任务拆解卡片
    if (metadata.decompositionParentTaskId && metadata.decompositionParentTaskTitle) {
      return 'task_decomposition'
    }

    // 每日报告卡片 - 简化检测逻辑，参考移动端模式
    if ((metadata.dailyReportDate || metadata.reportDate || metadata.date) && (
      metadata.actionType === 'DAILY_REPORT_GENERATED' ||
      metadata.actionType === 'DAILY_REPORT_QUERIED' ||
      metadata.actionType === 'DAILY_REPORT_VIEWED' ||
      metadata.action === 'DAILY_REPORT_GENERATED' ||
      metadata.action === 'DAILY_REPORT_QUERIED' ||
      metadata.action === 'DAILY_REPORT_VIEWED' ||
      metadata.type === 'daily_report'
    )) {
      return 'daily_report'
    }

    // 更宽松的 daily report 检测 - 仅需要有日期字段即可
    if (metadata.type === 'daily_report' ||
        (metadata.dailyReportContent || metadata.reportContent) ||
        metadata.actionType?.includes('DAILY_REPORT') ||
        metadata.action?.includes('DAILY_REPORT')) {
      return 'daily_report'
    }

    // 回退到原有的type字段
    return metadata.type
  }

  const renderTaskCard = () => {
    // 根据actionType获取操作标签，完全按照app端的逻辑
    const getActionLabel = (): string => {
      if (metadata.taskStatus === 'COMPLETED' || metadata.status === 'completed') {
        return t('chat.preview.task.completed');
      }
      switch (metadata.actionType) {
        case 'TASK_CREATED':
          return t('chat.preview.task.task_created');
        case 'TASK_UPDATED':
          return t('chat.preview.task.task_updated');
        case 'TASK_DECOMPOSED':
          return t('chat.preview.task.task_decomposed');
        default:
          return t('chat.preview.task.task_created');
      }
    };

    // 状态色条颜色，完全按照app端逻辑
    const isCompleted = metadata.taskStatus === 'COMPLETED' || metadata.status === 'completed'
    const statusColor = isCompleted ? colors.status.success : colors.accent.blue

    // 使用app端的字段名
    const taskTitle = metadata.taskTitle || metadata.title
    const taskDueDate = metadata.taskDueDate || metadata.dueDate

    return (
      <div
        className="flex mt-2.5 mb-1.5 p-3.5 rounded-2xl border-[1.2px] shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-[1.02] items-stretch"
        style={{
          backgroundColor: bubbleBackgroundColor || colors.card.background,
          borderColor: isCompleted ? colors.status.success : colors.card.border,
          boxShadow: `0 2px 8px ${colors.accent.blue}1A`
        }}
        onClick={handleTaskCardClick}
      >
        {/* 左侧状态色条 - 完全按照app端样式 */}
        <div
          className="w-[5px] rounded-sm mr-3 my-0.5"
          style={{ backgroundColor: statusColor }}
        />

        {/* 内容区域 */}
        <div className="flex-1 flex flex-col">
          {/* 标题行 */}
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center gap-1">
              {/* 状态图标 */}
              <div className="mr-2">
                {isCompleted ? (
                  <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.status.success }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.textSecondary }}>
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                  </svg>
                )}
              </div>

              {/* 任务标题 */}
              <h4
                className={`flex-1 ${
                  isCompleted
                    ? 'line-through'
                    : ''
                }`}
                style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  lineHeight: '22px',
                  color: isCompleted ? colors.textSecondary : colors.text
                }}
              >
                {taskTitle}
              </h4>
            </div>

            {/* 右侧箭头 */}
            <svg className="w-[22px] h-[22px] ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.textSecondary }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* 截止日期 */}
          {taskDueDate && (
            <div className="flex items-center mt-2 mb-0.5">
              <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.textSecondary }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span
                className="ml-1 opacity-80"
                style={{
                  fontSize: '13px',
                  color: colors.textSecondary
                }}
              >
                {' '}{new Date(taskDueDate).toLocaleDateString('zh-CN', {
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short'
                })}{' '}{new Date(taskDueDate).toLocaleTimeString('zh-CN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          )}

          {/* 底部标签 */}
          <div className="mt-2.5 flex items-center">
            <span
              className="border"
              style={{
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                paddingLeft: '10px',
                paddingRight: '10px',
                paddingTop: '3px',
                paddingBottom: '3px',
                borderRadius: '10px',
                backgroundColor: isCompleted
                  ? colors.status.success + '18'
                  : colors.accent.blue + '18',
                borderColor: isCompleted ? colors.status.success : colors.accent.blue,
                color: isCompleted ? colors.status.success : colors.accent.blue
              }}
            >
              {getActionLabel()}
            </span>
          </div>
        </div>
      </div>
    )
  }

  const renderHabitCard = () => {
    // 获取习惯相关数据
    const habitTitle = metadata.habitTitle || metadata.title
    const habitFrequency = metadata.habitFrequency || metadata.frequency || 'daily'
    const habitIcon = metadata.habitIcon || metadata.icon || 'star'
    const habitColor = metadata.habitColor || metadata.color || '#4A90E2'
    const isCompleted = metadata.habitIsCompleted || metadata.isCompleted || metadata.actionType === 'HABIT_ALREADY_CHECKED_IN'

    // 根据actionType获取操作标签
    const getActionLabel = (): string => {
      switch (metadata.actionType) {
        case 'HABIT_CHECKED_IN':
          return t('chat.preview.habit.checked_in')
        case 'HABIT_ALREADY_CHECKED_IN':
          return t('chat.preview.habit.already_checked_in')
        case 'HABITS_QUERIED':
          return isCompleted ? t('chat.preview.habit.today_completed') : t('chat.preview.habit.pending')
        case 'HABIT_CREATED':
          return t('chat.preview.habit.habit_created')
        case 'HABIT_UPDATED':
          return t('chat.preview.habit.habit_updated')
        default:
          return isCompleted ? t('chat.preview.habit.completed') : t('chat.preview.habit.checked_in')
      }
    }

    // 获取习惯图标 - SVG实现
    const getHabitIconSvg = () => {
      const iconProps = {
        className: "w-[22px] h-[22px]",
        style: { color: habitColor },
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        strokeWidth: "2"
      }

      switch (habitIcon) {
        case 'fitness':
          return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4a2 2 0 012-2h8a2 2 0 012 2v2M6 18H4a2 2 0 01-2-2v-8a2 2 0 012-2h2m3 16V8m5 8v-8m5 16v-8" /></svg>
        case 'book':
          return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        case 'water':
          return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M5 8a7 7 0 1 1 14 0c0 7-7 13-7 13s-7-6-7-13z" /></svg>
        case 'heart':
          return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
        case 'leaf':
          return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
        case 'flash':
          return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        default:
          return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
      }
    }

    // 状态色条颜色
    const statusColor = isCompleted ? colors.status.success : habitColor

    return (
      <div
        className="flex mt-2.5 mb-1.5 p-3.5 rounded-2xl border-[1.2px] shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-[1.02] items-stretch"
        style={{
          backgroundColor: bubbleBackgroundColor || colors.card.background,
          borderColor: isCompleted ? colors.status.success : colors.card.border,
          boxShadow: `0 2px 8px ${habitColor}1A`
        }}
        onClick={handleHabitCardClick}
      >
        {/* 左侧状态色条 - 完全按照移动端样式 */}
        <div
          className="w-[5px] rounded-sm mr-3 my-0.5"
          style={{ backgroundColor: statusColor }}
        />

        {/* 内容区域 */}
        <div className="flex-1 flex flex-col">
          {/* 标题行 */}
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center gap-1">
              {/* 习惯图标 */}
              <div className="mr-2">
                {getHabitIconSvg()}
              </div>

              {/* 习惯标题 */}
              <div className="flex-1">
                <h4
                  className={`${
                    isCompleted
                      ? 'line-through'
                      : ''
                  }`}
                  style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    lineHeight: '22px',
                    color: isCompleted ? colors.textSecondary : colors.text
                  }}
                >
                  {habitTitle}
                </h4>
                {metadata.habitNote && (
                  <p
                    style={{
                      fontSize: '13px',
                      marginTop: '2px',
                      color: colors.textSecondary,
                      opacity: 0.8
                    }}
                  >
                    {metadata.habitNote}
                  </p>
                )}
              </div>
            </div>

            {/* 右侧状态图标 */}
            {isCompleted ? (
              <svg className="w-[24px] h-[24px] ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.status.success }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-[24px] h-[24px] ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.textSecondary }}>
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
              </svg>
            )}
          </div>

          {/* 底部信息 */}
          <div className="mt-2.5 flex items-center justify-between">
            {/* 操作标签 */}
            <span
              className="border text-xs font-semibold uppercase tracking-wide"
              style={{
                paddingLeft: '10px',
                paddingRight: '10px',
                paddingTop: '3px',
                paddingBottom: '3px',
                borderRadius: '10px',
                backgroundColor: isCompleted
                  ? colors.status.success + '18'
                  : habitColor + '18',
                borderColor: isCompleted ? colors.status.success : habitColor,
                color: isCompleted ? colors.status.success : habitColor
              }}
            >
              {getActionLabel()}
            </span>

            {/* 频率 */}
            <span
              style={{
                fontSize: '12px',
                color: colors.textSecondary,
                opacity: 0.7
              }}
            >
              {habitFrequency === 'daily' ? t('chat.preview.habit.frequency.daily') : t('chat.preview.habit.frequency.weekly')}
            </span>
          </div>
        </div>
      </div>
    )
  }

  const renderFridgeCard = () => {
    // 获取冰箱物品相关数据
    const fridgeItemName = metadata.fridgeItemName || metadata.name
    const fridgeItemCategory = metadata.fridgeItemCategory || metadata.category || 'other'
    const fridgeItemQuantity = metadata.fridgeItemQuantity || metadata.quantity || 1
    const fridgeItemUnit = metadata.fridgeItemUnit || metadata.unit || ''
    const fridgeItemExpiryDate = metadata.fridgeItemExpiryDate || metadata.expiryDate
    const isConsumed = metadata.fridgeItemIsConsumed || metadata.isConsumed || metadata.actionType === 'FRIDGE_ITEM_CONSUMED'

    // 分类颜色和图标映射 - 参考移动端设计
    const getCategoryConfig = (category: string) => {
      const configs = {
        fruit: { color: '#FF6B6B', icon: '🍎', bgColor: '#FF6B6B' },
        vegetable: { color: '#4ECDC4', icon: '🥬', bgColor: '#4ECDC4' },
        meat: { color: '#FF8A80', icon: '🥩', bgColor: '#FF8A80' },
        dairy: { color: '#81C784', icon: '🥛', bgColor: '#81C784' },
        grain: { color: '#FFB74D', icon: '🌾', bgColor: '#FFB74D' },
        beverage: { color: '#64B5F6', icon: '🥤', bgColor: '#64B5F6' },
        snack: { color: '#F06292', icon: '🍿', bgColor: '#F06292' },
        condiment: { color: '#A1887F', icon: '🧂', bgColor: '#A1887F' },
        frozen: { color: '#90CAF9', icon: '🧊', bgColor: '#90CAF9' },
        other: { color: '#BDBDBD', icon: '📦', bgColor: '#BDBDBD' }
      }
      return configs[category as keyof typeof configs] || configs.other
    }

    const categoryConfig = getCategoryConfig(fridgeItemCategory)

    // 过期状态检查
    const getExpiryStatus = () => {
      if (!fridgeItemExpiryDate) return 'normal'
      const now = new Date()
      const expiryDate = new Date(fridgeItemExpiryDate)
      const diffDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24))

      if (diffDays < 0) return 'expired'
      if (diffDays <= 2) return 'expiring'
      return 'normal'
    }

    const expiryStatus = getExpiryStatus()

    // 根据actionType获取操作标签
    const getActionLabel = (): string => {
      switch (metadata.actionType) {
        case 'FRIDGE_ITEM_ADDED':
          return t('chat.preview.fridge.item_added') || 'ADDED'
        case 'FRIDGE_ITEM_CONSUMED':
          return t('chat.preview.fridge.item_consumed') || 'CONSUMED'
        case 'FRIDGE_ITEM_UPDATED':
          return t('chat.preview.fridge.item_updated') || 'UPDATED'
        case 'FRIDGE_ITEM_DELETED':
          return t('chat.preview.fridge.item_deleted') || 'DELETED'
        default:
          return isConsumed ? (t('chat.preview.fridge.consumed') || 'CONSUMED') : (t('chat.preview.fridge.available') || 'AVAILABLE')
      }
    }

    // 状态色条颜色 - 参考移动端逻辑
    const getStatusColor = () => {
      if (isConsumed) return colors.textSecondary
      if (expiryStatus === 'expired') return '#FF5252'
      if (expiryStatus === 'expiring') return '#FF9800'
      return categoryConfig.color
    }

    const statusColor = getStatusColor()

    return (
      <div
        className="flex mt-2.5 mb-1.5 p-3.5 rounded-2xl border-[1.2px] shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-[1.02] items-stretch"
        style={{
          backgroundColor: bubbleBackgroundColor || colors.card.background,
          borderColor: statusColor,
          boxShadow: `0 2px 8px ${statusColor}1A`
        }}
        onClick={handleFridgeCardClick}
      >
        {/* 左侧状态色条 - 完全按照移动端样式 */}
        <div
          className="w-[5px] rounded-sm mr-3 my-0.5"
          style={{ backgroundColor: statusColor }}
        />

        {/* 内容区域 */}
        <div className="flex-1 flex flex-col">
          {/* 标题行 */}
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center gap-1">
              {/* 分类图标容器 - 参考移动端圆形设计 */}
              <div
                className="mr-3 w-[30px] h-[30px] rounded-full flex items-center justify-center text-white text-sm"
                style={{ backgroundColor: categoryConfig.bgColor }}
              >
                {categoryConfig.icon}
              </div>

              {/* 物品信息 */}
              <div className="flex-1">
                <h4
                  className={`${
                    isConsumed ? 'line-through' : ''
                  }`}
                  style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    lineHeight: '22px',
                    color: isConsumed ? colors.textSecondary : colors.text
                  }}
                >
                  {fridgeItemName}
                </h4>
                <p
                  style={{
                    fontSize: '13px',
                    marginTop: '2px',
                    color: colors.textSecondary,
                    opacity: 0.8
                  }}
                >
                  {fridgeItemQuantity} {fridgeItemUnit}
                </p>
              </div>
            </div>

            {/* 右侧箭头 - 参考移动端设计 */}
            <svg className="w-[22px] h-[22px] ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.textSecondary }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* 过期日期 - 参考移动端智能过期显示 */}
          {fridgeItemExpiryDate && (
            <div className="flex items-center mt-2 mb-0.5">
              <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                   style={{ color: expiryStatus === 'expired' ? '#FF5252' : expiryStatus === 'expiring' ? '#FF9800' : colors.textSecondary }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span
                className="ml-1"
                style={{
                  fontSize: '13px',
                  color: expiryStatus === 'expired' ? '#FF5252' : expiryStatus === 'expiring' ? '#FF9800' : colors.textSecondary,
                  opacity: 0.8
                }}
              >
                {expiryStatus === 'expired' ?
                  (t('chat.preview.fridge.expired') || '已过期') :
                  new Date(fridgeItemExpiryDate).toLocaleDateString('zh-CN', {
                    month: 'short',
                    day: 'numeric'
                  })
                }
              </span>
            </div>
          )}

          {/* 底部标签 - 参考移动端设计 */}
          <div className="mt-2.5 flex items-center">
            <span
              className="border"
              style={{
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                paddingLeft: '10px',
                paddingRight: '10px',
                paddingTop: '3px',
                paddingBottom: '3px',
                borderRadius: '10px',
                backgroundColor: statusColor + '18',
                borderColor: statusColor,
                color: statusColor
              }}
            >
              {getActionLabel()}
            </span>
          </div>
        </div>
      </div>
    )
  }

  const renderSubscriptionCard = () => (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 mt-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-purple-900 mb-1">{metadata.name}</h4>
          <div className="flex items-center gap-3 text-xs mb-2">
            <span className="font-medium text-purple-700">
              ¥{metadata.price}/{metadata.billingCycle === 'monthly' ? t('chat.preview.subscription.monthly') : t('chat.preview.subscription.yearly')}
            </span>
            {metadata.nextBilling && (
              <span className="text-purple-600">
                {t('subscription.next_billing', { date: new Date(metadata.nextBilling).toLocaleDateString() })}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs ${
              metadata.status === 'active' ? 'bg-green-100 text-green-800' :
              metadata.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-700'
            }`}>
              {metadata.status === 'active' ? t('chat.preview.subscription.active') :
               metadata.status === 'cancelled' ? t('chat.preview.subscription.cancelled') :
               metadata.status === 'expired' ? t('chat.preview.subscription.expired') :
               metadata.status === 'trial' ? t('chat.preview.subscription.trial') :
               t('chat.preview.subscription.active')}
            </span>
          </div>
        </div>
        <div className="ml-3">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )

  const renderBatchFridgeCard = () => (
    <BatchFridgePreviewCard
      metadata={metadata}
      bubbleBackgroundColor={bubbleBackgroundColor}
      onNavigate={handleFridgeCardClick}
    />
  )

  const renderBatchConsumeCard = () => (
    <BatchConsumePreviewCard
      metadata={metadata}
      bubbleBackgroundColor={bubbleBackgroundColor}
      onNavigate={handleFridgeCardClick}
    />
  )

  const renderTaskDecompositionCard = () => (
    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4 mt-2">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-amber-900 mb-1">{t('chat.preview.decomposition.task_decomposed')}</h4>
          <p className="text-sm text-amber-700">{metadata.parentTask}</p>
        </div>
        <div className="ml-3">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
      {metadata.subtasks && metadata.subtasks.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-amber-800 mb-2">{t('tasks.detail.subtask_list')}:</div>
          {metadata.subtasks.map((task: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
              <span className="text-amber-800">{task.title || task}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderDailyReportCard = () => {
    // 获取每日报告相关数据 - 更灵活的字段匹配
    const reportDate = metadata.dailyReportDate || metadata.reportDate || metadata.date
    const reportContent = metadata.dailyReportContent || metadata.reportContent || metadata.content
    const reportSummary = metadata.dailyReportSummary || metadata.reportSummary || metadata.summary

    // 格式化日期显示
    const getFormattedDate = () => {
      if (!reportDate) return t('daily_report.today')

      try {
        const date = new Date(reportDate)
        return date.toLocaleDateString('zh-CN', {
          month: 'long',
          day: 'numeric',
          weekday: 'short'
        })
      } catch {
        return t('daily_report.today')
      }
    }

    // 处理点击导航到每日报告页面
    const handleDailyReportClick = () => {
      const dateParam = reportDate || new Date().toISOString().split('T')[0]
      router.push(`/daily-report?date=${dateParam}`)
    }

    // 根据actionType获取操作标签
    const getActionLabel = (): string => {
      switch (metadata.actionType) {
        case 'DAILY_REPORT_GENERATED':
          return t('chat.preview.daily_report.report_generated')
        case 'DAILY_REPORT_QUERIED':
          return t('chat.preview.daily_report.report_queried')
        case 'DAILY_REPORT_VIEWED':
          return t('chat.preview.daily_report.report_viewed')
        default:
          return t('chat.preview.daily_report.report_available')
      }
    }

    // 提取dopamind寄语栏目的内容
    const extractDopamindMessage = (content: string) => {
      // 寻找 "dopamind 寄语" 或类似的标题
      const dopamindSectionRegex = /(?:^|\n)#{1,6}\s*(?:dopamind\s*寄语|Dopamind\s*寄语|DOPAMIND\s*寄语|dopamind.*message|Dopamind.*Message).*?\n(.*?)(?=\n#{1,6}|\n\n|$)/si
      const match = content.match(dopamindSectionRegex)

      if (match && match[1]) {
        // 清理提取的内容
        let extractedContent = match[1]
          .replace(/^#{1,6}\s+/gm, '') // 移除标题标记
          .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体标记
          .replace(/\*(.*?)\*/g, '$1') // 移除斜体标记
          .replace(/`(.*?)`/g, '$1') // 移除代码标记
          .replace(/^\s*[-*+]\s+/gm, '') // 移除列表标记
          .replace(/^\s*\d+\.\s+/gm, '') // 移除有序列表标记
          .replace(/\s+/g, ' ') // 合并多余空白
          .trim()

        return extractedContent
      }

      // 如果没有找到dopamind寄语，尝试通用的第一个小节
      const lines = content.split('\n')
      let foundFirstHeader = false
      let foundSecondHeader = false
      let extractedLines = []

      for (const line of lines) {
        const trimmedLine = line.trim()

        // 跳过空行
        if (!trimmedLine) continue

        // 检测大标题 (# 一个井号)
        if (/^#\s+/.test(trimmedLine) && !foundFirstHeader) {
          foundFirstHeader = true
          continue
        }

        // 检测小标题 (## 两个井号)
        if (/^#{2,6}\s+/.test(trimmedLine) && foundFirstHeader && !foundSecondHeader) {
          foundSecondHeader = true
          continue
        }

        // 如果找到了第一个大标题和第一个小标题，开始收集内容
        if (foundFirstHeader && foundSecondHeader) {
          // 如果遇到新的标题，停止收集
          if (/^#{1,6}\s+/.test(trimmedLine)) {
            break
          }

          // 收集非标题内容
          const cleanLine = trimmedLine
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/`(.*?)`/g, '$1')
            .replace(/^\s*[-*+]\s+/, '')
            .replace(/^\s*\d+\.\s+/, '')

          if (cleanLine) {
            extractedLines.push(cleanLine)
          }
        }
      }

      if (extractedLines.length > 0) {
        return extractedLines.join(' ').replace(/\s+/g, ' ').trim()
      }

      // 最后的备选方案：返回前120个字符
      const cleanContent = content
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/`(.*?)`/g, '$1')
        .replace(/^\s*[-*+]\s+/gm, '')
        .replace(/^\s*\d+\.\s+/gm, '')
        .replace(/\s+/g, ' ')
        .trim()

      return cleanContent.substring(0, 120)
    }

    // 获取内容预览
    const getPreviewText = () => {
      const contentToProcess = reportSummary || reportContent

      if (contentToProcess && contentToProcess.length > 0) {
        // 尝试提取dopamind寄语栏目的内容
        const dopamindMessage = extractDopamindMessage(contentToProcess)

        // 如果提取到了有效内容，返回处理后的内容
        if (dopamindMessage && dopamindMessage.trim().length > 0) {
          return dopamindMessage.length > 120 ? dopamindMessage.substring(0, 120) + '...' : dopamindMessage
        }
      }

      return t('chat.preview.daily_report.default_description')
    }

    return (
      <div
        className="flex mt-4 mb-6 p-4 rounded-2xl border-[1.2px] shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-[1.02] items-stretch bg-gradient-to-br"
        style={{
          background: `linear-gradient(135deg, ${bubbleBackgroundColor || colors.card.background}f0, ${colors.accent.blue}08)`,
          borderColor: colors.accent.blue,
          boxShadow: `0 4px 12px ${colors.accent.blue}15`
        }}
        onClick={handleDailyReportClick}
      >
        {/* 左侧状态色条 */}
        <div
          className="w-[5px] rounded-sm mr-4 my-0.5"
          style={{ backgroundColor: colors.accent.blue }}
        />

        {/* 内容区域 */}
        <div className="flex-1 flex flex-col">
          {/* 顶部标题行 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {/* AI 聊天图标 */}
              <div
                className="w-[36px] h-[36px] rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: colors.accent.blue + '18',
                  border: `1px solid ${colors.accent.blue}30`
                }}
              >
                <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.accent.blue }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              {/* 标题和副标题 */}
              <div className="flex-1">
                <h4
                  className="font-bold"
                  style={{
                    fontSize: '17px',
                    lineHeight: '24px',
                    color: colors.text
                  }}
                >
{t('chat.preview.daily_report.title')}
                </h4>
                <p
                  style={{
                    fontSize: '13px',
                    marginTop: '1px',
                    color: colors.textSecondary,
                    opacity: 0.8
                  }}
                >
{getFormattedDate()}
                </p>
              </div>
            </div>

            {/* 右侧箭头 */}
            <svg className="w-[20px] h-[20px] ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.accent.blue }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* 预览内容 */}
          <div
            className="mb-4 px-3 py-2.5 rounded-lg"
            style={{
              backgroundColor: colors.card.background + 'f8',
              border: `1px solid ${colors.border}40`
            }}
          >
            <p
              style={{
                fontSize: '14px',
                lineHeight: '20px',
                color: colors.textSecondary,
                opacity: 0.9
              }}
            >
              {getPreviewText()}
            </p>
          </div>

          {/* 底部操作区 */}
          <div className="flex items-center justify-between">
            {/* 左侧标签 */}
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: colors.accent.blue + '15',
                color: colors.accent.blue
              }}
            >
              <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
{getActionLabel()}
            </span>

            {/* 右侧提示 */}
            <span
              style={{
                fontSize: '11px',
                color: colors.textSecondary,
                opacity: 0.6,
                fontWeight: '500'
              }}
            >
{t('chat.preview.daily_report.click_hint')}
            </span>
          </div>
        </div>
      </div>
    )
  }

  // 根据app端的逻辑确定卡片类型并渲染对应的预览卡片
  const cardType = determineCardType()

  switch (cardType) {
    case 'task':
      return renderTaskCard()
    case 'habit':
      return renderHabitCard()
    case 'fridge':
      return renderFridgeCard()
    case 'batch_fridge':
      return renderBatchFridgeCard()
    case 'batch_consume':
      return renderBatchConsumeCard()
    case 'subscription':
      return renderSubscriptionCard()
    case 'batch_result':
      // 使用新的批量冰箱卡片替代旧的批量结果卡片
      return renderBatchFridgeCard()
    case 'task_decomposition':
      return renderTaskDecompositionCard()
    case 'daily_report':
      return renderDailyReportCard()
    default:
      // 调试信息：显示metadata内容以便排查问题
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-2">
          <div className="text-sm text-gray-600">
            <div>Card Type: {cardType}</div>
            <div>Metadata Keys: {JSON.stringify(Object.keys(metadata))}</div>
            <div>Type: {metadata.type}</div>
            <div>ActionType: {metadata.actionType}</div>
            <div>Action: {metadata.action}</div>
          </div>
        </div>
      )
  }
}

