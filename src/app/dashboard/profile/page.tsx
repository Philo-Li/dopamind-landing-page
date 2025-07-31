"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  ArrowLeft,
  Edit3,
  Save,
  X,
  Shield,
  Settings,
  Trash2,
  AlertTriangle
} from "lucide-react";

interface User {
  id: string;
  email: string;
  nickname: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  timezone?: string;
  language?: string;
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    notifications: {
      email: true,
      push: true,
      marketing: false
    }
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nickname: '',
    firstName: '',
    lastName: '',
    phone: '',
    timezone: '',
    language: ''
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // 初始化编辑表单
      setEditForm({
        nickname: parsedUser.nickname || '',
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        timezone: profile.timezone || 'Asia/Shanghai',
        language: profile.language || 'zh-CN'
      });
      
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push("/login");
      return;
    }
    
    setLoading(false);
  }, [router, profile.firstName, profile.lastName, profile.phone, profile.timezone, profile.language]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      // 这里应该调用 API 更新用户信息
      const updatedUser = {
        ...user,
        nickname: editForm.nickname
      };
      
      const updatedProfile = {
        ...profile,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        phone: editForm.phone,
        timezone: editForm.timezone,
        language: editForm.language
      };
      
      setUser(updatedUser);
      setProfile(updatedProfile);
      
      // 更新本地存储
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setEditing(false);
      
      // 显示成功消息
      alert('个人信息已更新');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('更新失败，请重试');
    }
  };

  const handleNotificationChange = (type: keyof UserProfile['notifications'], value: boolean) => {
    setProfile(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: value
      }
    }));
    
    // 这里应该调用 API 更新通知设置
    console.log(`Updating ${type} notification to ${value}`);
  };

  const handleDeleteAccount = async () => {
    if (!confirm("确定要删除账户吗？此操作不可撤销，所有数据将被永久删除。")) {
      return;
    }
    
    try {
      // 这里应该调用 API 删除账户
      console.log("删除账户");
      
      // 清除本地数据
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // 跳转到首页
      router.push("/");
      
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('删除失败，请重试');
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
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center text-muted hover:text-primary">
                <ArrowLeft className="h-5 w-5 mr-2" />
                返回仪表板
              </Link>
              <h1 className="text-xl font-semibold text-foreground">个人信息</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-muted">欢迎, {user.nickname}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* 基本信息 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground flex items-center">
              <UserIcon className="h-5 w-5 mr-2 text-primary" />
              基本信息
            </h2>
            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center space-x-2 text-primary hover:text-primary/80"
            >
              {editing ? (
                <>
                  <X className="h-4 w-4" />
                  <span>取消</span>
                </>
              ) : (
                <>
                  <Edit3 className="h-4 w-4" />
                  <span>编辑</span>
                </>
              )}
            </button>
          </div>
          
          <div className="p-6">
            {editing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      昵称 *
                    </label>
                    <input
                      type="text"
                      value={editForm.nickname}
                      onChange={(e) => setEditForm(prev => ({ ...prev, nickname: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      邮箱
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-muted"
                    />
                    <p className="text-xs text-muted mt-1">邮箱地址不可修改</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      姓
                    </label>
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      名
                    </label>
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      手机号
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      时区
                    </label>
                    <select
                      value={editForm.timezone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="Asia/Shanghai">北京时间 (UTC+8)</option>
                      <option value="America/New_York">纽约时间 (UTC-5)</option>
                      <option value="Europe/London">伦敦时间 (UTC+0)</option>
                      <option value="Asia/Tokyo">东京时间 (UTC+9)</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 border border-gray-300 text-muted hover:text-foreground rounded-lg"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg"
                  >
                    <Save className="h-4 w-4" />
                    <span>保存</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-5 w-5 text-muted" />
                  <div>
                    <p className="text-sm text-muted">昵称</p>
                    <p className="font-medium text-foreground">{user.nickname}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-muted" />
                  <div>
                    <p className="text-sm text-muted">邮箱</p>
                    <p className="font-medium text-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-muted" />
                  <div>
                    <p className="text-sm text-muted">注册时间</p>
                    <p className="font-medium text-foreground">
                      {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                </div>

                {profile.firstName && (
                  <div className="flex items-center space-x-3">
                    <UserIcon className="h-5 w-5 text-muted" />
                    <div>
                      <p className="text-sm text-muted">姓名</p>
                      <p className="font-medium text-foreground">
                        {profile.firstName} {profile.lastName}
                      </p>
                    </div>
                  </div>
                )}

                {profile.phone && (
                  <div className="flex items-center space-x-3">
                    <UserIcon className="h-5 w-5 text-muted" />
                    <div>
                      <p className="text-sm text-muted">手机号</p>
                      <p className="font-medium text-foreground">{profile.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 通知设置 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-foreground flex items-center">
              <Settings className="h-5 w-5 mr-2 text-primary" />
              通知设置
            </h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">邮件通知</p>
                <p className="text-sm text-muted">接收重要的产品更新和提醒</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.notifications.email}
                  onChange={(e) => handleNotificationChange('email', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">推送通知</p>
                <p className="text-sm text-muted">在移动设备上接收实时提醒</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.notifications.push}
                  onChange={(e) => handleNotificationChange('push', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">营销邮件</p>
                <p className="text-sm text-muted">接收产品新闻和特别优惠</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.notifications.marketing}
                  onChange={(e) => handleNotificationChange('marketing', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* 安全设置 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-foreground flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              安全设置
            </h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">修改密码</p>
                <p className="text-sm text-muted">定期更换密码以保护账户安全</p>
              </div>
              <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm">
                修改密码
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">两步验证</p>
                <p className="text-sm text-muted">为您的账户添加额外的安全层</p>
              </div>
              <button className="border border-gray-300 text-muted hover:text-foreground px-4 py-2 rounded-lg text-sm">
                启用
              </button>
            </div>
          </div>
        </div>

        {/* 危险区域 */}
        <div className="bg-white rounded-lg shadow-sm border border-red-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-red-200 bg-red-50">
            <h2 className="text-lg font-semibold text-red-700 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              危险区域
            </h2>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">删除账户</p>
                <p className="text-sm text-muted">永久删除您的账户和所有相关数据</p>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>删除账户</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}