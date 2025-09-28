'use client'

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  Target,
  Settings,
  Plus,
  Check,
  Coffee,
  Bed,
  Clock,
  Timer,
  ChevronRight,
  ListTodo
} from 'lucide-react'
import { Task } from '@/types/task'
import { TimerMode, TimerState, TodayFocusStats } from '@/types/focus'
import { useFocus } from '@/hooks/useFocus'
import { useThemeColors } from '@/hooks/useThemeColor'
import { useTheme } from '@/contexts/ThemeContext'
import { useLocalization } from '@/hooks/useLocalization'
import { useTodayFocusData } from '@/hooks/useTodayFocusData'
import { FocusStats } from './FocusStats'
import { FocusTaskList } from './FocusTaskList'
import { FocusCompletionDialog } from './FocusCompletionDialog'
import { PepTalkDialog } from './PepTalkDialog'
import { StuckSupportDialog } from './StuckSupportDialog'
import { focusApi } from '@/lib/api'
import { taskStore } from '@/stores/taskStore'
import { useSearchParams, useRouter } from 'next/navigation'

interface FocusPageProps {}

function FocusPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const colors = useThemeColors()
  const { actualTheme } = useTheme()
  const { t } = useLocalization()

  // 当前选中的任务
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [fullTaskDetail, setFullTaskDetail] = useState<Task | null>(null)
  const [currentSubtask, setCurrentSubtask] = useState<Task | null>(null)

  // 处理来自URL的任务参数
  useEffect(() => {
    const taskIdParam = searchParams?.get('taskId')
    let resolvedTask: Task | null = null

    if (taskIdParam) {
      const taskId = parseInt(taskIdParam)
      if (!Number.isNaN(taskId)) {
        const cachedTask = taskStore.getTask(taskId)
        if (cachedTask) {
          resolvedTask = cachedTask
          taskStore.setCurrentFocusTaskId(taskId)
        }
      }
    }

    if (!resolvedTask) {
      resolvedTask = taskStore.getCurrentFocusTask() ?? null
    }

    if (resolvedTask) {
      setCurrentTask(resolvedTask)
      setFullTaskDetail(resolvedTask)
      taskStore.setTask(resolvedTask)
      if (resolvedTask.id) {
        taskStore.setCurrentFocusTaskId(resolvedTask.id)
      }
    } else {
      setCurrentTask(null)
      setFullTaskDetail(null)
      taskStore.clearCurrentFocusTask()
    }
  }, [searchParams])

  // 处理任务选择并存储到 taskStore
  const handleTaskSelect = useCallback((task: Task) => {
    setCurrentTask(task)
    // 确保任务也存储到全局缓存中，以便任务详情页能够访问
    taskStore.setTask(task)
    taskStore.setCurrentFocusTaskId(task.id)
    setFullTaskDetail(task)
  }, [])

  // 弹窗状态
  const [showPepTalkDialog, setShowPepTalkDialog] = useState(false)
  const [showStuckSupportDialog, setShowStuckSupportDialog] = useState(false)
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const [showNoTaskDialog, setShowNoTaskDialog] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [pepTalkText, setPepTalkText] = useState('')
  const [isPepTalkLoading, setIsPepTalkLoading] = useState(false)
  const [stuckSupportText, setStuckSupportText] = useState('')
  const [isStuckSupportLoading, setIsStuckSupportLoading] = useState(false)

  // 完成状态
  const [completionData, setCompletionData] = useState<{
    duration: number
    taskTitle: string
  } | null>(null)
  const [isSubmittingCompletion, setIsSubmittingCompletion] = useState(false)
  const [completionSessionId, setCompletionSessionId] = useState<string | null>(null)

  // 动画状态
  const [pulseScale, setPulseScale] = useState(1)
  const [celebrationScale, setCelebrationScale] = useState(1)
  const [breathingOpacity, setBreathingOpacity] = useState(0)
  const [particleOpacity, setParticleOpacity] = useState(0)
  const [particleY, setParticleY] = useState(100)

  // 统计数据 - 使用新的 hook
  const {
    data: focusStats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats
  } = useTodayFocusData()

  const isHandlingCompletion = useRef(false)

  // 专注计时器
  const {
    timerState,
    currentMode: focusMode,
    timeLeft,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode: switchTimerMode,
    localizedTimerConfigs: timerConfigs
  } = useFocus({
    onComplete: () => {} // 临时的空函数，稍后会设置
  })

  // 计时器完成处理
  const handleTimerComplete = useCallback(async () => {
    if (isHandlingCompletion.current) return

    isHandlingCompletion.current = true

    // 震动效果（在 Web 中使用 Vibration API，如果支持的话）
    if ('vibrate' in navigator) {
      navigator.vibrate([500, 200, 500])
    }

    if (focusMode === 'focus') {
      // 立即显示完成弹窗
      const duration = timerConfigs[focusMode].duration
      setCompletionData({
        duration,
        taskTitle: currentTask?.title || t('focus.no_task')
      })
      setShowCompletionDialog(true)
      setCelebrationScale(1.2)
      setTimeout(() => setCelebrationScale(1), 600)

      // 后台创建 focus session
      try {
        const response = await focusApi.startSession({
          duration,
          type: 'focus',
          taskId: currentTask?.id?.toString()
        })

        if (response.success && response.data) {
          const sessionIdentifier = response.data.sessionId ??
            (response.data.id !== undefined ? String(response.data.id) : null)

          if (sessionIdentifier) {
            setCompletionSessionId(sessionIdentifier)
          }
          console.log('Focus session created:', response.data)
          setSaveError(null)
          // 重新加载统计数据
          refetchStats()
        }
      } catch (error) {
        console.error('Failed to create focus session:', error)
        setSaveError(t('focus.save_error'))
      }
    } else {
      // 休息结束，后台同步到服务器
      const sessionType = focusMode === 'shortBreak' ? 'shortBreak' :
                          focusMode === 'longBreak' ? 'longBreak' : 'focus'

      focusApi.startSession({
        duration: timerConfigs[focusMode].duration,
        type: sessionType,
        taskId: currentTask?.id?.toString()
      }).then((sessionData) => {
        console.log('Break session synced:', sessionData)
        setSaveError(null)
        refetchStats()
      }).catch((error) => {
        console.error('Failed to sync break session:', error)
        setSaveError(t('focus.break_sync_error'))
      })

      // 切换到专注模式
      switchTimerMode('focus')
    }

    isHandlingCompletion.current = false
  }, [focusMode, timerConfigs, currentTask, refetchStats, switchTimerMode, t])

  // 设置计时器完成回调
  useEffect(() => {
    if (timerState === 'completed') {
      handleTimerComplete()
    }
  }, [timerState, handleTimerComplete])

  // 提前完成专注
  const handleEarlyComplete = useCallback(async () => {
    if (isHandlingCompletion.current) return

    isHandlingCompletion.current = true
    pauseTimer()

    if ('vibrate' in navigator) {
      navigator.vibrate([500, 200, 500])
    }

    if (focusMode === 'focus' || focusMode === 'countup') {
      let actualDuration: number
      if (focusMode === 'countup') {
        actualDuration = timeLeft
      } else {
        const totalDuration = timerConfigs[focusMode].duration
        actualDuration = totalDuration - timeLeft
      }

      // 立即显示完成弹窗
      setCompletionData({
        duration: actualDuration,
        taskTitle: currentTask?.title || t('focus.no_task')
      })
      setShowCompletionDialog(true)
      setCelebrationScale(1.2)
      setTimeout(() => setCelebrationScale(1), 600)

      // 后台创建 focus session
      try {
        const response = await focusApi.startSession({
          duration: actualDuration,
          type: 'focus',
          taskId: currentTask?.id?.toString()
        })

        if (response.success && response.data) {
          const sessionIdentifier = response.data.sessionId ??
            (response.data.id !== undefined ? String(response.data.id) : null)

          if (sessionIdentifier) {
            setCompletionSessionId(sessionIdentifier)
          }
          console.log('Early completed focus session created:', response.data)
          setSaveError(null)
          // 重新加载统计数据
          refetchStats()
        }
      } catch (error) {
        console.error('Failed to create early completed focus session:', error)
        setSaveError(t('focus.save_error'))
      }
    }

    isHandlingCompletion.current = false
  }, [focusMode, timeLeft, pauseTimer, timerConfigs, currentTask, refetchStats, t])

  // 处理完成弹窗提交
  const handleCompletionSubmit = useCallback(async (summary: string) => {
    if (!completionSessionId) {
      console.error('No session ID available for summary submission')
      setShowCompletionDialog(false)
      setCompletionData(null)
      return
    }

    setIsSubmittingCompletion(true)

    try {
      // 提交总结到现有的 focus session
      const response = await focusApi.saveSummary(completionSessionId, summary)

      if (response.success) {
        console.log('Focus session summary saved:', response.data)

        // 关闭弹窗
        setShowCompletionDialog(false)
        setCompletionData(null)
        setCompletionSessionId(null)

        // 导航到聊天页面，如同移动端
        // TODO: 这里可以添加导航到聊天页面的逻辑
        // router.push('/chat?focus_completed=true')

        // 刷新统计数据
        refetchStats()
      } else {
        throw new Error(response.error?.message || 'Failed to save summary')
      }
    } catch (error) {
      console.error('Failed to save focus completion summary:', error)
      setSaveError(t('focus.summary_save_error'))
    } finally {
      setIsSubmittingCompletion(false)
    }
  }, [completionSessionId, refetchStats, t])

  // 处理完成弹窗关闭
  const handleCompletionClose = useCallback(() => {
    setShowCompletionDialog(false)
    setCompletionData(null)
    setCompletionSessionId(null)
    setIsSubmittingCompletion(false)
  }, [])

  // 处理鼓励弹窗确认
  const handlePepTalkConfirm = useCallback(() => {
    setShowPepTalkDialog(false)
    startTimer()
  }, [startTimer])

  // 处理鼓励弹窗取消
  const handlePepTalkCancel = useCallback(() => {
    setShowPepTalkDialog(false)
    setPepTalkText('')
  }, [])

  // 处理"我卡住了"
  const handleImStuck = useCallback(async () => {
    if (!currentTask && focusMode === 'focus') return // 专注模式必须有任务，正计时模式可以没任务

    setShowStuckSupportDialog(true)
    setIsStuckSupportLoading(true)
    setStuckSupportText('')

    try {
      // 获取用户语言设置
      const userLanguage = navigator.language.startsWith('zh') ?
        (navigator.language === 'zh-TW' ? 'zh-TW' : 'zh') : 'en'

      const response = await focusApi.getStuckSupport(
        currentTask?.title || t('focus.no_task'),
        userLanguage
      )

      if (response.success && response.data?.support_text) {
        setStuckSupportText(response.data.support_text)
      } else {
        // 使用后备支持语
        setStuckSupportText(focusMode === 'countup' ? t('focus.countup_stuck_fallback') : t('focus.get_stuck_fallback'))
      }
    } catch (error) {
      console.error('Failed to get stuck support:', error)
      // 使用后备支持语
      setStuckSupportText(focusMode === 'countup' ? t('focus.countup_stuck_fallback') : t('focus.get_stuck_fallback'))
    } finally {
      setIsStuckSupportLoading(false)
    }
  }, [currentTask, focusMode, t])

  // 处理"我卡住了"弹窗关闭
  const handleStuckSupportClose = useCallback(() => {
    setShowStuckSupportDialog(false)
    setStuckSupportText('')
  }, [])

  // 处理"聊聊我卡住了"
  const handleChatAboutStuck = useCallback(() => {
    setShowStuckSupportDialog(false)

    // 使用setTimeout确保弹窗关闭动画完成后再导航
    setTimeout(() => {
      const chatMessage = currentTask
        ? t('focus.stuck_chat_message', { taskTitle: currentTask.title })
        : t('focus.countup_stuck_chat_message')

      router.push(`/chat?prefilledMessage=${encodeURIComponent(chatMessage)}`)
    }, 100)
  }, [currentTask, t, router])

  // 脉冲和呼吸动画效果 - 修复闪烁问题，使用平滑动画
  useEffect(() => {
    if (timerState === 'running') {
      console.log('🎯 启动专注动画')

      // 使用时间戳来创建平滑的正弦波动画
      const startTime = Date.now()

      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000 // 秒

        // 脉冲动画 - 3秒周期，平滑的正弦波
        const pulseProgress = (elapsed % 3) / 3 // 0-1
        const pulseValue = 1 + 0.03 * Math.sin(pulseProgress * Math.PI * 2) // 1.0-1.03
        setPulseScale(pulseValue)

        // 呼吸背景动画 - 6秒周期
        const breathingProgress = (elapsed % 6) / 6 // 0-1
        const breathingValue = 0.3 + 0.7 * (Math.sin(breathingProgress * Math.PI * 2) + 1) / 2 // 0.3-1.0
        setBreathingOpacity(breathingValue)

        // 粒子动画 - 8秒周期
        const particleProgress = (elapsed % 8) / 8 // 0-1
        const particleYValue = 100 - particleProgress * 110 // 100到-10
        setParticleY(particleYValue)

        // 粒子透明度 - 抛物线函数
        const particleOpacityValue = particleProgress <= 0.5
          ? particleProgress * 1.2
          : (1 - particleProgress) * 1.2
        setParticleOpacity(Math.min(0.6, particleOpacityValue))
      }

      // 使用 requestAnimationFrame 来确保平滑动画
      let animationId: number
      const animationLoop = () => {
        animate()
        animationId = requestAnimationFrame(animationLoop)
      }
      animationLoop()

      return () => {
        console.log('🛑 停止专注动画')
        cancelAnimationFrame(animationId)
      }
    } else {
      console.log('⏸️ 重置动画状态')
      setPulseScale(1)
      setBreathingOpacity(0)
      setParticleOpacity(0)
      setParticleY(100)
    }
  }, [timerState])

  // 切换计时器
  const toggleTimer = async () => {
    if (timerState === 'running') {
      pauseTimer()
      return
    }
    if (timerState === 'paused') {
      startTimer()
      return
    }
    if (timerState === 'idle' && focusMode === 'focus' && !currentTask) {
      setShowNoTaskDialog(true)
      return
    }

    // 专注模式和正计时模式都显示鼓励弹窗
    if (timerState === 'idle' && (focusMode === 'focus' || focusMode === 'countup')) {
      setShowPepTalkDialog(true)
      setIsPepTalkLoading(true)
      setPepTalkText('')

      try {
        // 获取用户语言设置
        const userLanguage = navigator.language.startsWith('zh') ?
          (navigator.language === 'zh-TW' ? 'zh-TW' : 'zh') : 'en'

        // 准备 subtask 信息，参考移动端实现
        let subtaskInfo = undefined
        if (currentTask?._count && currentTask._count.subTasks > 0) {
          subtaskInfo = {
            totalSubtasks: currentTask._count.subTasks,
            completedSubtasks: currentTask._count.completedSubTasks || 0
          }
        }

        if (currentTask) {
          const response = await focusApi.getPepTalk(
            currentTask.title,
            userLanguage,
            undefined, // recentMessages - 暂时不传递聊天历史
            subtaskInfo
          )

          if (response.success && response.data?.pep_talk) {
            setPepTalkText(response.data.pep_talk)
          } else {
            // 使用后备鼓励语
            setPepTalkText(focusMode === 'countup' ? t('focus.countup_pep_talk_fallback') : t('focus.pep_talk_fallback'))
          }
        } else {
          // 正计时模式没有任务时的通用鼓励语
          setPepTalkText(focusMode === 'countup' ? t('focus.countup_pep_talk_fallback') : t('focus.pep_talk_fallback'))
        }
      } catch (error) {
        console.error('Failed to get pep talk:', error)
        // 使用后备鼓励语
        setPepTalkText(focusMode === 'countup' ? t('focus.countup_pep_talk_fallback') : t('focus.pep_talk_fallback'))
      } finally {
        setIsPepTalkLoading(false)
      }
      return
    }

    // 其他模式直接开始
    startTimer()
  }

  // 格式化时间
  const formatTime = (seconds: number) => {
    if (seconds >= 3600) {
      const h = Math.floor(seconds / 3600).toString().padStart(2, '0')
      const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
      return `${h}:${m}`
    } else {
      const m = Math.floor(seconds / 60).toString().padStart(2, '0')
      const s = (seconds % 60).toString().padStart(2, '0')
      return `${m}:${s}`
    }
  }

  // 获取模式图标
  const getModeIcon = (mode: TimerMode) => {
    switch (mode) {
      case 'focus': return Timer
      case 'shortBreak': return Coffee
      case 'longBreak': return Bed
      case 'countup': return Clock
      default: return Timer
    }
  }

  // 计算进度
  const getProgress = () => {
    if (focusMode === 'countup') return 0
    const totalDuration = timerConfigs[focusMode].duration
    return totalDuration > 0 ? 1 - (timeLeft / totalDuration) : 0
  }

  // 导航到任务详情页
  const handleTaskDetailNavigation = () => {
    const task = fullTaskDetail || currentTask
    if (task?.id) {
      // 确保任务存储到全局缓存
      taskStore.setTask(task)
      router.push(`/tasks/${task.id}`)
    }
  }

  const progress = getProgress()

  return (
    <div
      className="h-full overflow-auto relative"
      style={{ backgroundColor: colors.background }}
    >
      {/* 沉浸式呼吸背景 - 照搬移动端 */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundColor: `${timerConfigs[focusMode].color}20`,
          opacity: timerState === 'running' ? breathingOpacity * 0.5 : 0,
          transition: timerState === 'running' ? 'none' : 'opacity 0.3s'
        }}
      />

      {/* 粒子效果 - 照搬移动端 */}
      {timerState === 'running' && particleOpacity > 0.01 && (
        <>
          {/* 粒子1 */}
          <div
            className="fixed w-3 h-3 rounded-full pointer-events-none"
            style={{
              left: '20%',
              top: `${particleY}%`,
              opacity: particleOpacity * 0.8,
              transform: `translateY(-50%)`,
              backgroundColor: timerConfigs[focusMode].color,
              boxShadow: `0 0 10px ${timerConfigs[focusMode].color}40`
            }}
          />
          {/* 粒子2 */}
          <div
            className="fixed w-2 h-2 rounded-full pointer-events-none"
            style={{
              right: '15%',
              top: `${particleY + 15}%`,
              opacity: particleOpacity * 0.6,
              transform: `translateY(-50%)`,
              backgroundColor: `${timerConfigs[focusMode].color}CC`,
              boxShadow: `0 0 8px ${timerConfigs[focusMode].color}60`
            }}
          />
          {/* 粒子3 */}
          <div
            className="fixed w-2.5 h-2.5 rounded-full pointer-events-none"
            style={{
              left: '50%',
              top: `${particleY + 8}%`,
              opacity: particleOpacity * 0.7,
              transform: `translateX(-50%) translateY(-50%)`,
              backgroundColor: `${timerConfigs[focusMode].color}DD`,
              boxShadow: `0 0 12px ${timerConfigs[focusMode].color}50`
            }}
          />
          {/* 粒子4 - 额外的小粒子 */}
          <div
            className="fixed w-1.5 h-1.5 rounded-full pointer-events-none"
            style={{
              left: '30%',
              top: `${particleY + 25}%`,
              opacity: particleOpacity * 0.5,
              transform: `translateY(-50%)`,
              backgroundColor: `${timerConfigs[focusMode].color}AA`,
              boxShadow: `0 0 6px ${timerConfigs[focusMode].color}30`
            }}
          />
          {/* 粒子5 */}
          <div
            className="fixed w-1 h-1 rounded-full pointer-events-none"
            style={{
              right: '35%',
              top: `${particleY + 5}%`,
              opacity: particleOpacity * 0.4,
              transform: `translateY(-50%)`,
              backgroundColor: `${timerConfigs[focusMode].color}88`,
              boxShadow: `0 0 4px ${timerConfigs[focusMode].color}20`
            }}
          />
        </>
      )}

      {/* 头部 */}
      <div
        className="flex items-center justify-between px-6 border-b h-[64px]"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.border
        }}
      >
        <h1 className="text-xl font-semibold" style={{ color: colors.text }}>{t('focus.title')}</h1>
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-xl transition-colors"
            style={{
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.border}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Settings className="w-6 h-6 text-dopamind-600" />
          </button>
          <button
            className="p-2 rounded-xl transition-colors"
            style={{
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.border}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Plus className="w-6 h-6 text-dopamind-600" />
          </button>
        </div>
      </div>

      <div className="pb-6">
        {/* 当前任务卡片 */}
        {(fullTaskDetail || currentTask) && (
          <div
            className="rounded-2xl p-6 shadow-sm m-4"
            style={{
              backgroundColor: colors.card.background,
              borderColor: colors.border,
              border: `1px solid ${colors.border}`
            }}
          >
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <Target className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold ml-2" style={{ color: colors.text }}>{t('focus.current_task')}</h3>
            </div>
            <div
              className="p-4 rounded-xl cursor-pointer transition-colors"
              style={{
                backgroundColor: `${timerConfigs.focus.color}10`,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: `${timerConfigs.focus.color}30`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${timerConfigs.focus.color}20`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${timerConfigs.focus.color}10`
              }}
              onClick={handleTaskDetailNavigation}
            >
              <h4 className="text-lg font-semibold mb-2 line-clamp-2" style={{ color: colors.text }}>
                {(fullTaskDetail || currentTask)?.title}
              </h4>

              {/* 子任务进度 */}
              {(fullTaskDetail || currentTask)?._count && ((fullTaskDetail || currentTask)?._count?.subTasks || 0) > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <ListTodo className="w-3 h-3" style={{ color: colors.textSecondary }} />
                      <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                        {(fullTaskDetail || currentTask)?._count?.completedSubTasks || 0}/{(fullTaskDetail || currentTask)?._count?.subTasks} {t('tasks.subtasks')}
                      </span>
                    </div>
                    <span className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
                      {Math.round((((fullTaskDetail || currentTask)?._count?.completedSubTasks || 0) / ((fullTaskDetail || currentTask)?._count?.subTasks || 1)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full rounded-full h-1" style={{ backgroundColor: colors.border }}>
                    <div
                      className="h-1 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: timerConfigs.focus.color,
                        width: `${Math.round((((fullTaskDetail || currentTask)?._count?.completedSubTasks || 0) / ((fullTaskDetail || currentTask)?._count?.subTasks || 1)) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              )}

              {/* 当前子任务 */}
              {currentSubtask && (
                <div className="mt-4 pt-3" style={{ borderTopWidth: '1px', borderTopStyle: 'solid', borderTopColor: `${timerConfigs.focus.color}30` }}>
                  <div className="flex items-center mb-1">
                    <ChevronRight className="w-3 h-3 mr-1" style={{ color: timerConfigs.focus.color }} />
                    <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: timerConfigs.focus.color }}>{t('focus.current_subtask')}</span>
                  </div>
                  <p className="text-sm font-medium line-clamp-2" style={{ color: colors.text }}>
                    {currentSubtask.title}
                  </p>
                  {currentSubtask.description && (
                    <p className="text-xs line-clamp-3 mt-1" style={{ color: colors.textSecondary }}>
                      {currentSubtask.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 计时器区域 - 照搬移动端设计 */}
        <div className="flex flex-col items-center px-4 mb-12">
          <div className="relative mb-8" style={{ width: '200px', height: '200px' }}>
            {/* 背景圆环 */}
            <div
              className="absolute inset-0 rounded-full border-8"
              style={{
                width: '200px',
                height: '200px',
                borderColor: colors.border
              }}
            />

            {/* 脉冲圆环 - 会呼吸的圆环，只有边框，不显示进度 */}
            <div
              className="absolute inset-0 rounded-full border-8"
              style={{
                width: '200px',
                height: '200px',
                borderColor: `${timerConfigs[focusMode].color}40`, // 半透明，作为呼吸效果
                transform: `scale(${pulseScale})`,
                transition: timerState === 'running' ? 'none' : 'transform 0.3s ease'
              }}
            />

            {/* 进度圆环 - 只显示进度，不参与脉冲动画 */}
            <svg
              className="absolute inset-0"
              width="200"
              height="200"
              style={{ transform: 'rotate(-90deg)' }}
            >
              <circle
                cx="100"
                cy="100"
                r="92"
                fill="none"
                stroke={timerConfigs[focusMode].color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${progress * 577.5} 577.5`}
                className="transition-all duration-300"
                style={{ opacity: 0.9 }}
              />
            </svg>

            {/* 中心呼吸小点 - 照搬移动端的 progressArc */}
            <div
              className="absolute rounded-full"
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: timerConfigs[focusMode].color,
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) scale(${progress > 0 ? progress * 2 + 0.5 : 0.5})`,
                opacity: timerState === 'running' ? 0.8 : 0.4,
                transition: timerState === 'running' ? 'none' : 'all 0.3s ease'
              }}
            />

            {/* 时间显示 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {formatTime(timeLeft)}
              </div>
              <div className="text-lg font-medium text-gray-500">
                {timerState === 'running'
                  ? timerConfigs[focusMode].statusText
                  : timerConfigs[focusMode].label
                }
              </div>
              {currentTask && timerState === 'running' && (
                <div className="text-sm text-gray-500 line-clamp-1 max-w-32 text-center mt-1">
                  {currentTask.title}
                </div>
              )}
            </div>
          </div>

          {/* 控制按钮 */}
          <div className="flex items-center gap-4">
            {/* 主控制按钮 */}
            <button
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all hover:shadow-xl"
              style={{
                backgroundColor: timerState === 'running' ? '#EF4444' : '#F97316'
              }}
              onClick={toggleTimer}
            >
              {timerState === 'running' ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <div
                  className="w-0 h-0 ml-1"
                  style={{
                    borderLeft: '24px solid white',
                    borderTop: '14px solid transparent',
                    borderBottom: '14px solid transparent'
                  }}
                />
              )}
            </button>

            {/* 完成按钮 */}
            {(focusMode === 'focus' || focusMode === 'countup') && timerState === 'running' && (
              <button
                className="flex items-center gap-2 px-5 py-3 text-white rounded-full shadow-lg transition-all"
                style={{
                  backgroundColor: timerConfigs[focusMode].color
                }}
                onClick={handleEarlyComplete}
              >
                <Check className="w-5 h-5" />
                <span className="font-semibold">{t('focus.complete_button')}</span>
              </button>
            )}

            {/* 暂停时的控制按钮 */}
            {timerState === 'paused' && (
              <>
                {/* 我卡住了按钮 */}
                <button
                  className="px-4 py-2 text-sm font-medium rounded-full border transition-all hover:shadow-md"
                  style={{
                    backgroundColor: colors.button.secondary,
                    color: colors.text,
                    borderColor: actualTheme === 'light' ? '#000000' : colors.button.secondary
                  }}
                  onClick={handleImStuck}
                >
                  {t('focus.im_stuck')}
                </button>

                {/* 重置按钮 */}
                <button
                  className="px-4 py-2 text-sm font-medium rounded-full border transition-all hover:shadow-md"
                  style={{
                    backgroundColor: colors.button.secondary,
                    color: colors.text,
                    borderColor: actualTheme === 'light' ? '#000000' : colors.button.secondary
                  }}
                  onClick={resetTimer}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* 模式选择器 */}
        <div className="flex gap-2 mx-4 mb-6">
          {(Object.entries(timerConfigs) as [TimerMode, any][]).map(([mode, config]) => {
            const IconComponent = getModeIcon(mode)
            return (
              <button
                key={mode}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all ${
                  timerState === 'running' ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md'
                }`}
                onClick={() => switchTimerMode(mode)}
                disabled={timerState === 'running'}
                style={{
                  backgroundColor: focusMode === mode ? config.color : colors.card.background,
                  color: focusMode === mode ? '#FFFFFF' : colors.textSecondary,
                  borderColor: focusMode === mode ? config.color : colors.card.border,
                  boxShadow: focusMode === mode ? `0 10px 20px ${config.color}33` : 'none'
                }}
              >
                <IconComponent
                  className="w-4 h-4"
                  style={{ color: focusMode === mode ? '#FFFFFF' : colors.textSecondary }}
                />
                <span className="font-medium text-sm" style={{ color: focusMode === mode ? '#FFFFFF' : colors.text }}>
                  {config.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* 统计组件 */}
        {statsLoading ? (
          <div
            className="rounded-2xl p-6 shadow-sm m-4 border transition-colors"
            style={{
              backgroundColor: colors.card.background,
              borderColor: colors.card.border
            }}
          >
            <div className="flex items-center mb-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: `${colors.accent.blue}1f` }}
              >
                <div
                  className="w-4 h-4 rounded-full animate-pulse"
                  style={{ backgroundColor: colors.accent.blue }}
                ></div>
              </div>
              <h3 className="text-xl font-semibold ml-2" style={{ color: colors.text }}>
                {t('focus.stats.today_focus')}
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse"
                    style={{ backgroundColor: `${colors.border}66` }}
                  ></div>
                  <div
                    className="w-8 h-6 rounded mx-auto mb-1 animate-pulse"
                    style={{ backgroundColor: `${colors.border}aa` }}
                  ></div>
                  <div
                    className="w-6 h-3 rounded mx-auto animate-pulse"
                    style={{ backgroundColor: `${colors.border}66` }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        ) : focusStats ? (
          <FocusStats focusData={focusStats} />
        ) : (
          <div
            className="rounded-2xl p-6 shadow-sm m-4 border transition-colors"
            style={{
              backgroundColor: colors.card.background,
              borderColor: colors.card.border
            }}
          >
            <div className="flex items-center mb-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: `${colors.border}66` }}
              >
                <Clock className="w-4 h-4" style={{ color: colors.tabIconDefault }} />
              </div>
              <h3 className="text-xl font-semibold ml-2" style={{ color: colors.text }}>
                {t('focus.stats.today_focus')}
              </h3>
            </div>
            <div className="text-center py-4">
              <p className="mb-3" style={{ color: colors.textSecondary }}>
                {statsError || t('focus.stats.no_data')}
              </p>
              <button
                onClick={() => refetchStats()}
                className="px-4 py-2 text-white rounded-lg transition-colors"
                style={{
                  backgroundColor: colors.accent.blue,
                  boxShadow: `0 10px 20px ${colors.accent.blue}26`
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.accent.blue + 'e6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent.blue}
              >
                {t('common.retry')}
              </button>
            </div>
          </div>
        )}

        {/* 错误提示 - 更新错误状态 */}
        {(saveError || statsError) && (
          <div
            className="mx-4 mb-4 p-3 rounded-xl border"
            style={{
              backgroundColor: 'rgba(251, 191, 36, 0.12)',
              borderColor: 'rgba(251, 191, 36, 0.35)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <p className="text-sm" style={{ color: colors.text }}>
                  {saveError || statsError}
                </p>
              </div>
              <button
                onClick={() => {
                  setSaveError(null)
                  if (statsError) {
                    refetchStats()
                  }
                }}
                className="text-lg font-bold"
                style={{ color: colors.accent.orange }}
                onMouseEnter={(e) => e.currentTarget.style.color = colors.accent.orange + 'dd'}
                onMouseLeave={(e) => e.currentTarget.style.color = colors.accent.orange}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* 任务列表组件 */}
        <FocusTaskList
          currentTask={currentTask}
          onTaskSelect={handleTaskSelect}
        />
      </div>

      {/* 专注完成弹窗 */}
      {showCompletionDialog && completionData && (
        <FocusCompletionDialog
          visible={showCompletionDialog}
          onClose={handleCompletionClose}
          onSubmit={handleCompletionSubmit}
          taskTitle={completionData.taskTitle}
          duration={completionData.duration}
          isLoading={isSubmittingCompletion}
        />
      )}

      {/* AI 鼓励弹窗 */}
      {showPepTalkDialog && (
        <PepTalkDialog
          visible={showPepTalkDialog}
          taskTitle={currentTask?.title || t('focus.no_task')}
          pepTalk={pepTalkText}
          isLoading={isPepTalkLoading}
          onConfirm={handlePepTalkConfirm}
          onCancel={handlePepTalkCancel}
        />
      )}

      {/* 我卡住了支持弹窗 */}
      {showStuckSupportDialog && (
        <StuckSupportDialog
          visible={showStuckSupportDialog}
          taskTitle={currentTask?.title || t('focus.no_task')}
          supportText={stuckSupportText}
          isLoading={isStuckSupportLoading}
          onClose={handleStuckSupportClose}
          onChatAboutStuck={handleChatAboutStuck}
        />
      )}

      {/* 没有选择任务的提示弹窗 */}
      {showNoTaskDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="rounded-2xl p-6 max-w-sm w-full border shadow-lg"
            style={{
              backgroundColor: colors.card.background,
              borderColor: colors.card.border
            }}
          >
            <div
              className="flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-4"
              style={{ backgroundColor: colors.accent.orange + '22' }}
            >
              <Target className="w-6 h-6" style={{ color: colors.accent.orange }} />
            </div>
            <h3 className="text-xl font-bold text-center mb-2" style={{ color: colors.text }}>
              {t('focus.no_task_dialog.title')}
            </h3>
            <p className="text-center mb-6" style={{ color: colors.textSecondary }}>
              {t('focus.no_task_dialog.message')}
            </p>
            <button
              className="w-full py-3 text-white rounded-xl font-semibold transition-all"
              style={{
                backgroundColor: colors.button.primary,
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.button.pressed}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.button.primary}
              onClick={() => setShowNoTaskDialog(false)}
            >
              {t('common.confirm')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export const FocusPage: React.FC<FocusPageProps> = () => {
  const { t } = useLocalization()

  return (
    <Suspense fallback={
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: '#0F172A' }}>
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dopamind-600 mx-auto"></div>
          <p className="mt-2 text-sm opacity-80">{t('loading')}</p>
        </div>
      </div>
    }>
      <FocusPageContent />
    </Suspense>
  )
}

