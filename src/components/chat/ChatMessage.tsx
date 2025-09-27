'use client'

import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { useThemeColors } from '@/hooks/useThemeColor'
import { useLocalization } from '@/hooks/useLocalization'
import PreviewCard from './PreviewCard'
import Image from 'next/image'
import { storage } from '@/lib/utils'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  status?: 'sending' | 'sent' | 'failed'
  metadata?: any
}

interface ChatMessageProps {
  message: Message
  onRetry: () => void
}

export default function ChatMessage({ message, onRetry }: ChatMessageProps) {
  const colors = useThemeColors()
  const { t } = useLocalization()
  const user = storage.getUser()

  const formatTimestamp = (date: Date): string => {
    try {
      if (!date || isNaN(new Date(date).getTime())) {
        return format(new Date(), 'HH:mm')
      }
      return format(new Date(date), 'HH:mm')
    } catch {
      return format(new Date(), 'HH:mm')
    }
  }

  const renderMessageContent = () => {
    // 完全按照app端的逻辑判断是否显示预览卡片
    const shouldShowTaskCard = !message.isUser &&
      message.metadata?.taskId &&
      message.metadata?.taskTitle &&
      (message.metadata.taskTitle || '').trim().length > 0;

    const shouldShowSubscriptionCard = !message.isUser &&
      message.metadata?.subscriptionId &&
      message.metadata?.subscriptionName &&
      (message.metadata.subscriptionName || '').trim().length > 0;

    const shouldShowHabitCard = !message.isUser &&
      message.metadata?.habitId &&
      message.metadata?.habitTitle &&
      (message.metadata.habitTitle || '').trim().length > 0;

    const shouldShowDecompositionCard = !message.isUser &&
      message.metadata?.decompositionParentTaskTitle &&
      (message.metadata.decompositionParentTaskTitle || '').trim().length > 0 &&
      message.metadata?.decompositionSubtaskCount &&
      message.metadata.decompositionSubtaskCount > 0;

    const shouldShowFridgeCard = !message.isUser &&
      message.metadata?.fridgeItemName &&
      (message.metadata.fridgeItemName || '').trim().length > 0 && (
        message.metadata?.actionType === 'FRIDGE_ITEM_ADDED' ||
        message.metadata?.actionType === 'FRIDGE_ITEM_CREATED' ||
        message.metadata?.actionType === 'FRIDGE_ITEM_UPDATED' ||
        message.metadata?.actionType === 'FRIDGE_ITEMS_QUERIED' ||
        message.metadata?.actionType === 'FRIDGE_ITEM_CONSUMED' ||
        message.metadata?.action === 'FRIDGE_ITEM_ADDED' ||
        message.metadata?.action === 'FRIDGE_ITEM_CREATED' ||
        message.metadata?.action === 'FRIDGE_ITEM_UPDATED' ||
        message.metadata?.action === 'FRIDGE_ITEMS_QUERIED' ||
        message.metadata?.action === 'FRIDGE_ITEM_CONSUMED' ||
        (message.metadata?.fridgeItem && (message.metadata?.actionType || message.metadata?.action)) ||
        (message.metadata?.fridgeItems && (message.metadata?.actionType || message.metadata?.action))
      );

    const hasBatchData = message.metadata?.batchFridgeItems && Array.isArray(message.metadata.batchFridgeItems) && message.metadata.batchFridgeItems.length > 0;
    const hasValidBatchAction = message.metadata?.actionType === 'MULTIPLE_FRIDGE_ITEMS_ADDED' ||
                                message.metadata?.actionType === 'MULTIPLE_FRIDGE_ITEMS_FAILED' ||
                                message.metadata?.action === 'MULTIPLE_FRIDGE_ITEMS_ADDED' ||
                                message.metadata?.action === 'MULTIPLE_FRIDGE_ITEMS_FAILED';

    const isSingleItemAction = message.metadata?.actionType === 'FRIDGE_ITEM_CREATED' ||
                              message.metadata?.actionType === 'FRIDGE_ITEM_ADDED' ||
                              message.metadata?.actionType === 'FRIDGE_ITEM_UPDATED' ||
                              message.metadata?.action === 'FRIDGE_ITEM_CREATED' ||
                              message.metadata?.action === 'FRIDGE_ITEM_ADDED' ||
                              message.metadata?.action === 'FRIDGE_ITEM_UPDATED';

    const shouldShowBatchFridgeCard = !message.isUser && hasBatchData && hasValidBatchAction && !isSingleItemAction;

    const hasBatchConsumeData = message.metadata?.batchConsumeItems && Array.isArray(message.metadata.batchConsumeItems) && message.metadata.batchConsumeItems.length > 0;
    const hasValidBatchConsumeAction = message.metadata?.actionType === 'MULTIPLE_FRIDGE_ITEMS_CONSUMED' ||
                                message.metadata?.action === 'MULTIPLE_FRIDGE_ITEMS_CONSUMED';
    const shouldShowBatchConsumeCard = !message.isUser && hasBatchConsumeData && hasValidBatchConsumeAction;

    // 如果需要显示预览卡片
    if (shouldShowTaskCard || shouldShowSubscriptionCard || shouldShowHabitCard || shouldShowDecompositionCard || shouldShowFridgeCard || shouldShowBatchFridgeCard || shouldShowBatchConsumeCard) {
      return (
        <div className="space-y-3">
          {message.content && (
            <div
              className="text-sm leading-relaxed"
              style={{ color: message.isUser ? colors.chatText.user : colors.chatText.ai }}
            >
              {message.content}
            </div>
          )}
          <PreviewCard
            metadata={message.metadata}
            bubbleBackgroundColor={message.isUser ? colors.chatBubble.user : colors.chatBubble.ai}
          />
        </div>
      )
    }

    // 普通文本消息，支持简单的Markdown渲染
    return (
      <div className="text-base leading-5 whitespace-pre-wrap">
        {renderMarkdown(message.content)}
      </div>
    )
  }

  // 简单的Markdown渲染（加粗和代码块）
  const renderMarkdown = (text: string) => {
    // 处理代码块
    const parts = text.split(/(```[\s\S]*?```|`[^`]+`|\*\*[^*]+\*\*)/g)
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // 代码块
        const code = part.slice(3, -3).trim()
        return (
          <pre key={index} className="bg-gray-100 rounded-lg p-2.5 mt-1 mb-1 overflow-x-auto">
            <code className="text-sm font-mono text-gray-800">{code}</code>
          </pre>
        )
      } else if (part.startsWith('`') && part.endsWith('`')) {
        // 行内代码
        const code = part.slice(1, -1)
        return (
          <code key={index} className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800">
            {code}
          </code>
        )
      } else if (part.startsWith('**') && part.endsWith('**')) {
        // 加粗文本
        const bold = part.slice(2, -2)
        return <strong key={index}>{bold}</strong>
      }
      return part
    })
  }

  const getStatusIcon = () => {
    switch (message.status) {
      case 'sending':
        return (
          <svg className="w-4 h-4 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )
      case 'failed':
        return (
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'sent':
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-1.5 px-4`}>
      <div className={`flex max-w-[75%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-2`}>
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-[35px] h-[35px] rounded-full border-2 border-white/20 overflow-hidden">
            {message.isUser ? (
              user?.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt="User Avatar"
                  width={35}
                  height={35}
                  className="w-full h-full rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-dopamind-600 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">U</span>
                </div>
              )
            ) : (
              <div className="w-full h-full bg-white flex items-center justify-center p-0.5">
                <Image
                  src="/dopamind-logo-bw.jpg"
                  alt="Dopamind AI"
                  width={31}
                  height={31}
                  className="rounded-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Message Bubble */}
        <div
          className={`relative px-3 py-2 border rounded-[20px] ${
            message.isUser ? 'rounded-tr-[6px]' : 'rounded-tl-[6px]'
          }`}
          style={{
            backgroundColor: message.isUser ? colors.chatBubble.user : colors.chatBubble.ai,
            color: message.isUser ? colors.chatText.user : colors.chatText.ai,
            borderColor: message.isUser ? colors.chatBubble.user : colors.chatBubble.ai
          }}
        >
          {renderMessageContent()}
          
          {/* Timestamp */}
          <div
            className="text-[11px] mt-0.5"
            style={{
              color: message.isUser ? (colors.chatText.user + '70') : colors.textSecondary
            }}
          >
            {formatTimestamp(message.timestamp)}
          </div>

          {/* Message Status and Retry for User Messages */}
          {message.isUser && message.status === 'failed' && (
            <div
              className="flex items-center justify-between mt-2 pt-2 border-t"
              style={{ borderColor: colors.border }}
            >
              <span
                className="text-xs"
                style={{ color: colors.textSecondary }}
              >
                {t('chat.message_send_failed')}
              </span>
              <Button
                onClick={onRetry}
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-xs hover:text-white"
                style={{
                  color: colors.textSecondary,
                  '--hover-bg': colors.status.error
                } as React.CSSProperties}
              >
                {t('chat.message_retry')}
              </Button>
            </div>
          )}
        </div>

        {/* Status Icon for User Messages */}
        {message.isUser && (
          <div className="flex-shrink-0 mt-3">
            {getStatusIcon()}
          </div>
        )}

        {/* Retry Button for Failed Messages */}
        {message.isUser && message.status === 'failed' && (
          <button
            onClick={onRetry}
            className="absolute -left-10 top-1/2 -translate-y-1/2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

