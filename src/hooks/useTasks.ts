'use client'

import { useState, useCallback } from 'react'
import { Task, TaskQueryParams, TaskStats, CreateTaskRequest, UpdateTaskRequest, TaskListResponse } from '@/types/task'
import { apiClient } from '@/lib/api'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [taskStats, setTaskStats] = useState<TaskStats | null>({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    cancelled: 0,
    completionRate: 0,
    thisWeekCompleted: 0,
    thisWeekTotal: 0,
    todayTasksCount: 0
  })
  const [currentFilters, setCurrentFilters] = useState<TaskQueryParams>({})

  const loadTasks = useCallback(async (page = 1, filters: TaskQueryParams = {}, showLoading = true) => {
    if (showLoading) setLoading(true)

    try {
      const params = {
        page,
        limit: filters.limit || 20,
        status: filters.status,
        priority: filters.priority,
        search: filters.search,
        dueDate: filters.dueDate,
        parentId: filters.parentId?.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        timeRange: filters.timeRange,
        todayDate: filters.todayDate
      }

      // Remove undefined values
      Object.keys(params).forEach(key => {
        if (params[key as keyof typeof params] === undefined) {
          delete params[key as keyof typeof params]
        }
      })

      const response = await apiClient.get<TaskListResponse>('/tasks', { params })

      if (response.success && response.data) {
        if (page === 1) {
          setTasks(response.data.tasks)
        } else {
          setTasks(prevTasks => [...prevTasks, ...response.data!.tasks])
        }

        setCurrentFilters(filters)
        setHasMore(response.data.pagination.page < response.data.pagination.totalPages)
      } else {
        console.error('Failed to load tasks:', response.error?.message)
        setTasks([])
      }
    } catch (error) {
      console.error('Error loading tasks:', error)
      setTasks([])
    } finally {
      if (showLoading) setLoading(false)
    }
  }, [])

  const loadTaskStats = useCallback(async (_showLoading = true) => {
    try {
      const response = await apiClient.get<{
        stats: {
          total: number
          pending: number
          inProgress: number
          completed: number
          cancelled: number
          thisWeekCompleted: number
          thisWeekTotal: number
          todayTasksCount: number
        }
        recentTasks: Task[]
      }>('/tasks/stats/summary')

      if (response.success && response.data) {
        const { stats } = response.data
        const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

        setTaskStats({
          total: stats.total,
          completed: stats.completed,
          pending: stats.pending,
          inProgress: stats.inProgress,
          cancelled: stats.cancelled,
          completionRate,
          thisWeekCompleted: stats.thisWeekCompleted,
          thisWeekTotal: stats.thisWeekTotal,
          todayTasksCount: stats.todayTasksCount
        })
      } else {
        console.error('Failed to load task stats:', response.error?.message)
        setTaskStats({
          total: 0,
          completed: 0,
          pending: 0,
          inProgress: 0,
          cancelled: 0,
          completionRate: 0,
          thisWeekCompleted: 0,
          thisWeekTotal: 0,
          todayTasksCount: 0
        })
      }
    } catch (error) {
      console.error('Error loading task stats:', error)
      setTaskStats({
        total: 0,
        completed: 0,
        pending: 0,
        inProgress: 0,
        cancelled: 0,
        completionRate: 0,
        thisWeekCompleted: 0,
        thisWeekTotal: 0,
        todayTasksCount: 0
      })
    }
  }, [])

  const refreshTasksWithStats = useCallback(async () => {
    setRefreshing(true)
    try {
      await Promise.all([
        loadTasks(1, currentFilters, false),
        loadTaskStats(false)
      ])
    } finally {
      setRefreshing(false)
    }
  }, [loadTasks, currentFilters, loadTaskStats])

  const loadMoreTasks = useCallback(async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    try {
      const currentPage = Math.ceil(tasks.length / 20) // Assuming 20 per page
      await loadTasks(currentPage + 1, currentFilters, false)
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, hasMore, tasks.length, loadTasks, currentFilters])

  const updateFilters = useCallback(async (filters: TaskQueryParams) => {
    await loadTasks(1, filters)
  }, [loadTasks])

  const toggleTaskStatus = useCallback(async (taskId: number, status: Task['status']) => {
    try {
      // Optimistic update
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId
            ? {
                ...task,
                status,
                completedAt: status === 'COMPLETED' ? new Date().toISOString() : undefined,
                completedAtLocal: status === 'COMPLETED' ? new Date().toISOString().split('T')[0] : undefined,
                updatedAt: new Date().toISOString(),
                updatedAtLocal: new Date().toISOString().split('T')[0],
                _isOptimistic: true
              }
            : task
        )
      )

      const response = await apiClient.put(`/tasks/${taskId}`, { status })

      if (response.success && response.data) {
        // Replace optimistic update with real data
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? (response.data as Task) : task
          )
        )

        // Reload stats
        await loadTaskStats(false)
      } else {
        console.error('Failed to toggle task status:', response.error?.message)
        // Revert optimistic update on error
        await loadTasks(1, currentFilters, false)
        throw new Error(response.error?.message || 'Failed to update task')
      }
    } catch (error) {
      console.error('Error toggling task status:', error)
      // Revert optimistic update on error
      await loadTasks(1, currentFilters, false)
      throw error
    }
  }, [currentFilters, loadTasks, loadTaskStats])

  const removeTask = useCallback(async (taskId: number) => {
    try {
      // Optimistic update
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))

      const response = await apiClient.delete(`/tasks/${taskId}`)

      if (response.success) {
        // Reload stats
        await loadTaskStats(false)
      } else {
        console.error('Failed to delete task:', response.error?.message)
        // Revert optimistic update on error
        await loadTasks(1, currentFilters, false)
        throw new Error(response.error?.message || 'Failed to delete task')
      }
    } catch (error) {
      console.error('Error removing task:', error)
      // Revert optimistic update on error
      await loadTasks(1, currentFilters, false)
      throw error
    }
  }, [currentFilters, loadTasks, loadTaskStats])

  const createTask = useCallback(async (taskData: CreateTaskRequest): Promise<Task> => {
    try {
      const response = await apiClient.post<Task>('/tasks', taskData)

      if (response.success && response.data) {
        // Add new task to the beginning of the list
        setTasks(prevTasks => [response.data!, ...prevTasks])

        // Reload stats
        await loadTaskStats(false)

        return response.data
      } else {
        console.error('Failed to create task:', response.error?.message)
        throw new Error(response.error?.message || 'Failed to create task')
      }
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }, [loadTaskStats])

  const updateTask = useCallback(async (taskId: number, taskData: UpdateTaskRequest): Promise<Task> => {
    try {
      // Optimistic update
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId
            ? {
                ...task,
                ...taskData,
                updatedAt: new Date().toISOString(),
                updatedAtLocal: new Date().toISOString().split('T')[0],
                _isOptimistic: true
              }
            : task
        )
      )

      const response = await apiClient.put<Task>(`/tasks/${taskId}`, taskData)

      if (response.success && response.data) {
        // Replace optimistic update with real data
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? (response.data as Task) : task
          )
        )

        return response.data
      } else {
        console.error('Failed to update task:', response.error?.message)
        // Revert optimistic update on error
        await loadTasks(1, currentFilters, false)
        throw new Error(response.error?.message || 'Failed to update task')
      }
    } catch (error) {
      console.error('Error updating task:', error)
      // Revert optimistic update on error
      await loadTasks(1, currentFilters, false)
      throw error
    }
  }, [currentFilters, loadTasks])

  return {
    tasks,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    taskStats,
    loadTasks,
    refreshTasksWithStats,
    loadMoreTasks,
    updateFilters,
    toggleTaskStatus,
    removeTask,
    loadTaskStats,
    createTask,
    updateTask
  }
}
