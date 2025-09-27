'use client'

import { Task } from '@/types/task'

interface TaskStore {
  tasks: Map<number, Task>
  currentFocusTaskId: number | null
  setTask: (task: Task) => void
  getTask: (id: number) => Task | undefined
  setCurrentFocusTaskId: (taskId: number | null) => void
  getCurrentFocusTask: () => Task | undefined
  clearCurrentFocusTask: () => void
  removeTask: (id: number) => void
  clear: () => void
}

class TaskStoreClass implements TaskStore {
  tasks = new Map<number, Task>()
  currentFocusTaskId: number | null = null

  setTask(task: Task) {
    this.tasks.set(task.id, task)
  }

  getTask(id: number): Task | undefined {
    return this.tasks.get(id)
  }

  setCurrentFocusTaskId(taskId: number | null) {
    this.currentFocusTaskId = taskId
  }

  getCurrentFocusTask(): Task | undefined {
    if (this.currentFocusTaskId == null) {
      return undefined
    }
    return this.tasks.get(this.currentFocusTaskId)
  }

  clearCurrentFocusTask() {
    this.currentFocusTaskId = null
  }

  removeTask(id: number) {
    this.tasks.delete(id)
  }

  clear() {
    this.tasks.clear()
    this.currentFocusTaskId = null
  }
}

// 全局单例任务缓存
export const taskStore = new TaskStoreClass()
