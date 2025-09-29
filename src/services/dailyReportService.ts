import { apiClient } from '@/lib/api'
import {
  DailyReportResponse,
  CheckReportExistsResponse
} from '@/types/dailyReport'

export const dailyReportService = {
  async generateReport(date: string, force = false) {
    const query = force ? '?force=true' : ''
    return apiClient.post<DailyReportResponse>(`/daily-reports/${date}/generate${query}`)
  },

  async getReport(date: string) {
    return apiClient.get<DailyReportResponse>(`/daily-reports/${date}`)
  },

  async checkReportExists(date: string) {
    return apiClient.get<CheckReportExistsResponse>(`/daily-reports/${date}/exists`)
  }
}
