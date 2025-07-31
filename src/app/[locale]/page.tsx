import Image from 'next/image';
import { CheckCircle, Calendar, Brain, Clock, TrendingUp, Cloud, RefreshCw, Shield } from 'lucide-react';
import { getTranslation } from '../../lib/i18n';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import AuthButton from '../../../components/AuthButton';
import PricingSection from '../../components/PricingSection';

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
            <a href={`/${locale}#features`} className="text-sm font-medium text-muted transition-colors hover:text-primary">{t.navigation.features}</a>
            <a href={`/${locale}#how-it-works`} className="text-sm font-medium text-muted transition-colors hover:text-primary">{t.navigation.howItWorks}</a>
            <a href={`/${locale}#pricing`} className="text-sm font-medium text-muted transition-colors hover:text-primary">{t.navigation.pricing}</a>
            <a href={`/${locale}/support`} className="text-sm font-medium text-muted transition-colors hover:text-primary">{t.navigation.support}</a>
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
                  <a href="#" className="hover:scale-105 transition-transform">
                    <Image src="/download-app-store.svg" alt="Download on the App Store" width={160} height={54} />
                  </a>
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
                  src="/9.jpg" 
                  alt="日历全局视图" 
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

        {/* 7. 定价方案 Section */}
        <PricingSection locale={locale} />

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
              <a href="#" className="hover:scale-105 transition-transform">
                <Image src="/download-app-store.svg" alt="Download on the App Store" width={180} height={60} />
              </a>
              <div className="text-center">
                <p className="text-sm text-muted">{t.home.finalCta.trial}</p>
                <p className="text-xs text-muted mt-1">{t.home.finalCta.users}</p>
              </div>
            </div>

            {/* 社交证明 */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              {t.home.finalCta.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted">{stat.label}</div>
                </div>
              ))}
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
                {t.footer.description}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">{t.footer.sections.product}</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href={`/${locale}`} className="hover:text-primary">{t.navigation.home}</a></li>
                <li><a href={`/${locale}#features`} className="hover:text-primary">{t.footer.links.features}</a></li>
                <li><a href={`/${locale}#how-it-works`} className="hover:text-primary">{t.navigation.howItWorks}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">{t.footer.sections.support}</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href={`/${locale}/support`} className="hover:text-primary">{t.footer.links.supportCenter}</a></li>
                <li><a href="mailto:support@dopamind.com" className="hover:text-primary">{t.footer.links.contactUs}</a></li>
                <li><a href="#" className="hover:text-primary">{t.footer.links.status}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">{t.footer.sections.legal}</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href={`/${locale}/privacy`} className="hover:text-primary">{t.footer.links.privacy}</a></li>
                <li><a href="#" className="hover:text-primary">{t.footer.links.terms}</a></li>
                <li><a href="#" className="hover:text-primary">{t.footer.links.cookies}</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-muted">
            <p>&copy; {new Date().getFullYear()} Dopamind Inc. {t.footer.copyright}.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}