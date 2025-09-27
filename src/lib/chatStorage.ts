// 聊天存储和缓存管理器 - 基于移动端 chatV2.ts 架构
import { storage } from '@/lib/utils'

export interface ChatMessage {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  status?: 'sending' | 'sent' | 'failed'
  metadata?: any
  // 内部状态管理
  tempId?: string
  clientTimestamp: number
  serverTimestamp?: number
  retryCount?: number
}

export interface ChatState {
  messages: Map<string, ChatMessage>
  tempMessages: Map<string, ChatMessage>
  messageOrder: string[]
  currentPage: number
  hasMoreMessages: boolean
  totalMessages: number
  lastSyncTimestamp?: string
  isLoading: boolean
  isLoadingMore: boolean
  displayedMessageCount: number
  pageSize: number
}

class ChatStorageManager {
  private static readonly STORAGE_KEY = 'dopamind-chat-storage-v2'
  private static readonly MAX_MESSAGES = 500
  private static readonly PAGE_SIZE = 20
  
  private state: ChatState = {
    messages: new Map(),
    tempMessages: new Map(),
    messageOrder: [],
    currentPage: 0,
    hasMoreMessages: true,
    totalMessages: 0,
    isLoading: false,
    isLoadingMore: false,
    displayedMessageCount: ChatStorageManager.PAGE_SIZE,
    pageSize: ChatStorageManager.PAGE_SIZE,
  }

  private listeners: Set<(state: ChatState) => void> = new Set()

  constructor() {
    this.loadFromStorage()
  }

  // 订阅状态变化
  subscribe(listener: (state: ChatState) => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  // 获取当前状态
  getState(): ChatState {
    return {
      ...this.state,
      messages: new Map(this.state.messages),
      tempMessages: new Map(this.state.tempMessages),
      messageOrder: [...this.state.messageOrder],
    }
  }

  // 通知状态变化
  private notifyListeners() {
    const currentState = this.getState()
    this.listeners.forEach(listener => listener(currentState))
    this.saveToStorage()
  }

  // 本地存储持久化
  private saveToStorage() {
    try {
      const serializedState = {
        messages: Array.from(this.state.messages.entries()),
        tempMessages: Array.from(this.state.tempMessages.entries()),
        messageOrder: this.state.messageOrder,
        currentPage: this.state.currentPage,
        hasMoreMessages: this.state.hasMoreMessages,
        totalMessages: this.state.totalMessages,
        lastSyncTimestamp: this.state.lastSyncTimestamp,
        displayedMessageCount: this.state.displayedMessageCount,
        pageSize: this.state.pageSize,
      }
      
      storage.set(ChatStorageManager.STORAGE_KEY, serializedState)
    } catch (error) {
      console.error('Failed to save chat state to storage:', error)
    }
  }

  // 从本地存储加载
  private loadFromStorage() {
    try {
      const savedState = storage.get(ChatStorageManager.STORAGE_KEY)
      if (savedState) {
        this.state = {
          ...this.state,
          messages: new Map(savedState.messages || []),
          tempMessages: new Map(savedState.tempMessages || []),
          messageOrder: savedState.messageOrder || [],
          currentPage: savedState.currentPage || 0,
          hasMoreMessages: savedState.hasMoreMessages !== false,
          totalMessages: savedState.totalMessages || 0,
          lastSyncTimestamp: savedState.lastSyncTimestamp,
          displayedMessageCount: savedState.displayedMessageCount || this.state.displayedMessageCount,
          pageSize: savedState.pageSize || ChatStorageManager.PAGE_SIZE,
        }
      }
    } catch (error) {
      console.error('Failed to load chat state from storage:', error)
    }
  }

  // 添加乐观更新消息
  addOptimisticMessage(content: string): string {
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const message: ChatMessage = {
      id: tempId,
      tempId,
      content,
      isUser: true,
      timestamp: new Date(),
      status: 'sending',
      clientTimestamp: Date.now(),
      retryCount: 0,
    }

    this.state.tempMessages.set(tempId, message)
    this.state.messageOrder.unshift(tempId)  // 使用unshift将新消息添加到前面
    this.notifyListeners()
    
    return tempId
  }

  // 确认消息 (从临时转为正式)
  confirmMessage(tempId: string, serverMessage: ChatMessage) {
    const tempMessage = this.state.tempMessages.get(tempId)
    if (!tempMessage) return

    // 移除临时消息
    this.state.tempMessages.delete(tempId)
    
    // 更新 messageOrder 中的 ID
    const orderIndex = this.state.messageOrder.indexOf(tempId)
    if (orderIndex !== -1) {
      this.state.messageOrder[orderIndex] = serverMessage.id
    }

    // 添加确认的消息
    const confirmedMessage: ChatMessage = {
      ...serverMessage,
      status: 'sent',
      clientTimestamp: tempMessage.clientTimestamp,
      serverTimestamp: Date.now(),
    }
    
    this.state.messages.set(serverMessage.id, confirmedMessage)
    this.notifyListeners()
  }

  // 标记消息失败
  markMessageFailed(tempId: string, error?: string) {
    const tempMessage = this.state.tempMessages.get(tempId)
    if (!tempMessage) return

    const failedMessage: ChatMessage = {
      ...tempMessage,
      status: 'failed',
      retryCount: (tempMessage.retryCount || 0) + 1,
    }

    this.state.tempMessages.set(tempId, failedMessage)
    this.notifyListeners()
  }

  // 添加接收到的消息
  addReceivedMessage(message: ChatMessage) {
    // 防重复
    if (this.state.messages.has(message.id)) return

    const receivedMessage: ChatMessage = {
      ...message,
      status: 'sent',
      serverTimestamp: Date.now(),
    }

    this.state.messages.set(message.id, receivedMessage)
    this.state.messageOrder.unshift(message.id)  // 新消息添加到前面
    this.cleanupIfNeeded()
    this.notifyListeners()
  }

  // 批量添加历史消息 - 完全按照移动端逻辑
  addHistoryMessages(messages: ChatMessage[], hasMore: boolean, page: number, append: boolean = false) {
    console.log('addHistoryMessages:', {
      messagesCount: messages.length,
      page,
      append,
      firstMessage: messages[0]?.content.substring(0, 50),
      lastMessage: messages[messages.length - 1]?.content.substring(0, 50)
    })

    if (append) {
      // 追加模式：历史消息加载，添加到末尾
      const additionalOrder: string[] = []

      messages.forEach(message => {
        if (!this.state.messages.has(message.id)) {
          this.state.messages.set(message.id, {
            ...message,
            status: 'sent',
          })
          additionalOrder.push(message.id)
        }
      })

      // 将历史消息添加到顺序数组末尾
      this.state.messageOrder = [...this.state.messageOrder, ...additionalOrder]
    } else {
      // 替换模式：初始加载
      this.state.messageOrder = []
      this.state.messages.clear()
      const newOrder: string[] = []

      // 按服务器返回的顺序处理，不重新排序
      messages.forEach(message => {
        if (!this.state.messages.has(message.id)) {
          this.state.messages.set(message.id, {
            ...message,
            status: 'sent',
          })
          newOrder.push(message.id) // 保持服务器返回的顺序
        }
      })

      this.state.messageOrder = newOrder
    }

    this.state.currentPage = page
    this.state.hasMoreMessages = hasMore
    this.state.totalMessages = this.state.messageOrder.length
    this.state.isLoadingMore = false

    console.log('after addHistoryMessages:', {
      totalMessages: this.state.totalMessages,
      messageOrder: this.state.messageOrder.slice(0, 3),
      hasMore: this.state.hasMoreMessages
    })

    this.cleanupIfNeeded()
    this.notifyListeners()
  }

  // 获取渲染用的消息列表
  getMessagesForRender(): ChatMessage[] {
    const allMessages: ChatMessage[] = []

    // 按 messageOrder 顺序获取消息
    for (const messageId of this.state.messageOrder) {
      const message = this.state.messages.get(messageId) || this.state.tempMessages.get(messageId)
      if (message) {
        allMessages.push(message)
      }
    }

    return allMessages
  }

  // 获取最近的消息用于API上下文
  getRecentMessagesForContext(maxCount: number = 15): ChatMessage[] {
    const messages = this.getMessagesForRender()
    return messages.slice(0, maxCount)
  }

  // 重试失败的消息
  retryMessage(tempId: string): ChatMessage | null {
    const tempMessage = this.state.tempMessages.get(tempId)
    if (!tempMessage || tempMessage.status !== 'failed') return null

    const retryMessage: ChatMessage = {
      ...tempMessage,
      status: 'sending',
      retryCount: (tempMessage.retryCount || 0) + 1,
    }

    this.state.tempMessages.set(tempId, retryMessage)
    this.notifyListeners()
    
    return retryMessage
  }

  // 内存清理 - 按照移动端逻辑，从末尾删除旧消息
  private cleanupIfNeeded() {
    const maxMessages = 200 // 和移动端保持一致
    const totalMessages = this.state.messageOrder.length

    if (totalMessages > maxMessages) {
      // 保留前面的消息（最新的），删除后面的消息（最旧的）
      const toKeep = this.state.messageOrder.slice(0, maxMessages)
      const toRemove = this.state.messageOrder.slice(maxMessages)

      // 从存储中移除这些消息
      toRemove.forEach(messageId => {
        this.state.messages.delete(messageId)
        this.state.tempMessages.delete(messageId)
      })

      this.state.messageOrder = toKeep
    }
  }

  // 设置加载状态
  setLoading(isLoading: boolean) {
    this.state.isLoading = isLoading
    this.notifyListeners()
  }

  setLoadingMore(isLoadingMore: boolean) {
    this.state.isLoadingMore = isLoadingMore
    this.notifyListeners()
  }

  // 清除所有数据
  clearAll() {
    // Reset internal state
    this.state = {
      messages: new Map(),
      tempMessages: new Map(),
      messageOrder: [],
      currentPage: 0,
      hasMoreMessages: true,
      totalMessages: 0,
      isLoading: false,
      isLoadingMore: false,
      displayedMessageCount: ChatStorageManager.PAGE_SIZE,
      pageSize: ChatStorageManager.PAGE_SIZE,
    }

    // Remove from localStorage
    storage.remove(ChatStorageManager.STORAGE_KEY)

    // Notify all listeners that chat data has been cleared
    this.notifyListeners()
  }

  // 删除本地缓存相关方法，添加缓存检查
  // 检查是否有缓存数据
  hasCachedData(): boolean {
    return this.state.messages.size > 0 || this.state.tempMessages.size > 0
  }

  // 获取分页参数
  getNextPage(): number {
    return this.state.currentPage + 1
  }

  getPageSize(): number {
    return ChatStorageManager.PAGE_SIZE
  }

  // 更新最后同步时间戳
  updateLastSyncTimestamp(timestamp?: string) {
    this.state.lastSyncTimestamp = timestamp || new Date().toISOString()
    this.notifyListeners()
  }
}

// 全局单例
export const chatStorage = new ChatStorageManager()
