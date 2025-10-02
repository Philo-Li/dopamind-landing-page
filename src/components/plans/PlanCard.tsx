"use client";

import { CheckCircle, Crown, Gift, TrendingUp } from 'lucide-react';

export interface PlanCardProps {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
  isTrial?: boolean;
  isSelected?: boolean;
  isCurrent?: boolean;
  isUpgrade?: boolean;
  onClick?: () => void;
  badges?: {
    current?: string;
    upgrade?: string;
    popular?: string;
    trial?: string;
  };
  colors?: {
    tint: string;
    text: string;
    textSecondary: string;
    cardBackground?: string;
    cardBorder?: string;
    cardBorderHover?: string;
  };
  yearlyDiscount?: string;
  featureHighlights?: {
    yearlyExclusive?: string[];
    premiumFeatures?: string[];
  };
}

export default function PlanCard({
  id,
  name,
  price,
  period,
  features,
  isPopular = false,
  isTrial = false,
  isSelected = false,
  isCurrent = false,
  isUpgrade = false,
  onClick,
  badges = {},
  colors,
  yearlyDiscount,
  featureHighlights = {},
}: PlanCardProps) {
  // 使用提供的颜色或默认颜色（用于 landing page）
  // 如果是升级方案，使用橙色；否则使用主题色
  const primaryColor = isUpgrade ? 'rgb(249, 115, 22)' : (colors?.tint || 'rgb(99, 102, 241)'); // 升级用橙色，默认紫色
  const textColor = colors?.text || '#000000';
  const textSecondary = colors?.textSecondary || '#6b7280';
  const cardBackground = colors?.cardBackground || '#ffffff';
  const cardBorder = colors?.cardBorder || '#e5e7eb'; // gray-200
  const cardBorderHover = colors?.cardBorderHover || '#d1d5db'; // gray-300

  return (
    <div
      onClick={onClick}
      className={`relative rounded-3xl p-8 shadow-lg transition-all hover:shadow-xl ${
        onClick ? 'cursor-pointer' : ''
      } ${
        isSelected
          ? 'border-2 ring-4 ring-offset-2'
          : 'border'
      } ${isCurrent ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
      style={{
        backgroundColor: cardBackground,
        borderColor: isSelected ? primaryColor : cardBorder,
        '--tw-ring-color': isSelected ? `${primaryColor}33` : undefined,
      } as React.CSSProperties}
      onMouseEnter={(e) => {
        if (!isSelected && onClick) {
          e.currentTarget.style.borderColor = cardBorderHover;
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected && onClick) {
          e.currentTarget.style.borderColor = cardBorder;
        }
      }}
    >
      {/* 选中指示器 */}
      {isSelected && !isCurrent && (
        <div
          className="absolute -top-3 -right-3 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: primaryColor }}
        >
          <CheckCircle className="w-4 h-4 text-white" />
        </div>
      )}

      {/* 当前方案标识 */}
      {isCurrent && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-green-500 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
            <Crown className="w-4 h-4" />
            {badges.current || 'Current'}
          </span>
        </div>
      )}

      {/* 升级标识 */}
      {isUpgrade && !isSelected && (
        <div className="absolute -top-4 right-4">
          <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {badges.upgrade || 'Upgrade'}
          </span>
        </div>
      )}

      {/* 推荐标签 */}
      {isPopular && !isCurrent && !isUpgrade && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span
            className="text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg"
            style={{ backgroundColor: primaryColor }}
          >
            {badges.popular || 'Popular'}
          </span>
        </div>
      )}

      {/* 试用标签 */}
      {isTrial && !isCurrent && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-green-500 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
            <Gift className="w-4 h-4" />
            {badges.trial || 'Trial'}
          </span>
        </div>
      )}

      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2" style={{ color: textColor }}>
          {name}
        </h3>
        <div className="mb-6">
          <span className="text-4xl font-bold" style={{ color: textColor }}>
            {price}
          </span>
          <span className="text-gray-500 ml-2">/{period}</span>
        </div>

        {/* 年度计划折扣 */}
        {id === 'yearly' && yearlyDiscount && (
          <div className="mb-6">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              {yearlyDiscount}
            </span>
          </div>
        )}

        <ul className="space-y-4 text-left">
          {features.map((feature, index) => {
            // 为年度订阅的独有功能添加特殊样式
            const isYearlyExclusiveFeature =
              id === 'yearly' &&
              featureHighlights.yearlyExclusive?.some((exclusiveFeature) =>
                feature.includes(exclusiveFeature)
              );

            // 为试用、月度和年度订阅的高级功能添加特殊样式
            const isPremiumFeature =
              (id === 'trial' || id === 'monthly' || id === 'yearly') &&
              featureHighlights.premiumFeatures?.some((premiumFeature) =>
                feature.includes(premiumFeature)
              );

            const shouldHighlight = isYearlyExclusiveFeature || isPremiumFeature;

            return (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle
                  className={`mt-0.5 h-5 w-5 flex-shrink-0 ${
                    shouldHighlight ? 'text-green-500' : ''
                  }`}
                  style={{
                    color: shouldHighlight ? '#10b981' : primaryColor,
                  }}
                />
                <span
                  className={`text-sm ${shouldHighlight ? 'font-medium' : ''}`}
                  style={{
                    color: shouldHighlight ? textColor : textSecondary,
                  }}
                >
                  {feature}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
