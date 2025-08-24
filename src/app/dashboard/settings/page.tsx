"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft,
  Moon,
  Sun,
  Monitor,
  Bell,
  Download,
  Trash2,
  Save,
  Shield,
  Database,
  Palette,
  Clock
} from "lucide-react";

interface User {
  id: string;
  email: string;
  nickname: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'zh-CN' | 'en-US' | 'ja-JP';
  timezone: string;
  dateFormat: 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY';
  timeFormat: '24h' | '12h';
  startOfWeek: 'monday' | 'sunday';
  notifications: {
    taskReminders: boolean;
    focusBreaks: boolean;
    dailySummary: boolean;
    weeklyReport: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
  };
  privacy: {
    analyticsEnabled: boolean;
    crashReportsEnabled: boolean;
    usageDataEnabled: boolean;
  };
  focus: {
    defaultFocusTime: number;
    defaultBreakTime: number;
    longBreakInterval: number;
    autoStartBreaks: boolean;
    autoStartFocus: boolean;
  };
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'system',
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    startOfWeek: 'monday',
    notifications: {
      taskReminders: true,
      focusBreaks: true,
      dailySummary: true,
      weeklyReport: false,
      soundEnabled: true,
      vibrationEnabled: true,
    },
    privacy: {
      analyticsEnabled: true,
      crashReportsEnabled: true,
      usageDataEnabled: false,
    },
    focus: {
      defaultFocusTime: 25,
      defaultBreakTime: 5,
      longBreakInterval: 4,
      autoStartBreaks: false,
      autoStartFocus: false,
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push("/en/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // 加载用户设置 - 实际应用中应该从 API 获取
      const savedSettings = localStorage.getItem('app-settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push("/en/login");
      return;
    }
    
    setLoading(false);
  }, [router]);

  const handleSaveSettings = async () => {
    setSaving(true);
    
    try {
      // 这里应该调用 API 保存设置
      localStorage.setItem('app-settings', JSON.stringify(settings));
      
      // 应用主题设置
      if (settings.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (settings.theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // system theme
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', isDark);
      }
      
      alert('设置已保存');
      
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      // 模拟数据导出
      const exportData = {
        user: user,
        settings: settings,
        exportDate: new Date().toISOString(),
        tasks: [], // 这里应该包含用户的任务数据
        habits: [], // 这里应该包含用户的习惯数据
        focusSessions: [] // 这里应该包含用户的专注记录
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dopamind-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('导出失败，请重试');
    }
  };

  const handleClearCache = async () => {
    if (!confirm("确定要清除应用缓存吗？这可能会影响应用性能，直到重新加载数据。")) {
      return;
    }
    
    try {
      // 清除缓存
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      alert('缓存已清除');
      
    } catch (error) {
      console.error('Error clearing cache:', error);
      alert('清除缓存失败');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center text-muted hover:text-primary">
                <ArrowLeft className="h-5 w-5 mr-2" />
                返回仪表板
              </Link>
              <h1 className="text-xl font-semibold text-foreground">设置</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-muted">欢迎, {user.nickname}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* 外观设置 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-foreground flex items-center">
              <Palette className="h-5 w-5 mr-2 text-primary" />
              外观设置
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">主题</label>
              <div className="flex space-x-4">
                {[
                  { value: 'light', label: '浅色', icon: Sun },
                  { value: 'dark', label: '深色', icon: Moon },
                  { value: 'system', label: '跟随系统', icon: Monitor }
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setSettings(prev => ({ ...prev, theme: value as AppSettings['theme'] }))}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                      settings.theme === value
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-200 text-muted hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">语言</label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value as AppSettings['language'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="zh-CN">简体中文</option>
                  <option value="en-US">English</option>
                  <option value="ja-JP">日本語</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">时区</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Asia/Shanghai">北京时间 (UTC+8)</option>
                  <option value="America/New_York">纽约时间 (UTC-5)</option>
                  <option value="Europe/London">伦敦时间 (UTC+0)</option>
                  <option value="Asia/Tokyo">东京时间 (UTC+9)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">日期格式</label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => setSettings(prev => ({ ...prev, dateFormat: e.target.value as AppSettings['dateFormat'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="YYYY-MM-DD">2024-01-15</option>
                  <option value="MM/DD/YYYY">01/15/2024</option>
                  <option value="DD/MM/YYYY">15/01/2024</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">时间格式</label>
                <select
                  value={settings.timeFormat}
                  onChange={(e) => setSettings(prev => ({ ...prev, timeFormat: e.target.value as AppSettings['timeFormat'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="24h">24 小时制</option>
                  <option value="12h">12 小时制</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 专注设置 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-foreground flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              专注设置
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  默认专注时长 (分钟)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={settings.focus.defaultFocusTime}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    focus: { ...prev.focus, defaultFocusTime: parseInt(e.target.value) || 25 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  默认休息时长 (分钟)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.focus.defaultBreakTime}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    focus: { ...prev.focus, defaultBreakTime: parseInt(e.target.value) || 5 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  长休息间隔 (轮次)
                </label>
                <input
                  type="number"
                  min="2"
                  max="8"
                  value={settings.focus.longBreakInterval}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    focus: { ...prev.focus, longBreakInterval: parseInt(e.target.value) || 4 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">自动开始休息</p>
                  <p className="text-sm text-muted">专注时间结束后自动开始休息</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.focus.autoStartBreaks}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      focus: { ...prev.focus, autoStartBreaks: e.target.checked }
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">自动开始专注</p>
                  <p className="text-sm text-muted">休息时间结束后自动开始下一轮专注</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.focus.autoStartFocus}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      focus: { ...prev.focus, autoStartFocus: e.target.checked }
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 通知设置 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-foreground flex items-center">
              <Bell className="h-5 w-5 mr-2 text-primary" />
              通知设置
            </h2>
          </div>
          
          <div className="p-6 space-y-4">
            {[
              { key: 'taskReminders', label: '任务提醒', desc: '在任务截止时间前提醒您' },
              { key: 'focusBreaks', label: '专注休息提醒', desc: '专注时间和休息时间的开始/结束提醒' },
              { key: 'dailySummary', label: '每日总结', desc: '每天结束时发送当日完成情况总结' },
              { key: 'weeklyReport', label: '周报告', desc: '每周发送详细的进度报告' }
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-foreground">{label}</p>
                  <p className="text-sm text-muted">{desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications[key as keyof typeof settings.notifications]}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        [key]: e.target.checked
                      }
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}

            <div className="border-t border-gray-200 my-4"></div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">声音提醒</p>
                <p className="text-sm text-muted">播放提醒音效</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.soundEnabled}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, soundEnabled: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">振动提醒</p>
                <p className="text-sm text-muted">在移动设备上使用振动提醒</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.vibrationEnabled}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, vibrationEnabled: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* 隐私设置 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-foreground flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              隐私设置
            </h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">使用分析</p>
                <p className="text-sm text-muted">帮助我们改进产品，不包含个人身份信息</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.analyticsEnabled}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, analyticsEnabled: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">崩溃报告</p>
                <p className="text-sm text-muted">自动发送崩溃报告帮助我们修复问题</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.crashReportsEnabled}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, crashReportsEnabled: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">使用数据</p>
                <p className="text-sm text-muted">允许收集使用习惯数据用于个性化推荐</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.usageDataEnabled}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, usageDataEnabled: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* 数据管理 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-foreground flex items-center">
              <Database className="h-5 w-5 mr-2 text-primary" />
              数据管理
            </h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">导出数据</p>
                <p className="text-sm text-muted">下载您的所有个人数据副本</p>
              </div>
              <button
                onClick={handleExportData}
                className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm"
              >
                <Download className="h-4 w-4" />
                <span>导出</span>
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">清除缓存</p>
                <p className="text-sm text-muted">清除应用缓存以释放存储空间</p>
              </div>
              <button
                onClick={handleClearCache}
                className="flex items-center space-x-2 border border-gray-300 text-muted hover:text-foreground px-4 py-2 rounded-lg text-sm"
              >
                <Trash2 className="h-4 w-4" />
                <span>清除</span>
              </button>
            </div>
          </div>
        </div>

        {/* 保存按钮 */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="flex items-center space-x-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? '保存中...' : '保存设置'}</span>
          </button>
        </div>
      </main>
    </div>
  );
}