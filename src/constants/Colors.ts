/**
 * Colors configuration for Dopamind Web - Based on mobile app design
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 */

const tintColorLight = '#F97316'; // 主品牌色：充满活力的橙色
const tintColorDark = '#F97316'; // 橙色主题

// 浅色主题辅助色
const accentBlueLight = '#3B82F6'; // Blue 500 from Tailwind - 用于信息、链接和主要操作
const accentGreenLight = '#10B981'; // Emerald 500 - 用于成功、完成状态
const accentRedLight = '#EF4444'; // Red 500 - 用于错误、删除、紧急
const accentYellowLight = '#F59E0B'; // Amber 500 - 用于警告、待处理
const pressedOrange = '#CA7842'; // 按钮按压状态的颜色

const Colors = {
  light: {
    text: '#000000', // 纯黑色用于主要文本
    textSecondary: '#000000', // 纯黑色用于次要文本
    background: '#F3F4F6', // Gray 100 - 浅灰色聊天背景
    tint: tintColorLight,
    primary: tintColorLight,
    tabIconDefault: '#9CA3AF', // Gray 400
    tabIconSelected: tintColorLight,
    border: '#F3F4F6', // Gray 100

    card: {
      background: '#FFFFFF', // 纯白卡片，与背景形成微妙对比
      border: '#F3F4F6', // Gray 100 - 非常浅的边框
    },
    button: {
      primary: tintColorLight,
      secondary: '#F3F4F6', // Gray 100 - 用于次要按钮
      text: '#FFFFFF',
      disabled: '#D1D5DB',
      pressed: pressedOrange, // 新增：按钮按压状态颜色
    },
    status: {
      success: accentGreenLight,
      warning: accentYellowLight,
      error: accentRedLight,
      completed: accentGreenLight, // 任务完成状态
      inProgress: accentBlueLight, // 任务进行中状态
      pending: accentYellowLight,  // 任务待处理状态
    },
    input: {
      background: '#FFFFFF',
      text: '#1F2937',
      border: '#D1D5DB', // Gray 300
      placeholder: '#9CA3AF',
    },
    inputBorder: '#D1D5DB', // Gray 300
    chatBubble: {
      user: tintColorLight, // 橙色 - 用户气泡（移动端设计）
      ai: '#FFFFFF', // 纯白色 - AI气泡（移动端设计）
    },
    chatText: {
      user: '#FFFFFF', // 白色文字 - 用户（移动端设计）
      ai: '#1F2937', // 深色文字 - AI（移动端设计）
    },
    subtask: {
      completedBackground: '#ECFDF5', // Green 50 - 淡淡的绿色背景
      completedBorder: '#A7F3D0', // Green 200
    },
    // 新增辅助色
    accent: {
      blue: accentBlueLight,
      mint: '#34D399', // Emerald 400
      purple: '#8B5CF6', // Violet 500
      green: accentGreenLight,
      orange: '#F97316', // Orange 500
    },
    // 新增渐变色
    gradient: {
      primary: [tintColorLight, '#FB923C'],
      success: [accentGreenLight, '#34D399'],
      focus: [accentBlueLight, '#60A5FA'],
    },
    // 新增专注模式专用色
    focus: {
      progress: accentBlueLight,
      success: accentGreenLight,
      background: '#EFF6FF', // Blue 50
    },
  },
  dark: {
    text: '#FFFFFF', // 纯白色用于主要文本
    textSecondary: '#FFFFFF', // 纯白色用于次要文本
    background: '#111827',
    tint: tintColorDark,
    primary: tintColorDark,
    tabIconDefault: '#9CA3AF', // Gray 400 - 用于未选中的图标，保持原来的颜色
    tabIconSelected: tintColorDark,
    border: '#4B5563',
    card: {
      background: '#1F2937',
      border: '#4B5563',
    },
    button: {
      primary: '#F97316',
      secondary: '#374151',
      text: '#FFFFFF',
      disabled: '#6B7280',
      pressed: pressedOrange, // 新增：按钮按压状态颜色（暗色模式）
    },
    status: {
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      completed: '#34D399', // 任务完成状态
      inProgress: '#60A5FA', // 任务进行中状态
      pending: '#FBBF24',  // 任务待处理状态
    },
    input: {
      background: '#374151', // Gray 700，与AI气泡颜色一致，比原来的#1F2937更浅
      text: '#F9FAFB',
      border: '#4B5563',
      placeholder: '#9CA3AF',
    },
    inputBorder: '#4B5563',
    chatBubble: {
      user: '#F97316',
      ai: '#374151',
    },
    chatText: {
      user: '#FFFFFF',
      ai: '#F9FAFB',
    },
    subtask: {
      completedBackground: '#064E3B',
      completedBorder: '#059669',
    },
    // 新增辅助色（暗色模式）
    accent: {
      blue: '#60A5FA',
      mint: '#6EE7B7',
      purple: '#A78BFA',
      green: '#34D399',
      orange: '#F97316',
    },
    // 新增渐变色（暗色模式）
    gradient: {
      primary: ['#F97316', '#FB923C'],
      success: ['#34D399', '#6EE7B7'],
      focus: ['#60A5FA', '#6EE7B7'],
    },
    // 新增专注模式专用色（暗色模式）
    focus: {
      progress: '#60A5FA',
      success: '#6EE7B7',
      background: '#0F172A',
    },
  },
};

export default Colors;

// 导出类型定义，便于TypeScript使用
export type Theme = 'light' | 'dark';
export type ColorKey = keyof typeof Colors.light;
export type ColorValue = typeof Colors.light[ColorKey];