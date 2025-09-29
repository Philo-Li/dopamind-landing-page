'use client'

import { useRouter } from 'next/navigation'
import { useThemeColors } from '@/hooks/useThemeColor'
import { useLocalization } from '@/hooks/useLocalization'
import { MessageCircle, Sparkles, ArrowRight } from 'lucide-react'

interface ChatPreviewCardProps {
  reportDate?: string
  reportSummary?: string
  onNavigate?: () => void
}

export default function ChatPreviewCard({ reportDate, reportSummary, onNavigate }: ChatPreviewCardProps) {
  const router = useRouter()
  const colors = useThemeColors()
  const { t } = useLocalization()

  // 处理点击导航到聊天页面
  const handleChatClick = () => {
    if (onNavigate) {
      onNavigate()
    } else {
      router.push('/chat')
    }
  }

  // 获取格式化日期
  const getFormattedDate = () => {
    if (!reportDate) return t('daily_report.today')

    try {
      const date = new Date(reportDate)
      return date.toLocaleDateString('zh-CN', {
        month: 'long',
        day: 'numeric',
        weekday: 'short'
      })
    } catch {
      return t('daily_report.today')
    }
  }

  // 提取dopamind寄语栏目的内容
  const extractDopamindMessage = (content: string) => {
    // 寻找 "dopamind 寄语" 或类似的标题
    const dopamindSectionRegex = /(?:^|\n)#{1,6}\s*(?:dopamind\s*寄语|Dopamind\s*寄语|DOPAMIND\s*寄语|dopamind.*message|Dopamind.*Message).*?\n(.*?)(?=\n#{1,6}|\n\n|$)/si
    const match = content.match(dopamindSectionRegex)

    if (match && match[1]) {
      // 清理提取的内容
      let extractedContent = match[1]
        .replace(/^#{1,6}\s+/gm, '') // 移除标题标记
        .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体标记
        .replace(/\*(.*?)\*/g, '$1') // 移除斜体标记
        .replace(/`(.*?)`/g, '$1') // 移除代码标记
        .replace(/^\s*[-*+]\s+/gm, '') // 移除列表标记
        .replace(/^\s*\d+\.\s+/gm, '') // 移除有序列表标记
        .replace(/\s+/g, ' ') // 合并多余空白
        .trim()

      return extractedContent
    }

    // 如果没有找到dopamind寄语，尝试通用的第一个小节
    const lines = content.split('\n')
    let foundFirstHeader = false
    let foundSecondHeader = false
    let extractedLines = []

    for (const line of lines) {
      const trimmedLine = line.trim()

      // 跳过空行
      if (!trimmedLine) continue

      // 检测大标题 (# 一个井号)
      if (/^#\s+/.test(trimmedLine) && !foundFirstHeader) {
        foundFirstHeader = true
        continue
      }

      // 检测小标题 (## 两个井号)
      if (/^#{2,6}\s+/.test(trimmedLine) && foundFirstHeader && !foundSecondHeader) {
        foundSecondHeader = true
        continue
      }

      // 如果找到了第一个大标题和第一个小标题，开始收集内容
      if (foundFirstHeader && foundSecondHeader) {
        // 如果遇到新的标题，停止收集
        if (/^#{1,6}\s+/.test(trimmedLine)) {
          break
        }

        // 收集非标题内容
        const cleanLine = trimmedLine
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .replace(/\*(.*?)\*/g, '$1')
          .replace(/`(.*?)`/g, '$1')
          .replace(/^\s*[-*+]\s+/, '')
          .replace(/^\s*\d+\.\s+/, '')

        if (cleanLine) {
          extractedLines.push(cleanLine)
        }
      }
    }

    if (extractedLines.length > 0) {
      return extractedLines.join(' ').replace(/\s+/g, ' ').trim()
    }

    // 最后的备选方案：返回前120个字符
    const cleanContent = content
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/^\s*[-*+]\s+/gm, '')
      .replace(/^\s*\d+\.\s+/gm, '')
      .replace(/\s+/g, ' ')
      .trim()

    return cleanContent.substring(0, 120)
  }

  // 获取简要内容预览
  const getPreviewText = () => {
    if (reportSummary && reportSummary.length > 0) {
      // 尝试提取dopamind寄语栏目的内容
      const dopamindMessage = extractDopamindMessage(reportSummary)

      // 如果提取到了有效内容，返回处理后的内容
      if (dopamindMessage && dopamindMessage.trim().length > 0) {
        return dopamindMessage.length > 120 ? dopamindMessage.substring(0, 120) + '...' : dopamindMessage
      }
    }
    return t('chat.preview.daily_report.default_description')
  }

  return (
    <div
      className="flex mt-4 mb-6 p-4 rounded-2xl border-[1.2px] shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-[1.02] items-stretch bg-gradient-to-br"
      style={{
        background: `linear-gradient(135deg, ${colors.card.background}f0, ${colors.accent.blue}08)`,
        borderColor: colors.accent.blue,
        boxShadow: `0 4px 12px ${colors.accent.blue}15`
      }}
      onClick={handleChatClick}
    >
      {/* 左侧状态色条 */}
      <div
        className="w-[5px] rounded-sm mr-4 my-0.5"
        style={{ backgroundColor: colors.accent.blue }}
      />

      {/* 内容区域 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部标题行 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* AI 聊天图标 */}
            <div
              className="w-[36px] h-[36px] rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: colors.accent.blue + '18',
                border: `1px solid ${colors.accent.blue}30`
              }}
            >
              <Sparkles
                className="w-[20px] h-[20px]"
                style={{ color: colors.accent.blue }}
              />
            </div>

            {/* 标题和副标题 */}
            <div className="flex-1">
              <h4
                className="font-bold"
                style={{
                  fontSize: '17px',
                  lineHeight: '24px',
                  color: colors.text
                }}
              >
{t('chat.preview.daily_report.title')}
              </h4>
              <p
                style={{
                  fontSize: '13px',
                  marginTop: '1px',
                  color: colors.textSecondary,
                  opacity: 0.8
                }}
              >
{getFormattedDate()}
              </p>
            </div>
          </div>

          {/* 右侧箭头 */}
          <ArrowRight
            className="w-[20px] h-[20px] ml-3"
            style={{ color: colors.accent.blue }}
          />
        </div>

        {/* 预览内容 */}
        <div
          className="mb-4 px-3 py-2.5 rounded-lg"
          style={{
            backgroundColor: colors.card.background + 'f8',
            border: `1px solid ${colors.border}40`
          }}
        >
          <p
            style={{
              fontSize: '14px',
              lineHeight: '20px',
              color: colors.textSecondary,
              opacity: 0.9
            }}
          >
            {getPreviewText()}
          </p>
        </div>

        {/* 底部操作区 */}
        <div className="flex items-center justify-between">
          {/* 左侧标签 */}
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              fontSize: '12px',
              fontWeight: '600',
              backgroundColor: colors.accent.blue + '15',
              color: colors.accent.blue
            }}
          >
            <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {t('chat.preview.daily_report.report_generated')}
          </span>

          {/* 右侧提示 */}
          <span
            style={{
              fontSize: '11px',
              color: colors.textSecondary,
              opacity: 0.6,
              fontWeight: '500'
            }}
          >
            {t('chat.preview.daily_report.click_hint')}
          </span>
        </div>
      </div>
    </div>
  )
}