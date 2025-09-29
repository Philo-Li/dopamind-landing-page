'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import { ArrowLeft, Clipboard, Loader2, MoreVertical, RotateCcw } from 'lucide-react'

import { useThemeColors } from '@/hooks/useThemeColor'
import { useLocalization } from '@/hooks/useLocalization'
import { dailyReportService } from '@/services/dailyReportService'
import type { DailyReport } from '@/types/dailyReport'
import { useToast } from '@/contexts/ToastContext'

export const DailyReportPage: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const colors = useThemeColors()
  const { t, language } = useLocalization()
  const { showSuccess, showError } = useToast()

  const dateParam = searchParams.get('date') || ''
  const isChinese = language.startsWith('zh')

  const [report, setReport] = useState<DailyReport | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [regenerating, setRegenerating] = useState<boolean>(false)

  const menuRef = useRef<HTMLDivElement | null>(null)

  const formattedDate = useMemo(() => {
    if (!dateParam) {
      return t('calendar.today')
    }

    try {
      return format(parseISO(dateParam), isChinese ? 'yyyy年M月d日' : 'MMM d, yyyy')
    } catch (error) {
      console.warn('[DailyReportPage] Failed to parse date:', error)
      return dateParam
    }
  }, [dateParam, isChinese, t])

  const formattedShortDate = useMemo(() => {
    if (!dateParam) {
      return t('calendar.today')
    }

    try {
      return format(parseISO(dateParam), isChinese ? 'M月d日' : 'MMM d')
    } catch (error) {
      return dateParam
    }
  }, [dateParam, isChinese, t])

  const formattedUpdatedAt = useMemo(() => {
    if (!report?.updatedAt) return ''

    try {
      const parsed = parseISO(report.updatedAt)
      const dateString = format(parsed, isChinese ? 'yyyy年M月d日 HH:mm' : 'MMM d, yyyy HH:mm')
      return t('calendar.report_updated_at', { time: dateString })
    } catch (error) {
      return ''
    }
  }, [report?.updatedAt, isChinese, t])

  const loadReport = useCallback(async () => {
    if (!dateParam) {
      setError(t('calendar.cannot_open_report'))
      setReport(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await dailyReportService.getReport(dateParam)

      if (response.success && response.report) {
        setReport(response.report)
      } else {
        const message = typeof response.error === 'string'
          ? response.error
          : response.error?.message || t('calendar.cannot_open_report')
        setError(message)
        setReport(null)
      }
    } catch (err: any) {
      console.error('[DailyReportPage] Failed to load report:', err)
      const message = err?.response?.data?.error || err?.message || t('calendar.network_error')
      setError(message)
      setReport(null)
    } finally {
      setLoading(false)
    }
  }, [dateParam, t])

  useEffect(() => {
    loadReport()
  }, [loadReport])

  useEffect(() => {
    if (!menuOpen) return

    const listener = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [menuOpen])

  const handleRegenerate = async () => {
    if (!dateParam) return

    setMenuOpen(false)
    setRegenerating(true)

    try {
      const response = await dailyReportService.generateReport(dateParam, true)

      if (response.success && response.report) {
        setReport(response.report)
        setError(null)
        showSuccess(
          t('calendar.report_generated'),
          t('calendar.report_description', { date: formattedShortDate })
        )
      } else {
        let message = t('calendar.generate_failed')
        if (typeof response.error === 'string') {
          message = response.error
        } else if (response.error?.message) {
          message = response.error.message
        }
        showError(t('calendar.generate_failed'), message)
      }
    } catch (error: any) {
      console.error('[DailyReportPage] Failed to regenerate report:', error)
      const message = error?.response?.data?.error || error?.message || t('calendar.network_error')
      showError(t('calendar.generate_failed'), message)
    } finally {
      setRegenerating(false)
    }
  }

  const handleCopyMarkdown = async () => {
    if (!report?.content) return

    setMenuOpen(false)

    try {
      if (typeof navigator === 'undefined' || !navigator.clipboard) {
        throw new Error('Clipboard API not available')
      }

      await navigator.clipboard.writeText(report.content)
      showSuccess(t('calendar.copy_markdown_success_title'), t('calendar.copy_markdown_success_desc'))
    } catch (error) {
      console.error('[DailyReportPage] Failed to copy report content:', error)
      showError(t('calendar.copy_markdown_failed_title'), t('calendar.copy_markdown_failed_desc'))
    }
  }

  const markdownComponents = useMemo(() => ({
    h1: ({ children }: { children: React.ReactNode }) => (
      <h1 className="text-3xl font-bold mt-6 mb-4" style={{ color: colors.text }}>{children}</h1>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="text-2xl font-semibold mt-8 mb-3" style={{ color: colors.text }}>{children}</h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="text-xl font-semibold mt-6 mb-2" style={{ color: colors.text }}>{children}</h3>
    ),
    p: ({ children }: { children: React.ReactNode }) => (
      <p className="leading-7 text-base mb-4 whitespace-pre-wrap" style={{ color: colors.text }}>{children}</p>
    ),
    li: ({ children }: { children: React.ReactNode }) => (
      <li className="ml-6 leading-7 mb-2" style={{ color: colors.text }}>{children}</li>
    ),
    ul: ({ children }: { children: React.ReactNode }) => (
      <ul className="list-disc ml-4 mb-4" style={{ color: colors.text }}>{children}</ul>
    ),
    ol: ({ children }: { children: React.ReactNode }) => (
      <ol className="list-decimal ml-4 mb-4" style={{ color: colors.text }}>{children}</ol>
    ),
    strong: ({ children }: { children: React.ReactNode }) => (
      <strong style={{ color: colors.text }}>{children}</strong>
    ),
    em: ({ children }: { children: React.ReactNode }) => (
      <em className="italic" style={{ color: colors.text }}>{children}</em>
    ),
    hr: () => (
      <hr className="my-6" style={{ borderColor: colors.card.border }} />
    )
  }), [colors.text, colors.card.border])

  const renderBody = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-10 h-10 animate-spin" style={{ color: colors.primary }} />
          <p className="mt-4 text-base" style={{ color: colors.textSecondary }}>
            {t('calendar.report_loading')}
          </p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h3 className="text-xl font-semibold mb-3" style={{ color: colors.text }}>{t('calendar.view_failed')}</h3>
          <p className="max-w-xl mb-6 text-sm" style={{ color: colors.textSecondary }}>{error}</p>
          <button
            onClick={loadReport}
            className="px-5 py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: colors.primary,
              color: '#FFFFFF'
            }}
          >
            {t('common.retry') || 'Retry'}
          </button>
        </div>
      )
    }

    if (!report) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h3 className="text-xl font-semibold mb-3" style={{ color: colors.text }}>{t('calendar.view_failed')}</h3>
          <p className="max-w-xl mb-6 text-sm" style={{ color: colors.textSecondary }}>
            {t('calendar.cannot_open_report')}
          </p>
        </div>
      )
    }

    return (
      <div
        className="max-w-4xl mx-auto w-full"
        style={{
          backgroundColor: colors.card.background,
          border: `1px solid ${colors.card.border}`,
          boxShadow: '0 20px 45px rgba(15, 23, 42, 0.12)',
          borderRadius: 24,
        }}
      >
        <div className="px-6 py-6 md:px-10 md:py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: colors.text }}>{formattedDate}</h1>
              {formattedUpdatedAt && (
                <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>{formattedUpdatedAt}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRegenerate}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  border: `1px solid ${colors.primary}`,
                  color: colors.primary,
                  backgroundColor: 'transparent'
                }}
                disabled={regenerating}
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t('calendar.regenerate_report', { date: formattedShortDate })}</span>
              </button>
              <button
                onClick={handleCopyMarkdown}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  border: `1px solid ${colors.card.border}`,
                  color: colors.text,
                  backgroundColor: colors.background,
                }}
              >
                <Clipboard className="w-4 h-4" />
                <span>{t('calendar.copy_markdown')}</span>
              </button>
            </div>
          </div>

          <div className="text-base leading-7">
            <ReactMarkdown components={markdownComponents}>
              {report.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: colors.background }}>
      <header
        className="flex items-center justify-between px-6 h-16 border-b relative"
        style={{ borderColor: colors.border, backgroundColor: colors.background }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg transition-colors"
            style={{ color: colors.textSecondary }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: colors.text }}>
              {t('calendar.view_report', { date: formattedShortDate })}
            </h2>
            <p className="text-xs" style={{ color: colors.textSecondary }}>{formattedDate}</p>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: colors.textSecondary }}
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-2xl overflow-hidden shadow-xl z-20"
              style={{
                backgroundColor: colors.card.background,
                border: `1px solid ${colors.card.border}`,
              }}
            >
              <button
                onClick={handleRegenerate}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm"
                style={{ color: colors.text }}
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t('calendar.regenerate_report', { date: formattedShortDate })}</span>
              </button>
              <button
                onClick={handleCopyMarkdown}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm"
                style={{ color: colors.text, borderTop: `1px solid ${colors.card.border}` }}
              >
                <Clipboard className="w-4 h-4" />
                <span>{t('calendar.copy_markdown')}</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-auto px-4 py-6 md:px-6 md:py-8 relative">
        {regenerating && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-30">
            <div
              className="flex flex-col items-center gap-3 px-8 py-10 rounded-3xl"
              style={{
                backgroundColor: colors.card.background,
                border: `1px solid ${colors.card.border}`,
              }}
            >
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: colors.primary }} />
              <p className="text-base font-semibold" style={{ color: colors.text }}>
                {t('calendar.report_regenerating')}
              </p>
              <p className="text-sm text-center" style={{ color: colors.textSecondary }}>
                {t('calendar.report_regenerating_desc', { date: formattedShortDate })}
              </p>
            </div>
          </div>
        )}

        {renderBody()}
      </main>
    </div>
  )
}

export default DailyReportPage
