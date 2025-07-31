import Image from 'next/image';
import { CheckCircle, Play, Calendar, Brain, Clock, TrendingUp, Cloud, RefreshCw, Shield } from 'lucide-react';
import { getTranslation } from '../../lib/i18n';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import AuthButton from '../../../components/AuthButton';

interface HomePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const t = getTranslation(locale);

  return (
    <div className="flex min-h-screen flex-col">
      {/* 导航栏 */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <a href={`/${locale}`} className="flex items-center gap-2">
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
            <a href={`/${locale}#features`} className="text-sm font-medium text-muted transition-colors hover:text-primary">功能特性</a>
            <a href={`/${locale}#how-it-works`} className="text-sm font-medium text-muted transition-colors hover:text-primary">如何使用</a>
            <a href={`/${locale}/support`} className="text-sm font-medium text-muted transition-colors hover:text-primary">帮助中心</a>
          </nav>
          <div className="flex items-center gap-4">
            <LanguageSwitcher currentLocale={locale} />
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 1. Hero Section - 使用图1 */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 items-center">
              {/* 左侧文案 */}
              <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary w-fit">
                  专为 ADHD 用户设计
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  专为 ADHD 设计的<br />
                  <span className="text-primary">AI 伙伴</span>
                </h1>
                <p className="text-lg text-muted md:text-xl max-w-2xl">
                  您的思绪变为清晰的行动，用最自然的方式——对话，来管理您的整个生活。
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <a href="#" className="hover:scale-105 transition-transform">
                    <Image src="/download-app-store.svg" alt="Download on the App Store" width={160} height={54} />
                  </a>
                  <div className="flex flex-col justify-center">
                    <p className="text-sm text-muted">立即下载，开启 7 天免费 Premium 试用</p>
                  </div>
                </div>
              </div>
              
              {/* 右侧应用截图 */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <div className="relative">
                  {/* 手机外框 */}
                  <div className="relative w-[260px] h-[520px] bg-gray-900 rounded-[2.25rem] p-2 shadow-2xl">
                    {/* 屏幕区域 */}
                    <div className="w-full h-full bg-black rounded-[1.75rem] overflow-hidden relative">
                      <Image 
                        src="/1.jpg" 
                        alt="Dopamind AI 主界面" 
                        fill
                        className="object-cover"
                        style={{
                          objectPosition: 'center'
                        }}
                      />
                    </div>
                    
                    {/* 刘海/Dynamic Island */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-gray-900 rounded-full"></div>
                  </div>
                  
                  {/* 浮动装饰元素 */}
                  <div className="absolute -top-6 -right-6 w-8 h-8 bg-primary/30 rounded-full animate-pulse blur-sm"></div>
                  <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-orange-300/30 rounded-full animate-pulse [animation-delay:1s] blur-sm"></div>
                  <div className="absolute top-1/4 -right-8 w-6 h-6 bg-green-300/40 rounded-full animate-bounce [animation-delay:2s] blur-sm"></div>
                  <div className="absolute bottom-1/4 -left-8 w-4 h-4 bg-blue-300/40 rounded-full animate-pulse [animation-delay:3s] blur-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. "是什么" Section - 使用图2和图3 */}
        <section id="features" className="w-full py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            
            {/* 计划功能 - 图2 */}
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center mb-20">
              <div className="flex flex-col justify-center space-y-6">
                <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  计划，从容不迫
                </h2>
                <p className="text-lg text-muted md:text-xl">
                  告别杂乱无章的待办清单。Dopamind 的智能任务系统能自动分类、排序，并通过可视化的统计激励你。让你一眼看清重点，轻松应对每一天。
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-muted">智能任务分类和优先级排序</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-muted">进度可视化，激励持续行动</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-muted">告别「不知从何下手」的困扰</span>
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <Image 
                  src="/2.jpg" 
                  alt="智能任务管理" 
                  width={300} 
                  height={600}
                  className="rounded-3xl shadow-xl"
                />
              </div>
            </div>

            {/* 语音输入功能 - 图3 */}
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
              <div className="order-2 lg:order-1 flex items-center justify-center">
                <Image 
                  src="/3.jpg" 
                  alt="语音输入功能" 
                  width={300} 
                  height={600}
                  className="rounded-3xl shadow-xl"
                />
              </div>
              <div className="order-1 lg:order-2 flex flex-col justify-center space-y-6">
                <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  想到说到，即可办到
                </h2>
                <p className="text-lg text-muted md:text-xl">
                  不再需要繁琐的手动输入。只需说出你的想法，AI 就能理解并立即为你创建任务。支持语音输入，用最自然的方式安排一切。
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-muted">智能语音识别，精准理解意图</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-muted">自然对话式交互，无需学习成本</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-muted">即时任务创建，思维不被打断</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 3. "怎么用" Section - 使用图4和图5 */}
        <section id="how-it-works" className="w-full py-20 md:py-32 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            
            {/* AI 智能拆解 - 图4 */}
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center mb-20">
              <div className="flex flex-col justify-center space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    AI 智能拆解，告别拖延
                  </h2>
                </div>
                <p className="text-lg text-muted md:text-xl">
                  复杂的项目？让 AI 帮你分解成小步骤。每个子任务都清晰可行，让「开始」变得简单，让「完成」变得可能。
                </p>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-foreground">示例：准备面试</span>
                  </div>
                  <div className="space-y-2 text-sm text-muted ml-6">
                    <p>• 1. 准备一份整洁的简历</p>
                    <p>• 2. 调查公司背景信息</p>
                    <p>• 3. 准备常见面试问题答案</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image 
                  src="/4.jpg" 
                  alt="AI 智能拆解任务" 
                  width={300} 
                  height={600}
                  className="rounded-3xl shadow-xl"
                />
              </div>
            </div>

            {/* 专注模式 - 图5 */}
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
              <div className="order-2 lg:order-1 flex items-center justify-center">
                <Image 
                  src="/5.jpg" 
                  alt="沉浸式专注模式" 
                  width={300} 
                  height={600}
                  className="rounded-3xl shadow-xl"
                />
              </div>
              <div className="order-1 lg:order-2 flex flex-col justify-center space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    沉浸式专注模式
                  </h2>
                </div>
                <p className="text-lg text-muted md:text-xl">
                  屏蔽干扰，进入心流状态。专注计时器配合温和的提醒，帮你建立高效的工作节奏，每一分钟都有价值。
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <div className="text-2xl font-bold text-primary">25</div>
                    <div className="text-sm text-muted">分钟专注</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <div className="text-2xl font-bold text-green-500">5</div>
                    <div className="text-sm text-muted">分钟休息</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <div className="text-2xl font-bold text-blue-500">4</div>
                    <div className="text-sm text-muted">轮循环</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. "全局视图" Section - 使用图9 */}
        <section className="w-full py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  鸟瞰你的全局计划
                </h2>
              </div>
              <p className="text-lg text-muted md:text-xl max-w-3xl mx-auto">
                任务不再是孤立的点，而是在日历上清晰可见的时间线。直观地回顾过去，规划未来。AI 还能根据您一天的活动，为您生成一份专属的每日报告，提供深刻洞察。
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative">
                <Image 
                  src="/9.jpg" 
                  alt="日历全局视图" 
                  width={350} 
                  height={700}
                  className="rounded-3xl shadow-2xl"
                />
                {/* 特色标注 */}
                <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  AI 日报生成
                </div>
                <div className="absolute bottom-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  智能提醒
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. "超越任务" Section - 使用图6、7、8 */}
        <section className="w-full py-20 md:py-32 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">
                不止任务，更是您的生活操作系统
              </h2>
              <p className="text-lg text-muted md:text-xl">
                Dopamind 不仅帮你管理工作，更关注你的整个生活质量
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {/* 习惯养成 - 图6 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="mb-6">
                  <Image 
                    src="/6.jpg" 
                    alt="习惯养成功能" 
                    width={250} 
                    height={500}
                    className="rounded-xl mx-auto"
                  />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">习惯养成</h3>
                </div>
                <p className="text-muted">
                  用热力图见证复利的力量，建立积极的多巴胺循环。每一个小习惯都是通向更好自己的垫脚石。
                </p>
              </div>

              {/* 冰箱管理 - 图7 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="mb-6">
                  <Image 
                    src="/7.jpg" 
                    alt="智能冰箱管家" 
                    width={250} 
                    height={500}
                    className="rounded-xl mx-auto"
                  />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                    <span className="text-blue-600">🧊</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">智能冰箱管家</h3>
                </div>
                <p className="text-muted">
                  随手记录食材，智能提醒过期时间。告别「过期惊喜」，让健康饮食变得简单可控。
                </p>
              </div>

              {/* 订阅追踪 - 图8 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="mb-6">
                  <Image 
                    src="/8.jpg" 
                    alt="订阅管理功能" 
                    width={250} 
                    height={500}
                    className="rounded-xl mx-auto"
                  />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                    <span className="text-purple-600">💳</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">订阅追踪</h3>
                </div>
                <p className="text-muted">
                  轻松追踪所有订阅服务，告别意外扣费。掌控你的每一笔订阅，让财务管理变得透明简单。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. 云端同步功能 Section */}
        <section className="w-full py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">
                云端同步，随时随地
              </h2>
              <p className="text-lg text-muted md:text-xl max-w-2xl mx-auto">
                您的数据安全储存在云端，在所有设备间无缝同步，让您的生活管理不受设备限制。
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
              {/* 实时同步 */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all border border-gray-100">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mx-auto mb-6">
                  <RefreshCw className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4 text-center">实时同步</h3>
                <p className="text-muted text-center">
                  在手机上添加的任务，立即出现在平板和电脑上。跨设备协作，让您的计划始终保持最新状态。
                </p>
              </div>

              {/* 安全备份 */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all border border-gray-100">
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mx-auto mb-6">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4 text-center">安全备份</h3>
                <p className="text-muted text-center">
                  企业级加密保护您的隐私数据，自动备份防止意外丢失。您的信息安全是我们的首要任务。
                </p>
              </div>

              {/* 云端同步 */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all border border-gray-100">
                <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mx-auto mb-6">
                  <Cloud className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4 text-center">云端同步</h3>
                <p className="text-muted text-center">
                  在所有设备间无缝同步数据，永不丢失。无论您使用哪台设备，都能访问完整的任务和数据。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. 定价方案 Section */}
        <section className="w-full py-20 md:py-32 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">
                选择适合您的方案
              </h2>
              <p className="text-lg text-muted md:text-xl">
                解锁完整功能，开启高效生活方式
              </p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8 max-w-4xl mx-auto">
              {/* 月度计划 */}
              <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all">
                <h3 className="text-2xl font-bold text-foreground mb-2">Monthly</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">$14.99</span>
                  <span className="text-muted ml-2">USD / month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-muted">所有高级功能</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-muted">无限任务和项目</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-muted">云端同步备份</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-muted">AI 智能建议</span>
                  </li>
                </ul>
              </div>

              {/* 年度计划 */}
              <div className="flex-1 bg-white rounded-3xl p-8 shadow-lg border-2 border-primary hover:shadow-xl transition-all relative">
                {/* Most Popular 标签 */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                    Most Popular
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-2">Yearly</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-foreground">$159.99</span>
                  <span className="text-muted ml-2">USD / year</span>
                </div>
                <div className="mb-6">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    Save 12%
                  </span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-muted">所有高级功能</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-muted">无限任务和项目</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-muted">云端同步备份</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-muted">AI 智能建议</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-muted">优先客户支持</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 行动号召按钮 */}
            <div className="text-center mt-12">
              <button className="bg-primary hover:bg-primary-600 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 mb-4">
                立即订阅
              </button>
              <div>
                <a href="#" className="text-primary hover:text-primary-600 font-medium transition-colors">
                  恢复购买
                </a>
              </div>
              <p className="text-sm text-muted mt-4">7 天免费试用 • 随时取消</p>
            </div>
          </div>
        </section>

        {/* 8. 最终 CTA Section */}
        <section className="w-full py-20 md:py-32 bg-gradient-to-br from-primary/10 to-orange-100 relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-20 h-20 bg-primary/30 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-300/30 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-yellow-200/30 rounded-full blur-2xl"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center md:px-6 relative">
            <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl mb-6">
              准备好将混乱变为清晰了吗？
            </h2>
            <p className="text-xl text-muted mb-12 max-w-3xl mx-auto">
              立即下载 Dopamind，让 AI 成为你最懂你的伙伴。开启专注高效的全新生活方式。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <a href="#" className="hover:scale-105 transition-transform">
                <Image src="/download-app-store.svg" alt="Download on the App Store" width={180} height={60} />
              </a>
              <div className="text-center">
                <p className="text-sm text-muted">7 天免费试用 • 随时取消</p>
                <p className="text-xs text-muted mt-1">加入超过 10,000 名满意用户</p>
              </div>
            </div>

            {/* 社交证明 */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted">活跃用户</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted">用户满意度</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">4.9</div>
                <div className="text-sm text-muted">App Store 评分</div>
              </div>
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
                <li><a href={`/${locale}`} className="hover:text-primary">首页</a></li>
                <li><a href={`/${locale}#features`} className="hover:text-primary">功能特性</a></li>
                <li><a href={`/${locale}#how-it-works`} className="hover:text-primary">如何使用</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">支持</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href={`/${locale}/support`} className="hover:text-primary">帮助中心</a></li>
                <li><a href="mailto:support@dopamind.com" className="hover:text-primary">联系我们</a></li>
                <li><a href="#" className="hover:text-primary">状态页面</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">法律</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href={`/${locale}/privacy`} className="hover:text-primary">隐私政策</a></li>
                <li><a href="#" className="hover:text-primary">服务条款</a></li>
                <li><a href="#" className="hover:text-primary">Cookie 政策</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-muted">
            <p>&copy; {new Date().getFullYear()} Dopamind Inc. 版权所有.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}