export interface DailyReport {
  id: number
  userId: string
  date: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface DailyReportResponse {
  success: boolean
  report?: DailyReport
  message?: string
  error?: string | { code?: string; message?: string }
}

export interface CheckReportExistsResponse {
  success: boolean
  exists: boolean
  reportInfo?: {
    id: number
    createdAt: string
  }
  error?: string | { code?: string; message?: string }
}
