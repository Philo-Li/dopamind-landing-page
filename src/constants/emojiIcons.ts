// 常用的快速选择 Emoji
export const QUICK_EMOJIS = [
  '📚', '💪', '🧘', '💧', '🌙', '☀️', '🍎', '⭐'
];

// Emoji 分类
export const EMOJI_CATEGORIES = [
  {
    name: '学习与工作',
    emojis: ['📚', '✏️', '📝', '💻', '📱', '🎯', '📊', '📈', '💡', '✍️']
  },
  {
    name: '健康与运动',
    emojis: ['💪', '🏃', '🚶', '🧘', '🏋️', '🚴', '🏊', '⚽', '🎾', '🏸']
  },
  {
    name: '生活习惯',
    emojis: ['💧', '🥤', '🍎', '🥗', '🥑', '🥦', '🍳', '🥩', '🥛', '🫐']
  },
  {
    name: '休息与放松',
    emojis: ['😴', '🌙', '☀️', '⏰', '🛏️', '🧘‍♀️', '🎮', '🎵', '🎧', '📺']
  },
  {
    name: '心理健康',
    emojis: ['🧠', '😊', '🙏', '🌱', '🌿', '🌺', '🦋', '🌈', '✨', '💫']
  },
  {
    name: '社交与沟通',
    emojis: ['👥', '💬', '📞', '✉️', '🤝', '🗣️', '👋', '💌', '🤗', '💕']
  }
];

// 简化的工具函数 - 直接使用emoji作为icon
export const getEmojiFromIcon = (icon: string): string => {
  // 如果传入的已经是emoji，直接返回
  if (icon && icon.length <= 2 && /[^\x00-\x7F]/.test(icon)) {
    return icon;
  }

  // 兼容旧的icon名称
  const iconMap: Record<string, string> = {
    'star': '⭐',
    'book': '📚',
    'fitness': '💪',
    'water': '💧',
    'heart': '❤️',
    'leaf': '🌱',
    'flash': '⚡',
    'moon': '🌙',
    'sun': '☀️',
    'fire': '🔥',
    'target': '🎯',
    'music': '🎵',
    'coffee': '☕',
    'apple': '🍎',
    'run': '🏃',
    'sleep': '😴',
    'meditation': '🧘',
    'writing': '✍️',
    'guitar': '🎸',
    'code': '💻'
  };

  return iconMap[icon] || '⭐';
};

export const getIconFromEmoji = (emoji: string): string => {
  // 现在直接使用emoji作为icon存储
  return emoji || '⭐';
};