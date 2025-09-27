'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { chatApi } from '@/lib/api'
import { storage } from '@/lib/utils'
import { chatStorage, ChatMessage } from '@/lib/chatStorage'
import ChatMessageComponent from './ChatMessage'
import ChatInput from './ChatInput'
import TypingIndicator from './TypingIndicator'
import { useThemeColors } from '@/hooks/useThemeColor'
import { useLocalization } from '@/hooks/useLocalization'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function ChatContainer() {
  const colors = useThemeColors()
  const { t } = useLocalization()
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMoreMessages, setHasMoreMessages] = useState(true)
  const [prefilledMessage, setPrefilledMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // 处理URL参数中的预设消息
  useEffect(() => {
    const prefilledParam = searchParams?.get('prefilledMessage')
    if (prefilledParam) {
      setPrefilledMessage(decodeURIComponent(prefilledParam))
    }
  }, [searchParams])

  // 滚动到底部
  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? 'smooth' : 'instant'
      })
    }
  }

  // 加载初始聊天历史 - 客户端风格：加载第一页
  const loadInitialHistory = useCallback(async () => {
    chatStorage.setLoading(true)
    try {
      // 加载第一页数据，和移动端保持一致
      const response = await chatApi.getHistory(1, 20)
      if (response.success) {
        let historyMessages: ChatMessage[] = []

        if ((response as any).history) {
          const historyData = (response as any).history
          historyMessages = historyData.map((msg: any) => ({
            id: msg.id || Date.now().toString(),
            content: msg.parts?.[0]?.text || msg.content || '',
            isUser: msg.role === 'user',
            timestamp: new Date(msg.timestamp),
            status: 'sent' as const,
            metadata: processHistoryMessageMetadata(msg),
            clientTimestamp: new Date(msg.timestamp).getTime(),
          }))
        }

        // 替换模式（第一页）
        chatStorage.addHistoryMessages(
          historyMessages,
          (response as any).hasMore || false,
          1,
          false // append = false，替换模式
        )
        chatStorage.updateLastSyncTimestamp()
      }
    } catch (error) {
      console.error('Failed to load initial chat history:', error)
    } finally {
      chatStorage.setLoading(false)
    }
  }, [])

  // 监听存储状态变化
  useEffect(() => {
    const unsubscribe = chatStorage.subscribe((state) => {
      const newMessages = state.messages.size > 0 || state.tempMessages.size > 0
        ? chatStorage.getMessagesForRender()
        : []

      setMessages(newMessages)
      setIsLoading(state.isLoading)
      setIsLoadingMore(state.isLoadingMore)
      setHasMoreMessages(state.hasMoreMessages)
    })

    // 初始化数据 - 始终重新加载，避免缓存问题
    loadInitialHistory()

    return () => {
      unsubscribe()
    }
  }, [loadInitialHistory])

  // 完全按照app端的convertMessage逻辑处理历史消息的metadata
  const processHistoryMessageMetadata = (msg: any) => {
    // 处理任务相关的元数据 - 完全按照app端格式
    const metadata: any = {
      ...(msg.metadata || {})
    };

    // 如果有任务相关的元数据，确保转换为正确的格式（app端格式）
    if (metadata && 'taskId' in metadata) {
      Object.assign(metadata, {
        taskId: metadata.taskId?.toString(),
        taskTitle: metadata.taskTitle || '未命名任务',
        taskStatus: metadata.taskStatus || 'PENDING',
        taskDueDate: metadata.taskDueDate || undefined,
        // 转换为web端PreviewCard需要的格式
        type: 'task',
        title: metadata.taskTitle || '未命名任务',
        status: metadata.taskStatus === 'COMPLETED' ? 'completed' :
                metadata.taskStatus === 'IN_PROGRESS' ? 'in_progress' : 'pending',
        dueDate: metadata.taskDueDate,
        actionType: metadata.actionType || 'TASK_CREATED'
      });
    }

    // 如果有订阅相关的元数据
    if (metadata && 'subscriptionId' in metadata) {
      Object.assign(metadata, {
        subscriptionId: metadata.subscriptionId?.toString(),
        subscriptionName: metadata.subscriptionName || '未命名订阅',
        subscriptionPrice: metadata.subscriptionPrice || 0,
        subscriptionCurrency: metadata.subscriptionCurrency || 'CNY',
        subscriptionBillingCycle: metadata.subscriptionBillingCycle || 'monthly',
        subscriptionStartDate: metadata.subscriptionStartDate || new Date().toISOString(),
        subscriptionIsActive: metadata.subscriptionIsActive !== false,
        // 转换为web端PreviewCard需要的格式
        type: 'subscription',
        name: metadata.subscriptionName || '未命名订阅',
        price: metadata.subscriptionPrice || 0,
        billingCycle: metadata.subscriptionBillingCycle || 'monthly',
        nextBilling: metadata.subscriptionStartDate,
        status: (metadata.subscriptionIsActive !== false) ? 'active' : 'cancelled',
        actionType: metadata.actionType || 'SUBSCRIPTION_CREATED'
      });
    }

    // 处理习惯相关的元数据
    if (metadata && 'habitId' in metadata) {
      Object.assign(metadata, {
        habitId: metadata.habitId?.toString(),
        habitTitle: metadata.habitTitle || '未命名习惯',
        habitIcon: metadata.habitIcon || 'star',
        habitColor: metadata.habitColor || '#4A90E2',
        habitFrequency: metadata.habitFrequency || 'daily',
        habitIsCompleted: metadata.habitIsCompleted || false,
        habitNote: metadata.habitNote || undefined,
        // 转换为web端PreviewCard需要的格式
        type: 'habit',
        title: metadata.habitTitle || '未命名习惯',
        frequency: metadata.habitFrequency || 'daily',
        isCompleted: metadata.habitIsCompleted || false,
        actionType: metadata.actionType || 'HABIT_CREATED'
      });
    }

    // 处理任务拆解相关的元数据
    if (metadata && 'decompositionParentTaskId' in metadata) {
      Object.assign(metadata, {
        // 转换为web端PreviewCard需要的格式
        type: 'task_decomposition',
        parentTask: metadata.decompositionParentTaskTitle,
        subtasks: metadata.decompositionSubtasks || [],
        subtaskCount: metadata.decompositionSubtaskCount || 0,
        parentTaskId: metadata.decompositionParentTaskId,
        actionType: metadata.actionType || 'TASK_DECOMPOSED_WITH_SUBTASKS'
      });
    }

    return Object.keys(metadata).length > 0 ? metadata : undefined;
  }

  // 加载更多历史消息
  const loadMoreHistory = useCallback(async () => {
    if (!hasMoreMessages || isLoadingMore) return

    chatStorage.setLoadingMore(true)
    try {
      const nextPage = chatStorage.getNextPage()
      const pageSize = chatStorage.getPageSize()

      const response = await chatApi.getHistory(nextPage, pageSize)
      if (response.success) {
        let historyMessages: ChatMessage[] = []

        if ((response as any).history) {
          const historyData = (response as any).history
          historyMessages = historyData.map((msg: any) => ({
            id: msg.id || Date.now().toString(),
            content: msg.parts?.[0]?.text || msg.content || '',
            isUser: msg.role === 'user',
            timestamp: new Date(msg.timestamp),
            status: 'sent' as const,
            metadata: processHistoryMessageMetadata(msg),
            clientTimestamp: new Date(msg.timestamp).getTime(),
          }))
        }

        chatStorage.addHistoryMessages(
          historyMessages,
          (response as any).hasMore || false,
          nextPage,
          true // append = true，追加模式
        )
      }
    } catch (error) {
      console.error('Failed to load more chat history:', error)
    } finally {
      chatStorage.setLoadingMore(false)
    }
  }, [hasMoreMessages, isLoadingMore])

  // 发送消息
  const sendMessage = async (content: string) => {
    // 在乐观更新前先捕获上下文，避免重复包含当前输入（参考移动端实现）
    const contextMessages = chatStorage.getRecentMessagesForContext(15)

    // 添加乐观更新
    const tempId = chatStorage.addOptimisticMessage(content)
    setIsTyping(true)

    try {
      const response = await chatApi.sendMessage(content, undefined, contextMessages, tempId)

      // 立即确认用户消息为已发送（不等待AI回复）
      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        content,
        isUser: true,
        timestamp: new Date(),
        status: 'sent',
        clientTimestamp: Date.now(),
        serverTimestamp: Date.now(),
      }
      chatStorage.confirmMessage(tempId, userMessage)

      // 处理AI回复
      if (response.success && (response as any).response) {
        const directResponse = response as any

        // 处理app端格式的action并转换为metadata
        let metadata = directResponse.metadata || {}

        if (directResponse.action?.type && directResponse.action?.payload) {
          const { action } = directResponse

          // 处理任务相关的action
          if (action.type.includes('TASK') && action.payload.task) {
            const task = action.payload.task
            metadata = {
              ...metadata,
              type: 'task',
              title: task.title,
              taskTitle: task.title,  // 添加 taskTitle 字段以匹配 ChatMessage 的判断条件
              description: task.description,
              status: task.status === 'COMPLETED' ? 'completed' :
                      task.status === 'IN_PROGRESS' ? 'in_progress' : 'pending',
              taskStatus: task.status,  // 添加原始状态字段
              dueDate: task.dueDate,
              taskDueDate: task.dueDate,  // 添加 taskDueDate 字段
              priority: task.priority?.toLowerCase() || 'medium',
              taskId: task.id?.toString(),
              actionType: action.type
            }
          }

          // 处理任务拆解的action
          else if (action.type === 'TASK_DECOMPOSED_WITH_SUBTASKS' && directResponse.metadata) {
            const decompositionMetadata = directResponse.metadata
            metadata = {
              ...metadata,
              type: 'task_decomposition',
              parentTask: decompositionMetadata.decompositionParentTaskTitle,
              subtasks: decompositionMetadata.decompositionSubtasks || [],
              subtaskCount: decompositionMetadata.decompositionSubtaskCount || 0,
              parentTaskId: decompositionMetadata.decompositionParentTaskId,
              actionType: action.type
            }
          }

          // 处理其他类型的action（习惯、订阅等）
          else if (action.type.includes('HABIT') && action.payload.habit) {
            const habit = action.payload.habit
            metadata = {
              ...metadata,
              type: 'habit',
              title: habit.title,
              habitTitle: habit.title,  // 添加 habitTitle 字段以匹配 ChatMessage 的判断条件
              frequency: habit.frequency || 'daily',
              habitFrequency: habit.frequency || 'daily',  // 添加 habitFrequency 字段
              isCompleted: action.type === 'HABIT_ALREADY_CHECKED_IN' || !!action.payload.habitLog,
              habitIsCompleted: action.type === 'HABIT_ALREADY_CHECKED_IN' || !!action.payload.habitLog,  // 添加 habitIsCompleted 字段
              habitId: habit.id?.toString(),
              habitIcon: habit.icon || 'star',  // 添加 habitIcon 字段
              habitColor: habit.color || '#4A90E2',  // 添加 habitColor 字段
              actionType: action.type
            }
          }

          else if (action.type === 'SUBSCRIPTION_CREATED' && action.payload.subscription) {
            const subscription = action.payload.subscription
            metadata = {
              ...metadata,
              type: 'subscription',
              name: subscription.name,
              subscriptionName: subscription.name,  // 添加 subscriptionName 字段以匹配 ChatMessage 的判断条件
              price: subscription.price,
              subscriptionPrice: subscription.price,  // 添加 subscriptionPrice 字段
              billingCycle: subscription.billingCycle,
              subscriptionBillingCycle: subscription.billingCycle,  // 添加 subscriptionBillingCycle 字段
              nextBilling: subscription.startDate,
              subscriptionStartDate: subscription.startDate,  // 添加 subscriptionStartDate 字段
              status: subscription.isActive ? 'active' : 'cancelled',
              subscriptionIsActive: subscription.isActive,  // 添加 subscriptionIsActive 字段
              subscriptionId: subscription.id?.toString(),
              subscriptionCurrency: 'CNY',  // 添加默认货币
              actionType: action.type
            }
          }
        }

        const aiMessage: ChatMessage = {
          id: directResponse.messageId || `ai_${Date.now()}`,
          content: directResponse.response,
          isUser: false,
          timestamp: new Date(),
          status: 'sent',
          metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
          clientTimestamp: Date.now(),
          serverTimestamp: Date.now(),
        }

        chatStorage.addReceivedMessage(aiMessage)
        chatStorage.updateLastSyncTimestamp()
      } else {
        // 如果没有AI回复，但API调用成功，用户消息仍然是已发送状态
        console.warn('No AI response received, but message was sent successfully')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      chatStorage.markMessageFailed(tempId, error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setIsTyping(false)
    }
  }

  // 重试失败的消息
  const retryMessage = async (messageId: string) => {
    const message = chatStorage.retryMessage(messageId)
    if (!message) return

    setIsTyping(true)

    try {
      // 获取上下文消息用于重试
      const contextMessages = chatStorage.getRecentMessagesForContext(15)
      const response = await chatApi.sendMessage(message.content, undefined, contextMessages, messageId)
      
      if (response.success && (response as any).response) {
        // 确认消息
        const confirmedMessage: ChatMessage = {
          id: `user_${Date.now()}`,
          content: message.content,
          isUser: true,
          timestamp: new Date(),
          status: 'sent',
          clientTimestamp: message.clientTimestamp,
          serverTimestamp: Date.now(),
        }
        chatStorage.confirmMessage(messageId, confirmedMessage)

        // 添加AI回复
        const directResponse = response as any
        const aiMessage: ChatMessage = {
          id: directResponse.messageId || `ai_${Date.now()}`,
          content: directResponse.response,
          isUser: false,
          timestamp: new Date(),
          status: 'sent',
          metadata: directResponse.metadata,
          clientTimestamp: Date.now(),
          serverTimestamp: Date.now(),
        }
        
        chatStorage.addReceivedMessage(aiMessage)
      } else {
        chatStorage.markMessageFailed(messageId, 'No response from server')
      }
    } catch (error) {
      console.error('Failed to retry message:', error)
      chatStorage.markMessageFailed(messageId, error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setIsTyping(false)
    }
  }

  // 无限滚动检测
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreMessages && !isLoadingMore) {
          loadMoreHistory()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [hasMoreMessages, isLoadingMore, loadMoreHistory])

  // 移除滚动监听，因为使用 column-reverse 布局

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dopamind-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('chat.loading_messages')}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative"
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colors.background
      }}
    >
      {/* 头部 */}
      <div
        className="flex items-center justify-between px-6 border-b h-[64px]"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.border
        }}
      >
        <h1 className="text-xl font-semibold" style={{ color: colors.text }}>{t('chat.title')}</h1>
      </div>

      {/* 消息区域 */}
      <div
        ref={chatContainerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          backgroundColor: colors.background,
          display: 'flex',
          flexDirection: 'column-reverse'
        }}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-dopamind-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-dopamind-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('chat.start_conversation')}</h3>
              <p className="text-gray-500 max-w-md">
                {t('chat.welcome_message')}
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '16px' }}>
            <div ref={messagesEndRef} />

            {isTyping && <TypingIndicator />}

            {messages.map((message) => (
              <ChatMessageComponent
                key={message.id}
                message={message}
                onRetry={() => retryMessage(message.id)}
              />
            ))}

            {/* 加载更多指示器 */}
            {hasMoreMessages && (
              <div ref={loadMoreRef} className="flex justify-center py-4">
                {isLoadingMore ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-dopamind-600"></div>
                    <span className="text-sm">{t('chat.loading_history')}</span>
                  </div>
                ) : (
                  <button
                    onClick={loadMoreHistory}
                    className="text-dopamind-600 hover:text-dopamind-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-dopamind-50 transition-colors"
                  >
                    {t('chat.load_more_history')}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 输入区域 */}
      <div
        style={{
          borderTop: `1px solid ${colors.border}`,
          backgroundColor: colors.background,
          flexShrink: 0
        }}
      >
        <ChatInput onSendMessage={sendMessage} disabled={isTyping} prefilledMessage={prefilledMessage} />
      </div>
    </div>
  )
}