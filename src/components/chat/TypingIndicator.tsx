import Image from 'next/image'
import { useLocalization } from '@/hooks/useLocalization'

export default function TypingIndicator() {
  const { t } = useLocalization()
  return (
    <div className="flex justify-start mb-1.5 px-4">
      <div className="flex max-w-[75%] items-start gap-2">
        {/* AI Avatar */}
        <div className="flex-shrink-0 mt-1">
          <div className="w-7 h-7 rounded-full border-2 border-white/20 overflow-hidden">
            <div className="w-full h-full bg-white flex items-center justify-center p-0.5">
              <Image 
                src="/dopamind-logo-bw.jpg"
                alt="Dopamind AI" 
                width={24}
                height={24}
                className="rounded-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Typing Bubble */}
        <div className="bg-white text-gray-900 border border-gray-200 rounded-[20px] rounded-tl-[6px] shadow-md shadow-black/10 px-3 py-2">
          <div className="flex items-center space-x-1">
            <div className="text-sm text-gray-600 mr-2">{t('chat.ai_thinking')}</div>
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}