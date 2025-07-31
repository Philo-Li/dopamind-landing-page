'use client';

import Image from 'next/image';
import { ChevronDown, ChevronUp, Mail, MessageCircle, Book } from 'lucide-react';
import { useState } from 'react';
import AuthButton from '../../../components/AuthButton';

export default function SupportPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* 导航栏 */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <a href="/" className="flex items-center gap-2">
            <Image 
              src="/dopamind-logo.png"
              alt="Dopamind Logo" 
              width={32}
              height={32}
              className="rounded-[8px]"
            />
            <span className="text-xl font-bold text-foreground">Dopamind</span>
          </a>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="/" className="text-sm font-medium text-muted transition-colors hover:text-primary">首页</a>
            <a href="#features" className="text-sm font-medium text-muted transition-colors hover:text-primary">功能特性</a>
            <a href="#pricing" className="text-sm font-medium text-muted transition-colors hover:text-primary">价格方案</a>
            <a href="/support" className="text-sm font-medium text-primary">帮助中心</a>
          </nav>
          <div className="flex items-center gap-4">
            <AuthButton />
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="flex-1">
        {/* 页面标题 */}
        <section className="w-full py-16 md:py-20">
          <div className="container mx-auto px-4 text-center md:px-6">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
              Dopamind 支持中心
            </h1>
            <p className="mt-4 text-lg text-muted md:text-xl">
              我们致力于为您提供最好的使用体验。如果您遇到任何问题或需要帮助，这里有您需要的所有答案。
            </p>
          </div>
        </section>

        {/* 快速联系方式 */}
        <section className="w-full bg-gray-50 py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-sm">
                <Mail className="h-8 w-8 text-primary mb-3" />
                <h3 className="text-lg font-semibold text-foreground">邮件支持</h3>
                <p className="text-sm text-muted text-center mt-2">
                  发送邮件至 support@dopamind.com
                </p>
                <p className="text-xs text-muted mt-1">24-48小时内回复</p>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-sm">
                <MessageCircle className="h-8 w-8 text-primary mb-3" />
                <h3 className="text-lg font-semibold text-foreground">应用内反馈</h3>
                <p className="text-sm text-muted text-center mt-2">
                  在 App 的"我的"页面找到"意见反馈"
                </p>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-sm">
                <Book className="h-8 w-8 text-primary mb-3" />
                <h3 className="text-lg font-semibold text-foreground">使用指南</h3>
                <p className="text-sm text-muted text-center mt-2">
                  查看详细的功能使用教程
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ 部分 */}
        <section className="w-full py-16 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              常见问题解答
            </h2>
            
            <div className="max-w-3xl mx-auto space-y-6">
              {/* 账户相关 */}
              <div className="border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-foreground bg-gray-50 px-6 py-4 border-b border-gray-200">
                  账户与订阅
                </h3>
                <div className="p-6 space-y-4">
                  <FAQItem 
                    question="如何恢复我的 Premium 购买？"
                    answer="请确保您在新设备上登录了与购买时相同的 Apple ID 或 Google 账户。然后，在 Dopamind 的「我的」页面，进入 Premium 页面，点击「恢复购买」按钮即可。"
                  />
                  <FAQItem 
                    question="我忘记了密码怎么办？"
                    answer="在登录页面，点击「忘记密码」链接，然后按照屏幕上的指示通过您的注册邮箱重置密码。"
                  />
                  <FAQItem 
                    question="Dopamind 是否支持家庭共享？"
                    answer="目前我们的 Premium 订阅不支持 Apple 或 Google 的家庭共享功能。每个账户需要独立的订阅。"
                  />
                </div>
              </div>

              {/* 核心功能 */}
              <div className="border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-foreground bg-gray-50 px-6 py-4 border-b border-gray-200">
                  核心功能
                </h3>
                <div className="p-6 space-y-4">
                  <FAQItem 
                    question="AI 无法理解我的指令怎么办？"
                    answer="尝试用更简单、更直接的句子下达指令。例如，不说「我可能需要考虑一下明天去买点菜」，而是说「提醒我明天去超市买菜」。您也可以在对话中纠正 AI，它会不断学习。"
                  />
                  <FAQItem 
                    question="专注计时器在 App 退到后台时会停止吗？"
                    answer="不会。我们的专注计时器在后台也会正常运行，并会在专注时间结束时发送通知提醒您。请确保您已经允许 Dopamind 发送通知。"
                  />
                  <FAQItem 
                    question="如何同步我的数据到多个设备？"
                    answer="当您登录同一个账户时，您的任务、习惯和设置会自动同步到云端。请确保您在所有设备上都登录了同一个账户。"
                  />
                </div>
              </div>

              {/* 隐私与安全 */}
              <div className="border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-foreground bg-gray-50 px-6 py-4 border-b border-gray-200">
                  隐私与安全
                </h3>
                <div className="p-6 space-y-4">
                  <FAQItem 
                    question="我的数据是否安全？"
                    answer="是的，我们使用行业标准的加密技术保护您的数据。我们不会出售您的个人可识别数据。详情请参阅我们的隐私政策。"
                  />
                  <FAQItem 
                    question="如何删除我的账户和所有数据？"
                    answer="您可以在 App 的「我的」>「账户信息」页面找到删除账户的选项。请注意，此操作不可逆，您的所有任务、习惯和数据都将被永久删除。"
                  />
                </div>
              </div>

              {/* 技术问题 */}
              <div className="border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-foreground bg-gray-50 px-6 py-4 border-b border-gray-200">
                  技术问题
                </h3>
                <div className="p-6 space-y-4">
                  <FAQItem 
                    question="App 运行缓慢或经常崩溃怎么办？"
                    answer="请尝试重启 App 或重启您的设备。如果问题持续存在，请确保您使用的是最新版本的 Dopamind，并检查您的设备是否有足够的存储空间。"
                  />
                  <FAQItem 
                    question="为什么我收不到通知？"
                    answer="请检查您的设备通知设置，确保 Dopamind 被允许发送通知。在 iOS 上，进入设置 > 通知 > Dopamind；在 Android 上，进入设置 > 应用和通知 > Dopamind。"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 功能指南链接 */}
        <section className="w-full bg-gray-50 py-16">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">
              深入了解 Dopamind
            </h2>
            <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
              <a href="#" className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-primary mb-2">🚀 快速上手指南</h3>
                <p className="text-sm text-muted">从零开始，5分钟内掌握 Dopamind 的核心功能</p>
              </a>
              <a href="#" className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-primary mb-2">💡 AI 教练使用技巧</h3>
                <p className="text-sm text-muted">如何与 AI 教练有效对话，拆解复杂任务</p>
              </a>
              <a href="#" className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-primary mb-2">🧘 专注模式高级设置</h3>
                <p className="text-sm text-muted">打造你的完美"专注圣所"，提升专注效果</p>
              </a>
            </div>
          </div>
        </section>

        {/* 联系我们 */}
        <section className="w-full py-16">
          <div className="container mx-auto px-4 text-center md:px-6">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              仍然需要帮助？
            </h2>
            <p className="text-lg text-muted mb-8 max-w-2xl mx-auto">
              如果您的问题没有在上方得到解答，或者您有任何功能建议和反馈，我们非常乐意倾听！
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:support@dopamind.com"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105"
              >
                <Mail className="h-5 w-5" />
                发送邮件
              </a>
              <p className="text-sm text-muted">
                我们会在 24-48 小时内回复您的邮件
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="w-full border-t border-gray-200 bg-white py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image 
                  src="/dopamind-logo.png"
                  alt="Dopamind Logo" 
                  width={24}
                  height={24}
                  className="rounded-[6px]"
                />
                <span className="font-bold text-foreground">Dopamind</span>
              </div>
              <p className="text-sm text-muted">
                专为 ADHD 用户设计的 AI 专注伙伴
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">产品</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href="/" className="hover:text-primary">首页</a></li>
                <li><a href="#" className="hover:text-primary">功能特性</a></li>
                <li><a href="#" className="hover:text-primary">价格方案</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">支持</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href="/support" className="hover:text-primary">帮助中心</a></li>
                <li><a href="mailto:support@dopamind.com" className="hover:text-primary">联系我们</a></li>
                <li><a href="#" className="hover:text-primary">状态页面</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">法律</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href="/privacy" className="hover:text-primary">隐私政策</a></li>
                <li><a href="#" className="hover:text-primary">服务条款</a></li>
                <li><a href="#" className="hover:text-primary">Cookie 政策</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-muted">
            <p>&copy; {new Date().getFullYear()} Dopamind Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// FAQ 组件
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        className="flex w-full items-center justify-between py-3 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-foreground">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-muted flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-3">
          <p className="text-muted">{answer}</p>
        </div>
      )}
    </div>
  );
}