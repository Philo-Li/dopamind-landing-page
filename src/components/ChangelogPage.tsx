'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLocalization } from '@/hooks/useLocalization'
import { getChangelogContent } from '@/constants/changelogContent'
import ReactMarkdown from 'react-markdown'
import { useThemeColors } from '@/hooks/useThemeColor'

interface VersionSection {
  version: string
  date: string
  title: string
  content: string
}

export default function ChangelogPage() {
  const router = useRouter()
  const colors = useThemeColors()
  const { t, language } = useLocalization()
  const [versions, setVersions] = useState<VersionSection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadAndParseMarkdownContent = useCallback(async () => {
    setLoading(true)
    setError(false)

    try {
      const content = getChangelogContent(language)
      const parsedVersions = parseVersionsFromMarkdown(content)
      setVersions(parsedVersions)
    } catch (err) {
      console.error('Failed to load changelog:', err)
      setError(true)
      setVersions([])
    } finally {
      setLoading(false)
    }
  }, [language])

  useEffect(() => {
    loadAndParseMarkdownContent()
  }, [loadAndParseMarkdownContent])

  const parseVersionsFromMarkdown = (content: string): VersionSection[] => {
    const lines = content.split('\n')
    const versions: VersionSection[] = []
    let currentVersion: Partial<VersionSection> = {}
    let contentLines: string[] = []
    let insideVersion = false

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // 跳过文档标题
      if (line.startsWith('# ')) {
        continue
      }

      // 如果遇到版本号标题 (## v1.7.0 (2025-09-09))
      if (line.startsWith('## v')) {
        // 保存之前的版本（如果存在）
        if (currentVersion.version && insideVersion) {
          versions.push({
            version: currentVersion.version,
            date: currentVersion.date || '',
            title: currentVersion.title || '',
            content: contentLines.join('\n').trim()
          })
        }

        // 解析新版本信息
        const versionMatch = line.match(/## (v[\d.]+) \(([^)]+)\)/)
        if (versionMatch) {
          currentVersion = {
            version: versionMatch[1],
            date: versionMatch[2],
            title: '',
          }
          contentLines = []
          insideVersion = true
        }
      } else if (line.startsWith('### ') && currentVersion.version && !currentVersion.title) {
        // 提取版本标题（只取第一个 ### 标题作为版本标题）
        currentVersion.title = line.replace('### ', '')
      } else if (line.trim() === '---') {
        // 遇到分隔符，结束当前版本
        if (currentVersion.version && insideVersion) {
          versions.push({
            version: currentVersion.version,
            date: currentVersion.date || '',
            title: currentVersion.title || '',
            content: contentLines.join('\n').trim()
          })
        }
        currentVersion = {}
        contentLines = []
        insideVersion = false
      } else if (insideVersion) {
        // 收集版本内容（包括空行）
        contentLines.push(line)
      }
    }

    // 添加最后一个版本（如果存在）
    if (currentVersion.version && insideVersion) {
      versions.push({
        version: currentVersion.version,
        date: currentVersion.date || '',
        title: currentVersion.title || '',
        content: contentLines.join('\n').trim()
      })
    }

    return versions
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: colors.background }}>
      {/* Header with title */}
      <div
        className="flex items-center justify-between px-6 border-b h-[64px]"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.border
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:opacity-80 transition-opacity"
            style={{ backgroundColor: colors.card.background }}
          >
            <ArrowLeft className="w-4 h-4" style={{ color: colors.text }} />
          </button>
          <h1 className="text-xl font-semibold" style={{ color: colors.text }}>
            {t('changelog.title')}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div
                className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mb-3"
                style={{
                  borderColor: colors.border,
                  borderTopColor: 'transparent'
                }}
              ></div>
              <p style={{ color: colors.textSecondary }}>Loading...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p style={{ color: colors.status.error }} className="text-center">
                Failed to load changelog. Please try again later.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {versions.map((version, index) => (
                <div
                  key={version.version}
                  className="rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow"
                  style={{
                    backgroundColor: colors.card.background,
                    borderColor: colors.card.border
                  }}
                >
                  {/* Version Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold" style={{ color: colors.tint }}>
                      {version.version}
                    </h2>
                    <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                      {version.date}
                    </span>
                  </div>

                  {/* Version Title */}
                  {version.title && (
                    <h3 className="text-base font-semibold mb-4" style={{ color: colors.text }}>
                      {version.title}
                    </h3>
                  )}

                  {/* Version Content */}
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <p className="mb-3 leading-relaxed" style={{ color: colors.textSecondary }}>
                            {children}
                          </p>
                        ),
                        ul: ({ children }) => (
                          <ul className="space-y-2 mb-4">{children}</ul>
                        ),
                        li: ({ children }) => (
                          <li className="ml-2" style={{ color: colors.textSecondary }}>
                            <span style={{ color: colors.tint }} className="mr-2">•</span>
                            {children}
                          </li>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold" style={{ color: colors.text }}>
                            {children}
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic" style={{ color: colors.textSecondary }}>
                            {children}
                          </em>
                        ),
                        h1: ({ children }) => (
                          <h1 className="text-lg font-bold mb-3" style={{ color: colors.text }}>
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-base font-semibold mb-2 mt-4" style={{ color: colors.text }}>
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-sm font-medium mb-2 mt-3" style={{ color: colors.tint }}>
                            {children}
                          </h3>
                        ),
                        code: ({ children }) => (
                          <code
                            className="px-1.5 py-0.5 rounded text-sm font-mono"
                            style={{
                              backgroundColor: colors.card.background,
                              color: colors.accent.purple
                            }}
                          >
                            {children}
                          </code>
                        ),
                      }}
                    >
                      {version.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}