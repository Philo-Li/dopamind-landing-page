'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Task, TaskQueryParams, TaskStats as TaskStatsType, Priority } from '@/types/task'
import { useLocalization } from '@/hooks/useLocalization'
import { useThemeColors } from '@/hooks/useThemeColor'
import TaskItem from './TaskItem'
import TaskStats from './TaskStats'
import {
  Search,
  Filter,
  BarChart3,
  Grid3X3,
  List,
  RefreshCw,
  ChevronDown,
  X
} from 'lucide-react'

interface TaskListProps {
  tasks: Task[]
  loading: boolean
  refreshing: boolean
  loadingMore?: boolean
  error?: string | null
  onRefresh: () => void
  onLoadMore: () => void
  onToggleStatus: (taskId: number, status: Task['status']) => Promise<void>
  onEdit: (task: Task) => void
  onDelete: (taskId: number) => void
  onFilterChange: (filters: TaskQueryParams) => void
  hasMore: boolean
  showStats?: boolean
  taskStats?: TaskStatsType | null
}

type ViewMode = 'detailed' | 'compact'

export default function TaskList({
  tasks,
  loading,
  refreshing,
  loadingMore = false,
  error,
  onRefresh,
  onLoadMore,
  onToggleStatus,
  onEdit,
  onDelete,
  onFilterChange,
  hasMore,
  showStats = false,
  taskStats
}: TaskListProps) {
  const { t } = useLocalization()
  const colors = useThemeColors()
  const [searchText, setSearchText] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [priorityFilter, setPriorityFilter] = useState<string>('')
  const [viewMode, setViewMode] = useState<ViewMode>('compact')
  const [showStatsLocal, setShowStatsLocal] = useState(showStats)

  // Update local stats visibility when prop changes
  useEffect(() => {
    setShowStatsLocal(showStats)
  }, [showStats])

  // Keyboard shortcuts for task filtering
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle Alt key combinations
      if (!event.altKey || event.ctrlKey || event.shiftKey || event.metaKey) return

      // Prevent default browser behavior for Alt+number
      if ((event.key >= '0' && event.key <= '5')) {
        event.preventDefault()
      }

      switch (event.key) {
        case '0':
          // Alt+0: 全部状态/默认
          setStatusFilter('')
          setPriorityFilter('')
          setSearchText('')
          break
        case '1':
          // Alt+1: 今日任务
          setStatusFilter('TODAY')
          setPriorityFilter('')
          setSearchText('')
          break
        case '2':
          // Alt+2: 本周任务
          setStatusFilter('THIS_WEEK')
          setPriorityFilter('')
          setSearchText('')
          break
        case '3':
          // Alt+3: 进行中
          setStatusFilter('IN_PROGRESS')
          setPriorityFilter('')
          setSearchText('')
          break
        case '4':
          // Alt+4: 未完成
          setStatusFilter('PENDING,IN_PROGRESS')
          setPriorityFilter('')
          setSearchText('')
          break
        case '5':
          // Alt+5: 已完成
          setStatusFilter('COMPLETED')
          setPriorityFilter('')
          setSearchText('')
          break
        default:
          return // Don't prevent default for other keys
      }
    }

    // Add event listener
    document.addEventListener('keydown', handleKeyDown)

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, []) // Empty dependency array since we don't need to re-create the handler

  // Debounced filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      const filters: TaskQueryParams = {
        search: searchText || undefined,
        priority: (priorityFilter as Priority) || undefined
      }

      if (statusFilter === 'THIS_WEEK') {
        filters.timeRange = 'this_week'
        filters.status = undefined
      } else if (statusFilter === 'TODAY') {
        filters.status = 'PENDING,IN_PROGRESS'
        filters.todayDate = 'auto'
      } else {
        filters.status = statusFilter || undefined
      }

      onFilterChange(filters)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchText, statusFilter, priorityFilter, onFilterChange])

  const handleStatsFilterChange = useCallback((status: 'ALL' | 'COMPLETED' | 'PENDING' | 'IN_PROGRESS' | 'CANCELLED' | 'TODAY') => {
    if (status === 'TODAY') {
      setStatusFilter('TODAY')
    } else if (status === 'ALL') {
      setStatusFilter('THIS_WEEK')
    } else {
      setStatusFilter(status)
    }
    setPriorityFilter('')
    setSearchText('')
  }, [])

  const clearFilters = useCallback(() => {
    setSearchText('')
    setStatusFilter('')
    setPriorityFilter('')
    onFilterChange({ status: undefined })
  }, [onFilterChange])

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      onLoadMore()
    }
  }, [loading, hasMore, onLoadMore])

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'PENDING': return t('tasks.status.PENDING')
      case 'IN_PROGRESS': return t('tasks.status.IN_PROGRESS')
      case 'COMPLETED': return t('tasks.status.COMPLETED')
      case 'CANCELLED': return t('tasks.status.CANCELLED')
      case 'THIS_WEEK': return t('tasks.filter.this_week')
      case 'TODAY': return t('tasks.filter.today')
      default: return status
    }
  }

  const getPriorityLabel = (priority: string): string => {
    switch (priority) {
      case 'LOW': return t('tasks.priority.LOW')
      case 'MEDIUM': return t('tasks.priority.MEDIUM')
      case 'HIGH': return t('tasks.priority.HIGH')
      case 'URGENT': return t('tasks.priority.URGENT')
      default: return priority
    }
  }

  const activeFilters = []
  if (statusFilter) activeFilters.push(getStatusLabel(statusFilter))
  if (priorityFilter) activeFilters.push(getPriorityLabel(priorityFilter))

  // Group tasks by completion status for better organization
  const groupedTasks = tasks.reduce((acc, task, index) => {
    const isCompleted = task.status === 'COMPLETED'
    const prevTask = index > 0 ? tasks[index - 1] : null
    const showCompletedDivider = prevTask && prevTask.status !== 'COMPLETED' && isCompleted

    if (showCompletedDivider) {
      acc.push({ type: 'divider', label: t('tasks.filter.completed_tasks_divider') })
    }

    // Check for date range dividers for completed tasks
    if (isCompleted && task.timeCategory?.completedTimeRange) {
      const currentRange = task.timeCategory.completedTimeRange
      const prevRange = prevTask?.timeCategory?.completedTimeRange

      if (prevRange !== currentRange) {
        const rangeLabels = {
          'today': t('tasks.section_labels.today_completed'),
          'yesterday': t('tasks.section_labels.yesterday_completed'),
          'thisWeek': t('tasks.section_labels.this_week_completed'),
          'older': t('tasks.section_labels.older_completed')
        }
        const label = rangeLabels[currentRange as keyof typeof rangeLabels] || currentRange
        acc.push({ type: 'divider', label })
      }
    }

    acc.push({ type: 'task', task, index })
    return acc
  }, [] as Array<{ type: 'task' | 'divider'; task?: Task; label?: string; index?: number }>)

  return (
    <div
      className="h-full flex flex-col"
      style={{ backgroundColor: colors.background }}
    >
      {/* Fixed Header */}
      <div
        className={`bg-transparent border-b px-4 pt-3 ${showStatsLocal ? 'pb-3' : 'pb-1'}`}
        style={{ borderColor: colors.card.border }}
      >
        {/* Control Bar - more compact like mobile */}
        <div
          className="rounded-xl p-3 mb-3 flex items-center gap-3 border shadow-sm transition-colors"
          style={{
            backgroundColor: colors.card.background,
            borderColor: colors.card.border
          }}
        >
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
              style={{ color: colors.tabIconDefault }}
            />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={t('tasks.search_placeholder')}
              className="w-full pl-10 pr-4 py-2.5 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-dopamind-500 text-sm shadow-sm transition-all duration-200"
              style={{
                backgroundColor: colors.card.background,
                color: colors.text,
                borderColor: colors.card.border,
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)'
              }}
            />
            {searchText && (
              <button
                onClick={() => setSearchText('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="w-4 h-4" style={{ color: colors.tabIconDefault }} />
              </button>
            )}
          </div>

          {/* Control Buttons - more compact */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                w-10 h-10 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm
                ${showFilters
                  ? 'bg-dopamind-500 text-white shadow-lg shadow-dopamind-500/25'
                  : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:shadow-md'
                }
              `}
            >
              <Filter className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowStatsLocal(!showStatsLocal)}
              className={`
                w-10 h-10 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm
                ${showStatsLocal
                  ? 'bg-dopamind-500 text-white shadow-lg shadow-dopamind-500/25'
                  : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:shadow-md'
                }
              `}
            >
              <BarChart3 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setViewMode(viewMode === 'detailed' ? 'compact' : 'detailed')}
              className="w-10 h-10 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
            >
              {viewMode === 'detailed' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4 border border-gray-200 dark:border-gray-600 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('tasks.filter.status_filter')}</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: '', label: t('tasks.filter.all_status'), shortcut: 'Alt+0' },
                    { value: 'PENDING,IN_PROGRESS', label: t('tasks.filter.unfinished_tasks'), shortcut: 'Alt+4' },
                    { value: 'PENDING', label: t('tasks.status.PENDING') },
                    { value: 'IN_PROGRESS', label: t('tasks.status.IN_PROGRESS'), shortcut: 'Alt+3' },
                    { value: 'COMPLETED', label: t('tasks.status.COMPLETED'), shortcut: 'Alt+5' },
                    { value: 'CANCELLED', label: t('tasks.status.CANCELLED') },
                    { value: 'THIS_WEEK', label: t('tasks.filter.this_week'), shortcut: 'Alt+2' },
                    { value: 'TODAY', label: t('tasks.filter.today'), shortcut: 'Alt+1' }
                  ].map((status) => (
                    <button
                      key={status.value}
                      onClick={() => setStatusFilter(status.value)}
                      className={`
                        px-3 py-1 rounded-full text-sm border transition-colors flex items-center gap-1
                        ${statusFilter === status.value
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }
                      `}
                      title={status.shortcut ? `${t('common.shortcut')}: ${status.shortcut}` : undefined}
                    >
                      {status.label}
                      {status.shortcut && (
                        <kbd className={`
                          ml-1 px-1 py-0.5 text-xs rounded border
                          ${statusFilter === status.value
                            ? 'bg-blue-400 border-blue-300 text-blue-100'
                            : 'bg-gray-100 border-gray-200 text-gray-500'
                          }
                        `}>
                          {status.shortcut}
                        </kbd>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('tasks.filter.priority_filter')}</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: '', label: t('tasks.filter.all_priority') },
                    { value: 'LOW', label: t('tasks.priority.low') },
                    { value: 'MEDIUM', label: t('tasks.priority.medium') },
                    { value: 'HIGH', label: t('tasks.priority.high') },
                    { value: 'URGENT', label: t('tasks.priority.urgent') }
                  ].map((priority) => (
                    <button
                      key={priority.value}
                      onClick={() => setPriorityFilter(priority.value)}
                      className={`
                        px-3 py-1 rounded-full text-sm border transition-colors
                        ${priorityFilter === priority.value
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }
                      `}
                    >
                      {priority.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Keyboard shortcuts hint */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <span>{t('common.shortcut')}:</span>
                <div className="flex gap-1">
                  {[
                    { key: 'Alt+0', label: '全部' },
                    { key: 'Alt+1', label: '今日' },
                    { key: 'Alt+2', label: '本周' },
                    { key: 'Alt+3', label: t('tasks.filter.in_progress') },
                    { key: 'Alt+4', label: '未完成' },
                    { key: 'Alt+5', label: '已完成' }
                  ].map((item) => (
                    <span key={item.key} className="inline-flex items-center gap-1">
                      <kbd className="px-1 py-0.5 text-xs bg-white border border-gray-200 rounded">
                        {item.key}
                      </kbd>
                      <span>{item.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-600">当前筛选:</span>
            {activeFilters.map((filter, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700"
              >
                {filter}
                <button
                  onClick={() => {
                    if (statusFilter && filter === getStatusLabel(statusFilter)) setStatusFilter('')
                    if (priorityFilter && filter === getPriorityLabel(priorityFilter)) setPriorityFilter('')
                  }}
                  className="ml-2"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              onClick={clearFilters}
              className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 hover:bg-red-200"
            >
              {t('tasks.filter.clear_all')}
            </button>
          </div>
        )}

        {/* Task Stats */}
        {showStatsLocal && taskStats && (
          <TaskStats {...taskStats} onFilterChange={handleStatsFilterChange} />
        )}
      </div>

      {/* Task List */}
      <div className="flex-1">
        <div className="p-4">
          {error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4 text-4xl">❌</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{error}</h3>
              <button
                onClick={onRefresh}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {t('common.retry')}
              </button>
            </div>
          ) : tasks.length === 0 && !loading ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchText || statusFilter || priorityFilter ? t('tasks.filter.no_results') : t('tasks.empty_state')}
              </h3>
              <p className="text-gray-500 text-sm">
                {searchText || statusFilter || priorityFilter
                  ? t('tasks.filter.no_results_subtitle')
                  : t('tasks.add_task')
                }
              </p>
            </div>
          ) : (
            <>
              {groupedTasks.map((item, index) => {
                if (item.type === 'divider') {
                  return (
                    <div key={`divider-${index}`} className="flex items-center my-4">
                      <div className="flex-1 h-px bg-gray-200"></div>
                      <span className="px-3 text-xs font-medium text-gray-500 bg-white rounded-full border border-gray-200">
                        {item.label}
                      </span>
                      <div className="flex-1 h-px bg-gray-200"></div>
                    </div>
                  )
                }

                return (
                  <TaskItem
                    key={`task-${item.task!.id}-${item.index}`}
                    task={item.task!}
                    onToggleStatus={onToggleStatus}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    showActionButtons={viewMode === 'detailed'}
                    compact={viewMode === 'compact'}
                  />
                )
              })}

              {/* Load More */}
              {hasMore && (
                <div className="text-center py-4">
                  {loadingMore ? (
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span className="text-gray-500 text-sm">{t('tasks.filter.load_more')}...</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleLoadMore}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      <span>{t('tasks.filter.load_more')} ({t('tasks.stats.total')} {tasks.length})</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              {/* End indicator */}
              {!hasMore && tasks.length > 0 && (
                <div className="flex items-center my-4">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="px-3 text-xs text-gray-500">
                    {t('tasks.filter.end_of_list')}
                  </span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
