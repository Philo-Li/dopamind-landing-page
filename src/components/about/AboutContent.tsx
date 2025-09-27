'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useThemeColors } from '@/hooks/useThemeColor'
import { useLocalization } from '@/hooks/useLocalization'

// 导入版本信息
import packageJson from '../../../package.json'

export default function AboutContent() {
  const colors = useThemeColors()
  const { t } = useLocalization()

  // 获取版本信息
  const version = packageJson.version

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: colors.background }}>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 pb-8">
        {/* Header with Logo and Version */}
        <div className="text-center mb-8 pt-4">
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <Image
              src="/dopamind-logo.png"
              alt="Dopamind Logo"
              width={96}
              height={96}
              className="rounded-full object-cover"
              style={{ backgroundColor: 'transparent' }}
            />
          </div>
          <h1
            className="text-3xl font-bold mb-1"
            style={{ color: colors.text }}
          >
            Dopamind
          </h1>
          <p
            className="text-lg font-medium mb-2"
            style={{ color: colors.textSecondary }}
          >
            Version {version}
          </p>
          <p
            className="text-sm leading-5"
            style={{ color: colors.textSecondary }}
          >
            {t('about.tagline')}
          </p>
        </div>

        {/* Mission Section */}
        <section
          className="mb-6 p-5 rounded-xl border"
          style={{
            backgroundColor: colors.card.background,
            borderColor: colors.card.border
          }}
        >
          <h2
            className="text-lg font-semibold mb-3"
            style={{ color: colors.text }}
          >
            {t('about.mission.title')}
          </h2>
          <p
            className="text-sm leading-6 whitespace-pre-line"
            style={{ color: colors.textSecondary }}
          >
            {t('about.mission.description')}
          </p>
        </section>

        {/* Features Section */}
        <section
          className="mb-6 p-5 rounded-xl border"
          style={{
            backgroundColor: colors.card.background,
            borderColor: colors.card.border
          }}
        >
          <h2
            className="text-lg font-semibold mb-3"
            style={{ color: colors.text }}
          >
            {t('about.features.title')}
          </h2>
          <div className="space-y-3">
            <p
              className="text-sm leading-6 whitespace-pre-line"
              style={{ color: colors.textSecondary }}
            >
              {t('about.features.clear_mind')}
            </p>
            <p
              className="text-sm leading-6 whitespace-pre-line"
              style={{ color: colors.textSecondary }}
            >
              {t('about.features.crush_procrastination')}
            </p>
            <p
              className="text-sm leading-6 whitespace-pre-line"
              style={{ color: colors.textSecondary }}
            >
              {t('about.features.find_flow')}
            </p>
            <p
              className="text-sm leading-6 whitespace-pre-line"
              style={{ color: colors.textSecondary }}
            >
              {t('about.features.life_copilot')}
            </p>
            <p
              className="text-sm leading-6 whitespace-pre-line"
              style={{ color: colors.textSecondary }}
            >
              {t('about.features.visualize_progress')}
            </p>
          </div>
        </section>

        {/* Personal Note Section */}
        <section
          className="mb-6 p-5 rounded-xl border"
          style={{
            backgroundColor: colors.card.background,
            borderColor: colors.card.border
          }}
        >
          <h2
            className="text-lg font-semibold mb-3"
            style={{ color: colors.text }}
          >
            {t('about.personal_note.title')}
          </h2>
          <p
            className="text-sm leading-6 whitespace-pre-line"
            style={{ color: colors.textSecondary }}
          >
            {t('about.personal_note.description')}
          </p>
        </section>

        {/* Contact Section */}
        <section
          className="mb-6 p-5 rounded-xl border"
          style={{
            backgroundColor: colors.card.background,
            borderColor: colors.card.border
          }}
        >
          <h2
            className="text-lg font-semibold mb-3"
            style={{ color: colors.text }}
          >
            {t('about.contact.title')}
          </h2>
          <p
            className="text-sm leading-6 mb-4"
            style={{ color: colors.textSecondary }}
          >
            {t('about.contact.description')}
          </p>

          {/* Website Contact Row */}
          <div
            className="flex items-center py-2 px-2 mt-1 mb-1 rounded-lg gap-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}
          >
            <span
              className="text-sm font-medium"
              style={{ color: colors.textSecondary }}
            >
              {t('about.contact.website_label')}
            </span>
            <a
              href="https://dopamind.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-medium py-1 px-1 cursor-pointer hover:underline"
              style={{ color: colors.accent.blue }}
            >
              dopamind.app
            </a>
          </div>

          {/* Email Contact Row */}
          <div
            className="flex items-center py-2 px-2 mt-1 mb-1 rounded-lg gap-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}
          >
            <span
              className="text-sm font-medium"
              style={{ color: colors.textSecondary }}
            >
              {t('about.contact.email_label')}
            </span>
            <span
              className="text-base font-medium py-1 px-1 cursor-text select-all"
              style={{ color: colors.accent.blue }}
            >
              support@dopamind.com
            </span>
          </div>
        </section>
        </div>
      </div>
    </div>
  )
}