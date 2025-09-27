'use client'

import { useState, useEffect, useMemo } from 'react'
import { useThemeColors } from '@/hooks/useThemeColor'
import { useLocalization } from '@/hooks/useLocalization'
import { Search, Check, X } from 'lucide-react'

// 时区数据按地区分组
interface TimezoneGroup {
  region: string
  timezones: { id: string; name: string; description: string }[]
}

interface TimezoneSettingsProps {
  isOpen: boolean
  onClose: () => void
  currentTimezone?: string
  onTimezoneChange: (timezone: string) => void
}

export function TimezoneSettings({
  isOpen,
  onClose,
  currentTimezone = 'Asia/Shanghai',
  onTimezoneChange
}: TimezoneSettingsProps) {
  const colors = useThemeColors()
  const { t } = useLocalization()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTimezone, setSelectedTimezone] = useState(currentTimezone)
  const [isSaving, setIsSaving] = useState(false)

  // 获取时区分组数据
  const timezoneGroups = useMemo((): TimezoneGroup[] => {
    try {
      const timezones = t('timezone.timezones', { returnObjects: true }) as unknown as Record<string, string>
      console.log('Available timezones:', Object.keys(timezones).length, 'timezones')

      const regions = [
        'asia', 'europe', 'north_america', 'south_america',
        'africa', 'oceania', 'other'
      ]

      const groups = regions.map(region => ({
        region,
        timezones: Object.keys(timezones)
          .filter(tz => {
            if (region === 'asia') return tz.startsWith('Asia/')
            if (region === 'europe') return tz.startsWith('Europe/')
            if (region === 'north_america') return (
              tz.startsWith('America/') && (
                tz.includes('New_York') || tz.includes('Chicago') ||
                tz.includes('Denver') || tz.includes('Los_Angeles') ||
                tz.includes('Anchorage') || tz.includes('Toronto') ||
                tz.includes('Winnipeg') || tz.includes('Edmonton') ||
                tz.includes('Vancouver') || tz.includes('Mexico_City')
              )
            ) || tz.startsWith('Pacific/Honolulu')
            if (region === 'south_america') return (
              tz.startsWith('America/') && (
                tz.includes('Sao_Paulo') || tz.includes('Buenos_Aires') ||
                tz.includes('Santiago') || tz.includes('Lima') ||
                tz.includes('Bogota') || tz.includes('Caracas')
              )
            )
            if (region === 'africa') return tz.startsWith('Africa/')
            if (region === 'oceania') return (
              tz.startsWith('Australia/') ||
              (tz.startsWith('Pacific/') && !tz.includes('Honolulu'))
            )
            if (region === 'other') return (
              tz.startsWith('UTC') || tz.startsWith('GMT') || tz.startsWith('Atlantic/')
            )
            return false
          })
          .map(tz => ({
            id: tz,
            name: timezones[tz],
            description: t(`timezone.descriptions.${tz}`)
          }))
      })).filter(group => group.timezones.length > 0)

      console.log('Timezone groups:', groups.map(g => `${g.region}: ${g.timezones.length}`))
      return groups
    } catch (error) {
      console.error('Error loading timezone data:', error)
      return []
    }
  }, [t])

  // 搜索过滤
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return timezoneGroups

    return timezoneGroups.map(group => ({
      ...group,
      timezones: group.timezones.filter(tz =>
        tz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tz.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(group => group.timezones.length > 0)
  }, [timezoneGroups, searchQuery])

  // 保存时区设置
  const handleSave = async () => {
    console.log('handleSave called:', { selectedTimezone, currentTimezone })

    if (selectedTimezone === currentTimezone) {
      console.log('No change in timezone, closing modal')
      onClose()
      return
    }

    setIsSaving(true)

    try {
      console.log('Calling onTimezoneChange with:', selectedTimezone)
      await onTimezoneChange(selectedTimezone)

      // 保存成功，显示成功消息并关闭模态框
      console.log(t('timezone.save_success'))
      console.log('Timezone save completed, closing modal')

    } catch (error) {
      console.error('保存时区设置时发生错误:', error)
      // 显示错误消息但不阻止界面关闭
      console.log(t('timezone.save_failed'))
    } finally {
      setIsSaving(false)
      // 无论成功还是失败都关闭模态框，因为本地状态已经更新
      onClose()
    }
  }

  // 重置选择
  useEffect(() => {
    if (isOpen) {
      setSelectedTimezone(currentTimezone)
      setSearchQuery('')
    }
  }, [isOpen, currentTimezone])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
        style={{ backgroundColor: colors.card.background }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: colors.border }}>
          <div>
            <h2 className="text-xl font-bold" style={{ color: colors.text }}>
              {t('timezone.settings_title')}
            </h2>
            <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
              {t('timezone.settings_description')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: colors.border,
              color: colors.textSecondary
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b" style={{ borderColor: colors.border }}>
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              style={{ color: colors.textSecondary }}
            />
            <input
              type="text"
              placeholder={t('timezone.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border outline-none"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.text
              }}
            />
          </div>
        </div>

        {/* Timezone List */}
        <div className="flex-1 overflow-y-auto">
          {filteredGroups.map((group) => (
            <div key={group.region} className="p-4">
              <h3 className="text-sm font-semibold mb-3 px-3" style={{ color: colors.textSecondary }}>
                {t(`timezone.regions.${group.region}`)}
              </h3>
              <div className="space-y-1">
                {group.timezones.map((timezone) => (
                  <button
                    key={timezone.id}
                    onClick={() => setSelectedTimezone(timezone.id)}
                    className="w-full flex items-center justify-between p-3 rounded-lg transition-colors"
                    style={{
                      backgroundColor: selectedTimezone === timezone.id
                        ? colors.accent.blue + '20'
                        : 'transparent',
                      color: selectedTimezone === timezone.id
                        ? colors.accent.blue
                        : colors.text
                    }}
                    onMouseEnter={(e) => {
                      if (selectedTimezone !== timezone.id) {
                        e.currentTarget.style.backgroundColor = colors.border
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedTimezone !== timezone.id) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }
                    }}
                  >
                    <div className="text-left">
                      <div className="font-medium">{timezone.name}</div>
                      <div className="text-sm opacity-70">{timezone.description}</div>
                    </div>
                    {selectedTimezone === timezone.id && (
                      <Check size={20} style={{ color: colors.accent.blue }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t" style={{ borderColor: colors.border }}>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-lg border transition-colors"
            style={{
              borderColor: colors.border,
              color: colors.text,
              backgroundColor: 'transparent'
            }}
            disabled={isSaving}
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-lg transition-colors"
            style={{
              backgroundColor: colors.accent.blue,
              color: 'white'
            }}
            disabled={isSaving || selectedTimezone === currentTimezone}
          >
            {isSaving ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                {t('common.saving')}
              </div>
            ) : (
              t('common.save')
            )}
          </button>
        </div>
      </div>
    </div>
  )
}