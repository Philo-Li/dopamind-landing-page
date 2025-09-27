'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useThemeColors } from '@/hooks/useThemeColor'
import { useLocalization } from '@/hooks/useLocalization'
import { storage, User } from '@/lib/utils'
import { authApi } from '@/lib/api'
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Shield,
  Camera,
  RefreshCw
} from 'lucide-react'

export default function AccountContent() {
  const colors = useThemeColors()
  const router = useRouter()
  const { t } = useLocalization()

  // State management
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isResendingVerification, setIsResendingVerification] = useState(false)

  // Form state for editing
  const [editForm, setEditForm] = useState({
    nickname: '',
    email: '',
    avatarUrl: ''
  })

  // Initialize data
  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    setIsLoading(true)
    try {
      // First try to get from localStorage
      const localUser = storage.getUser()
      if (localUser) {
        setUser(localUser)
        setEditForm({
          nickname: localUser.nickname || '',
          email: localUser.email || '',
          avatarUrl: localUser.avatarUrl || ''
        })
      }

      // Then refresh from server
      const response = await authApi.getProfile()
      if (response.success && response.data) {
        const serverUser = response.data
        setUser(serverUser)
        storage.saveUser(serverUser)
        setEditForm({
          nickname: serverUser.nickname || '',
          email: serverUser.email || '',
          avatarUrl: serverUser.avatarUrl || ''
        })
      }
    } catch (error) {
      console.error('Failed to load user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return t('profile.account_info.unknown')
    return new Date(dateString).toLocaleDateString('zh-CN')
  }

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return t('profile.account_info.not_set')
    return user.nickname || user.email?.split('@')[0] || user.phoneNumber || t('profile.account_info.not_set')
  }

  // Handle edit form submission
  const handleSaveEdit = async () => {
    if (!user) return

    setIsUpdating(true)
    try {
      const response = await authApi.updateProfile({
        nickname: editForm.nickname,
        email: editForm.email,
        avatarUrl: editForm.avatarUrl
      })

      if (response.success) {
        const updatedUser = { ...user, ...editForm }
        setUser(updatedUser)
        storage.saveUser(updatedUser)
        setShowEditModal(false)
        // TODO: Show success toast
      } else {
        // TODO: Show error toast
        console.error('Update failed:', response.error?.message)
      }
    } catch (error) {
      console.error('Update failed:', error)
      // TODO: Show error toast
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      setPasswordError(t('profile.account_info.password_placeholder'))
      return
    }

    setIsDeleting(true)
    setPasswordError('')

    try {
      // Note: The mobile app expects password validation in deleteUserAccount service
      // For web, we'll use the authApi.deleteUser endpoint
      const response = await authApi.deleteUser()

      if (response.success) {
        // Clear all data and redirect to login
        await storage.clearAllCache()
        router.push('/login')
        // TODO: Show success message
      } else {
        setPasswordError(response.error?.message || t('profile.account_info.delete_error'))
      }
    } catch (error: any) {
      console.error('Delete account error:', error)
      if (error.message?.includes('password') || error.message?.includes('密码')) {
        setPasswordError(t('profile.account_info.password_incorrect'))
      } else {
        setPasswordError(t('profile.account_info.delete_error'))
      }
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle email verification resend
  const handleResendVerification = async () => {
    if (!user?.email) return

    setIsResendingVerification(true)
    try {
      // TODO: Implement resend verification API call
      // const response = await authApi.resendVerification()
      // For now, just simulate the action
      console.log('Resending verification email...')
      // TODO: Show success toast
    } catch (error) {
      console.error('Resend verification failed:', error)
      // TODO: Show error toast
    } finally {
      setIsResendingVerification(false)
    }
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: colors.tint }}></div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 border-b h-[64px]"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.border
        }}
      >
        <h1 className="text-xl font-semibold" style={{ color: colors.text }}>
          {t('profile.account_info.title')}
        </h1>
        <button
          onClick={() => setShowEditModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-opacity-10 transition-colors"
          style={{ backgroundColor: colors.tint + '20', color: colors.tint }}
        >
          <Edit2 size={16} />
          <span>编辑</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">

          {/* Profile Header */}
          <div
            className="p-6 rounded-xl border"
            style={{
              backgroundColor: colors.card.background,
              borderColor: colors.card.border
            }}
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                {user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt="头像"
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center border-2"
                    style={{
                      backgroundColor: colors.card.background,
                      borderColor: colors.border
                    }}
                  >
                    <UserIcon size={32} style={{ color: colors.tint }} />
                  </div>
                )}
                <button
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white"
                  style={{ backgroundColor: colors.tint }}
                >
                  <Camera size={14} color="white" />
                </button>
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1" style={{ color: colors.text }}>
                  {getUserDisplayName()}
                </h2>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  {user?.email || t('profile.account_info.not_set')}
                </p>
              </div>

              <button
                onClick={loadUserData}
                className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
                style={{ color: colors.textSecondary }}
                disabled={isLoading}
              >
                <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Account Information */}
          <div
            className="p-6 rounded-xl border space-y-4"
            style={{
              backgroundColor: colors.card.background,
              borderColor: colors.card.border
            }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
              账户详细信息
            </h3>

            {/* Nickname */}
            <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: colors.card.border }}>
              <div className="flex items-center space-x-3">
                <UserIcon size={18} style={{ color: colors.textSecondary }} />
                <span style={{ color: colors.textSecondary }}>{t('profile.account_info.nickname_label')}</span>
              </div>
              <span className="font-medium" style={{ color: colors.text }}>
                {user?.nickname || t('profile.account_info.not_set')}
              </span>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: colors.card.border }}>
                <div className="flex items-center space-x-3">
                  <Mail size={18} style={{ color: colors.textSecondary }} />
                  <span style={{ color: colors.textSecondary }}>{t('profile.account_info.email_label')}</span>
                </div>
                <span className="font-medium" style={{ color: colors.text }}>
                  {user?.email || t('profile.account_info.not_set')}
                </span>
              </div>

              {/* Email Verification Status */}
              {user?.email && (
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    {user.emailVerified ? (
                      <CheckCircle size={18} style={{ color: colors.status.success }} />
                    ) : (
                      <AlertTriangle size={18} style={{ color: colors.status.warning }} />
                    )}
                    <span style={{ color: colors.textSecondary }}>
                      {t('profile.account_info.email_verification')}
                    </span>
                  </div>

                  {user.emailVerified ? (
                    <span
                      className="text-sm font-medium"
                      style={{ color: colors.status.success }}
                    >
                      {t('profile.account_info.verified')}
                    </span>
                  ) : (
                    <button
                      onClick={handleResendVerification}
                      disabled={isResendingVerification}
                      className="text-sm font-medium hover:underline"
                      style={{ color: colors.tint }}
                    >
                      {isResendingVerification ? '发送中...' : t('profile.account_info.resend_verification')}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: colors.card.border }}>
                <div className="flex items-center space-x-3">
                  <Phone size={18} style={{ color: colors.textSecondary }} />
                  <span style={{ color: colors.textSecondary }}>{t('profile.account_info.phone_label')}</span>
                </div>
                <span className="font-medium" style={{ color: colors.text }}>
                  {user?.phoneNumber || t('profile.account_info.not_set')}
                </span>
              </div>

              {/* Phone Verification Status */}
              {user?.phoneNumber && (
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    {user.phoneVerified ? (
                      <CheckCircle size={18} style={{ color: colors.status.success }} />
                    ) : (
                      <AlertTriangle size={18} style={{ color: colors.status.warning }} />
                    )}
                    <span style={{ color: colors.textSecondary }}>
                      {t('profile.account_info.phone_verification')}
                    </span>
                  </div>

                  <span
                    className={`text-sm font-medium ${user.phoneVerified ? '' : 'opacity-75'}`}
                    style={{ color: user.phoneVerified ? colors.status.success : colors.status.warning }}
                  >
                    {user.phoneVerified ? t('profile.account_info.verified') : t('profile.account_info.unverified')}
                  </span>
                </div>
              )}
            </div>

            {/* Register Time */}
            <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: colors.card.border }}>
              <div className="flex items-center space-x-3">
                <Calendar size={18} style={{ color: colors.textSecondary }} />
                <span style={{ color: colors.textSecondary }}>{t('profile.account_info.register_time')}</span>
              </div>
              <span className="font-medium" style={{ color: colors.text }}>
                {formatDate(user?.createdAt)}
              </span>
            </div>

            {/* Last Updated */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <Clock size={18} style={{ color: colors.textSecondary }} />
                <span style={{ color: colors.textSecondary }}>{t('profile.account_info.last_updated')}</span>
              </div>
              <span className="font-medium" style={{ color: colors.text }}>
                {formatDate(user?.updatedAt)}
              </span>
            </div>
          </div>

          {/* Danger Zone */}
          <div
            className="p-6 rounded-xl border"
            style={{
              backgroundColor: colors.card.background,
              borderColor: colors.status.error + '30'
            }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Shield size={20} style={{ color: colors.status.error }} />
              <h3 className="text-lg font-semibold" style={{ color: colors.status.error }}>
                {t('profile.account_info.danger_zone')}
              </h3>
            </div>

            <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
              {t('profile.account_info.delete_warning')}
            </p>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors"
              style={{
                borderColor: colors.status.error,
                color: colors.status.error,
                backgroundColor: 'transparent'
              }}
            >
              <Trash2 size={16} />
              <span>{t('profile.account_info.delete_account_title')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            style={{ backgroundColor: colors.card.background }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
              编辑账户信息
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                  {t('profile.account_info.nickname_label')}
                </label>
                <input
                  type="text"
                  value={editForm.nickname}
                  onChange={(e) => setEditForm(prev => ({ ...prev, nickname: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                    color: colors.text
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                  {t('profile.account_info.email_label')}
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                    color: colors.text
                  }}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-2 px-4 border rounded-lg"
                style={{
                  borderColor: colors.border,
                  color: colors.text
                }}
              >
                取消
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isUpdating}
                className="flex-1 py-2 px-4 rounded-lg"
                style={{
                  backgroundColor: colors.tint,
                  color: 'white'
                }}
              >
                {isUpdating ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            style={{ backgroundColor: colors.card.background }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: colors.status.error }}>
              {t('profile.account_info.delete_confirm_title')}
            </h2>

            <p className="text-sm mb-6" style={{ color: colors.text }}>
              {t('profile.account_info.delete_confirm_message')}
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 px-4 border rounded-lg"
                style={{
                  borderColor: colors.border,
                  color: colors.text
                }}
              >
                {t('profile.account_info.cancel')}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setShowPasswordConfirm(true)
                }}
                className="flex-1 py-2 px-4 rounded-lg"
                style={{
                  backgroundColor: colors.status.error,
                  color: 'white'
                }}
              >
                {t('profile.account_info.continue_delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Confirmation Modal */}
      {showPasswordConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            style={{ backgroundColor: colors.card.background }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: colors.status.error }}>
              {t('profile.account_info.delete_password_title')}
            </h2>

            <p className="text-sm mb-4" style={{ color: colors.text }}>
              {t('profile.account_info.delete_password_message')}
            </p>

            <input
              type="password"
              value={deletePassword}
              onChange={(e) => {
                setDeletePassword(e.target.value)
                setPasswordError('')
              }}
              placeholder={t('profile.account_info.password_placeholder')}
              className="w-full px-3 py-2 border rounded-lg mb-2"
              style={{
                borderColor: passwordError ? colors.status.error : colors.border,
                backgroundColor: colors.background,
                color: colors.text
              }}
            />

            {passwordError && (
              <p className="text-sm mb-4" style={{ color: colors.status.error }}>
                {passwordError}
              </p>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowPasswordConfirm(false)
                  setDeletePassword('')
                  setPasswordError('')
                }}
                className="flex-1 py-2 px-4 border rounded-lg"
                style={{
                  borderColor: colors.border,
                  color: colors.text
                }}
                disabled={isDeleting}
              >
                {t('profile.account_info.cancel')}
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || !deletePassword.trim()}
                className="flex-1 py-2 px-4 rounded-lg"
                style={{
                  backgroundColor: colors.status.error,
                  color: 'white',
                  opacity: isDeleting || !deletePassword.trim() ? 0.5 : 1
                }}
              >
                {isDeleting ? t('profile.account_info.processing') : t('profile.account_info.confirm_delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}