import Image from 'next/image';
import { CheckCircle, Calendar, Brain, Clock, TrendingUp, Cloud, RefreshCw, Shield } from 'lucide-react';
import { getTranslation } from '../../lib/i18n';
import { stats } from '../../config/stats';
import AppStoreButton from '../../components/AppStoreButton';
import AndroidDownloadLink from '../../components/AndroidDownloadLink';

interface HomePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const t = getTranslation(locale);
  
  // 根据语言选择图片路径
  const getImagePath = (imageNumber: number) => {
    if (locale === 'en') {
      return `/screenshots/${imageNumber}_iOS_en.jpg`;
    } else if (locale === 'zh') {
      return `/screenshots/${imageNumber}_iOS_zh.jpg`;
    }
    // 日语版本使用中文截图作为后备
    return `/screenshots/${imageNumber}_iOS_zh.jpg`;
  };

  // SEO优化的多语言alt标签
  const getImageAlt = (key: string) => {
    const altTexts = {
      en: {
        mainInterface: "Dopamind AI-powered focus companion main interface for ADHD users",
        taskManagement: "Intelligent task management system for ADHD productivity",
        voiceInput: "Voice input feature for hands-free task creation",
        aiTaskBreakdown: "AI-powered task breakdown and organization tool",
        focusMode: "Immersive focus mode for deep work sessions",
        calendarView: "Calendar global view with task scheduling",
        habitTracking: "Habit formation and tracking functionality",
        smartReminder: "Smart reminder system for ADHD management",
        subscriptionManagement: "Subscription and account management interface",
        logo: "Dopamind - AI-powered focus companion for ADHD users"
      },
      zh: {
        mainInterface: "Dopamind AI 智能专注伙伴主界面 - 专为 ADHD 用户设计",
        taskManagement: "智能任务管理系统 - 提升 ADHD 生产力",
        voiceInput: "语音输入功能 - 免手动创建任务",
        aiTaskBreakdown: "AI 智能任务拆解和组织工具",
        focusMode: "沉浸式专注模式 - 深度工作会话",
        calendarView: "日历全局视图 - 任务调度管理",
        habitTracking: "习惯养成和跟踪功能",
        smartReminder: "智能提醒系统 - ADHD 管理工具",
        subscriptionManagement: "订阅和账户管理界面",
        logo: "Dopamind - 专为 ADHD 用户设计的 AI 专注伙伴"
      },
      ja: {
        mainInterface: "Dopamind AI集中力コンパニオンメインインターフェース - ADHDユーザー向け",
        taskManagement: "インテリジェントタスク管理システム - ADHD生産性向上",
        voiceInput: "音声入力機能 - ハンズフリータスク作成",
        aiTaskBreakdown: "AI搭載タスク分解・整理ツール",
        focusMode: "没入型集中モード - 深い作業セッション",
        calendarView: "カレンダーグローバルビュー - タスクスケジューリング",
        habitTracking: "習慣形成・追跡機能",
        smartReminder: "スマートリマインダーシステム - ADHD管理",
        subscriptionManagement: "サブスクリプション・アカウント管理インターフェース",
        logo: "Dopamind - ADHDユーザー向けAI集中力コンパニオン"
      }
    };
    
    const currentTexts = altTexts[locale as keyof typeof altTexts] || altTexts.en;
    return currentTexts[key as keyof typeof currentTexts] || currentTexts.logo;
  };

  return (
    <>
        {/* 1. Hero Section - 使用图1 */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 items-center">
              {/* 左侧文案 */}
              <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary w-fit">
                  {t.home.hero.badge}
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  {t.home.hero.title}<br />
                  <span className="text-primary">{t.home.hero.titleHighlight}</span>
                </h1>
                <p className="text-lg text-muted md:text-xl max-w-2xl">
                  {t.home.hero.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <AppStoreButton size="small" locale={locale} />
                    <AndroidDownloadLink size="small" locale={locale} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-sm text-muted">{t.home.hero.downloadText}</p>
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
                        src={getImagePath(1)} 
                        alt={getImageAlt('mainInterface')}
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
                  {t.home.features.section1.title}
                </h2>
                <p className="text-lg text-muted md:text-xl">
                  {t.home.features.section1.subtitle}
                </p>
                <ul className="space-y-3">
                  {t.home.features.section1.points.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-muted">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <Image 
                  src={getImagePath(2)} 
                  alt={getImageAlt('taskManagement')}
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
                  src={getImagePath(3)} 
                  alt={getImageAlt('voiceInput')}
                  width={300} 
                  height={600}
                  className="rounded-3xl shadow-xl"
                />
              </div>
              <div className="order-1 lg:order-2 flex flex-col justify-center space-y-6">
                <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  {t.home.features.section2.title}
                </h2>
                <p className="text-lg text-muted md:text-xl">
                  {t.home.features.section2.subtitle}
                </p>
                <ul className="space-y-3">
                  {t.home.features.section2.points.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-muted">{point}</span>
                    </li>
                  ))}
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
                    {t.home.howItWorks.section1.title}
                  </h2>
                </div>
                <p className="text-lg text-muted md:text-xl">
                  {t.home.howItWorks.section1.subtitle}
                </p>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-foreground">{t.home.howItWorks.section1.example.title}</span>
                  </div>
                  <div className="space-y-2 text-sm text-muted ml-6">
                    {t.home.howItWorks.section1.example.steps.map((step, index) => (
                      <p key={index}>• {step}</p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image 
                  src={getImagePath(4)} 
                  alt={getImageAlt('aiTaskBreakdown')}
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
                  src={getImagePath(5)} 
                  alt={getImageAlt('focusMode')}
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
                    {t.home.howItWorks.section2.title}
                  </h2>
                </div>
                <p className="text-lg text-muted md:text-xl">
                  {t.home.howItWorks.section2.subtitle}
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {t.home.howItWorks.section2.stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 text-center shadow-sm">
                      <div className={`text-2xl font-bold ${
                        index === 0 ? 'text-primary' : 
                        index === 1 ? 'text-green-500' : 'text-blue-500'
                      }`}>{stat.value}</div>
                      <div className="text-sm text-muted">{stat.label}</div>
                    </div>
                  ))}
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
                  {t.home.globalView.title}
                </h2>
              </div>
              <p className="text-lg text-muted md:text-xl max-w-3xl mx-auto">
                {t.home.globalView.subtitle}
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative">
                <Image 
                  src={getImagePath(9)} 
                  alt={getImageAlt('calendarView')}
                  width={350} 
                  height={700}
                  className="rounded-3xl shadow-2xl"
                />
                {/* 特色标注 */}
                <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  {t.home.globalView.badges[0]}
                </div>
                <div className="absolute bottom-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {t.home.globalView.badges[1]}
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
                {t.home.beyondTasks.title}
              </h2>
              <p className="text-lg text-muted md:text-xl">
                {t.home.beyondTasks.subtitle}
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {/* 习惯养成 - 图6 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="mb-6">
                  <Image 
                    src={getImagePath(6)} 
                    alt={getImageAlt('habitTracking')}
                    width={250} 
                    height={500}
                    className="rounded-xl mx-auto"
                  />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{t.home.beyondTasks.features[0].title}</h3>
                </div>
                <p className="text-muted">
                  {t.home.beyondTasks.features[0].description}
                </p>
              </div>

              {/* 冰箱管理 - 图7 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="mb-6">
                  <Image 
                    src={getImagePath(7)} 
                    alt={getImageAlt('smartReminder')}
                    width={250} 
                    height={500}
                    className="rounded-xl mx-auto"
                  />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                    <span className="text-blue-600">🧊</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{t.home.beyondTasks.features[1].title}</h3>
                </div>
                <p className="text-muted">
                  {t.home.beyondTasks.features[1].description}
                </p>
              </div>

              {/* 订阅追踪 - 图8 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="mb-6">
                  <Image 
                    src={getImagePath(8)} 
                    alt={getImageAlt('subscriptionManagement')}
                    width={250} 
                    height={500}
                    className="rounded-xl mx-auto"
                  />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                    <span className="text-purple-600">💳</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{t.home.beyondTasks.features[2].title}</h3>
                </div>
                <p className="text-muted">
                  {t.home.beyondTasks.features[2].description}
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
                {t.home.cloudSync.title}
              </h2>
              <p className="text-lg text-muted md:text-xl max-w-2xl mx-auto">
                {t.home.cloudSync.subtitle}
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
              {/* 实时同步 */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all border border-gray-100">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mx-auto mb-6">
                  <RefreshCw className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4 text-center">{t.home.cloudSync.features[0].title}</h3>
                <p className="text-muted text-center">
                  {t.home.cloudSync.features[0].description}
                </p>
              </div>

              {/* 安全备份 */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all border border-gray-100">
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mx-auto mb-6">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4 text-center">{t.home.cloudSync.features[1].title}</h3>
                <p className="text-muted text-center">
                  {t.home.cloudSync.features[1].description}
                </p>
              </div>

              {/* 云端同步 */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all border border-gray-100">
                <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mx-auto mb-6">
                  <Cloud className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4 text-center">{t.home.cloudSync.features[2].title}</h3>
                <p className="text-muted text-center">
                  {t.home.cloudSync.features[2].description}
                </p>
              </div>
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
              {t.home.finalCta.title}
            </h2>
            <p className="text-xl text-muted mb-12 max-w-3xl mx-auto">
              {t.home.finalCta.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <AppStoreButton size="large" locale={locale} />
                <AndroidDownloadLink size="large" locale={locale} />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted">{t.home.finalCta.trial}</p>
                <p className="text-xs text-muted mt-1">{t.home.finalCta.users.replace('{count}', stats.finalCta.find(s => s.labelKey === 'stats.activeUsers')?.value || '500+')}</p>
              </div>
            </div>

            {/* 服务条款和隐私政策链接 */}
            <div className="mb-8 text-center">
              <p className="text-sm text-muted">
                {t.home.finalCta.termsAndPrivacy.split('{terms}')[0]}
                <a href={`/${locale}/terms`} className="text-primary hover:underline mx-1">{t.home.finalCta.termsLink}</a>
                {t.home.finalCta.termsAndPrivacy.split('{terms}')[1].split('{privacy}')[0]}
                <a href={`/${locale}/privacy`} className="text-primary hover:underline mx-1">{t.home.finalCta.privacyLink}</a>
                {t.home.finalCta.termsAndPrivacy.split('{privacy}')[1]}
              </p>
            </div>

            {/* 社交证明 */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              {stats.finalCta.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted">
                    {t.stats && stat.labelKey.includes('.') 
                      ? t.stats[stat.labelKey.split('.')[1] as keyof typeof t.stats]
                      : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
    </>
  );
}