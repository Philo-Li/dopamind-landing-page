'use client'

import { useState, useRef, KeyboardEvent, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { chatApi } from '@/lib/api'
import { useThemeColors } from '@/hooks/useThemeColor'
import { useLocalization } from '@/hooks/useLocalization'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  prefilledMessage?: string
}

export default function ChatInput({ onSendMessage, disabled = false, prefilledMessage = '' }: ChatInputProps) {
  const colors = useThemeColors()
  const { t } = useLocalization()
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isSpacebarRecording, setIsSpacebarRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // 处理预设消息
  useEffect(() => {
    if (prefilledMessage && !message) {
      setMessage(prefilledMessage)
      // 聚焦输入框
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [prefilledMessage, message])

  const handleSend = () => {
    if (!message.trim() || disabled) return
    
    onSendMessage(message.trim())
    setMessage('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // 转录音频的API调用
  const transcribeAudio = useCallback(async (audioBlob: Blob): Promise<string> => {
    try {
      console.log('Starting transcription, audio blob size:', audioBlob.size)

      const response = await chatApi.transcribeAudio(audioBlob)
      console.log('Transcription response:', response)

      // 检查多种可能的响应格式
      if (response.success && response.data && response.data.transcript) {
        return response.data.transcript
      } else if (response.success && response.data && (response.data as any).text) {
        // 兼容可能的text字段
        return (response.data as any).text
      } else if (response.data && typeof response.data === 'string') {
        // 如果data直接是字符串
        return response.data
      } else if ((response as any).transcript) {
        // 直接在响应中的transcript字段
        return (response as any).transcript
      } else if ((response as any).text) {
        // 直接在响应中的text字段
        return (response as any).text
      } else {
        console.error('Unexpected response format:', response)
        throw new Error(t('chat.voice_error_transcribe_failed'))
      }
    } catch (error: any) {
      console.error('Transcription API error:', error)

      // 如果是网络错误或API不存在，给出更友好的提示
      if (error.message?.includes('404') || error.message?.includes('Not Found')) {
        throw new Error(t('chat.voice_error_transcribe_failed'))
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        throw new Error(t('chat.network_error'))
      } else {
        throw new Error(error.message || t('chat.voice_error_transcribe_failed'))
      }
    }
  }, [t])

  const startVoiceRecording = useCallback(async (isSpacebar = false) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        setIsRecording(false)
        setIsSpacebarRecording(false)
        setIsTranscribing(true)

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })

        try {
          const transcript = await transcribeAudio(audioBlob)
          if (transcript && transcript.trim()) {
            if (isSpacebar) {
              onSendMessage(transcript.trim())
            } else {
              setMessage(prev => prev + transcript.trim())
            }
          }
        } catch (error) {
          console.error('Transcription failed:', error)
          alert(t('chat.voice_error_transcribe_failed'))
        } finally {
          setIsTranscribing(false)
        }

        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      if (isSpacebar) {
        setIsSpacebarRecording(true)
      }
    } catch (error) {
      console.error('Failed to access microphone:', error)
      alert(t('chat.voice_error_mic_access_failed'))
    }
  }, [onSendMessage, transcribeAudio, t])

  const stopVoiceRecording = useCallback(() => {
    if (isSpacebarRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
    } else if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
      setIsRecording(false)
      setIsSpacebarRecording(false)
    }
  }, [isSpacebarRecording])

  const stopButtonRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      // 停止按钮录音，这将触发onstop事件并进行转录
      mediaRecorderRef.current.stop()
    }
  }

  const handleVoiceInput = () => {
    if (isRecording && !isSpacebarRecording) {
      // 如果正在通过按钮录音，点击停止录音
      stopButtonRecording()
    } else if (!isRecording) {
      // 如果没有录音，开始录音
      startVoiceRecording(false)
    }
  }

  // 全局空格键事件处理
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 只响应空格键，不在输入框等可编辑元素中时
      if (event.code === 'Space' && !event.repeat) {
        const target = event.target as HTMLElement

        // 检查是否在可编辑元素中
        const isInEditableElement = (
          target === inputRef.current ||
          target?.tagName?.toLowerCase() === 'input' ||
          target?.tagName?.toLowerCase() === 'textarea' ||
          target?.isContentEditable ||
          target?.getAttribute('contenteditable') === 'true'
        )

        // 如果不在可编辑元素中，启动语音录音
        if (!isInEditableElement) {
          // 防止页面滚动
          event.preventDefault()

          // 如果已经在录音，不要重复启动
          if (isRecording || disabled) return

          console.log('Starting spacebar voice recording') // 调试日志

          // 立即启动录音（移除延迟）
          startVoiceRecording(true)
        }
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        console.log('Space key up, isSpacebarRecording:', isSpacebarRecording) // 调试日志

        // 如果正在进行空格键录音，停止录音
        if (isSpacebarRecording) {
          stopVoiceRecording()
        }
      }
    }

    // 注册全局事件监听器
    document.addEventListener('keydown', handleKeyDown as any)
    document.addEventListener('keyup', handleKeyUp as any)

    // 清理函数
    return () => {
      document.removeEventListener('keydown', handleKeyDown as any)
      document.removeEventListener('keyup', handleKeyUp as any)
    }
  }, [isRecording, isSpacebarRecording, disabled, startVoiceRecording, stopVoiceRecording])

  return (
    <div className="p-4">
      <div className="flex items-end gap-3 max-w-4xl mx-auto">
        {/* 语音输入按钮 */}
        <Button
          type="button"
          onClick={handleVoiceInput}
          disabled={disabled || isTranscribing || isSpacebarRecording}
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full border transition-all duration-200"
          style={{
            backgroundColor: (isRecording && !isSpacebarRecording) ? colors.status.error : colors.input.background,
            borderColor: (isRecording && !isSpacebarRecording) ? colors.status.error : colors.input.border,
            color: (isRecording && !isSpacebarRecording) ? '#FFFFFF' : colors.input.text
          }}
        >
          {(isRecording && !isSpacebarRecording) ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </Button>

        {/* 文本输入区域 */}
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isTranscribing
                ? t('chat.input_placeholder_voice_transcribing')
                : isSpacebarRecording
                  ? t('chat.input_placeholder_spacebar_recording')
                  : isRecording
                    ? t('chat.input_placeholder_recording')
                    : t('chat.input_placeholder_with_voice')
            }
            disabled={disabled || isRecording || isTranscribing}
            className="h-12 pr-12 text-base border rounded-full focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            style={{
              backgroundColor: colors.input.background,
              borderColor: colors.input.border,
              color: colors.input.text
            }}
          />
          
          {/* 发送按钮 */}
          <Button
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            className="absolute right-2 top-2 h-8 w-8 rounded-full p-0 transition-all duration-200 disabled:cursor-not-allowed"
            style={{
              backgroundColor: !message.trim() || disabled ? colors.button.disabled : colors.primary,
              color: '#FFFFFF'
            }}
          >
            {disabled ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </Button>
        </div>
      </div>

      {/* 录音状态提示 */}
      {(isRecording || isTranscribing) && (
        <div className="mt-3 text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
            isTranscribing
              ? 'bg-yellow-50 text-yellow-700'
              : isSpacebarRecording
                ? 'bg-blue-50 text-blue-700'
                : 'bg-red-50 text-red-700'
          }`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              isTranscribing
                ? 'bg-yellow-500'
                : isSpacebarRecording
                  ? 'bg-blue-500'
                  : 'bg-red-500'
            }`}></div>
            {isTranscribing
              ? t('chat.voice_transcribing_status')
              : t('chat.voice_recording_status')
            }
          </div>
        </div>
      )}
    </div>
  )
}
