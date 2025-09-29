import { apiClient } from '@/lib/api'
import {
  DailyReport,
  DailyReportResponse,
  CheckReportExistsResponse
} from '@/types/dailyReport'

export const dailyReportService = {
  async generateReport(date: string, force = false): Promise<DailyReportResponse> {
    const query = force ? '?force=true' : ''
    const response = await apiClient.post(`/daily-reports/${date}/generate${query}`)
    return response as DailyReportResponse
  },

  async getReport(date: string): Promise<DailyReportResponse> {
    const response = await apiClient.get(`/daily-reports/${date}`)
    return response as DailyReportResponse
  },

  async checkReportExists(date: string): Promise<CheckReportExistsResponse> {
    const response = await apiClient.get(`/daily-reports/${date}/exists`)
    return response as CheckReportExistsResponse
  }
}
