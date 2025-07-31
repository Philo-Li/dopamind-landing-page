import Image from 'next/image';
import { Shield, Lock, Eye, Users, Calendar, Mail } from 'lucide-react';
import AuthButton from '../../../components/AuthButton';

export default function PrivacyPage() {
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
            <a href="/support" className="text-sm font-medium text-muted transition-colors hover:text-primary">帮助中心</a>
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
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="h-12 w-12 text-primary" />
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
                隐私政策
              </h1>
            </div>
            <p className="text-lg text-muted md:text-xl max-w-3xl mx-auto">
              您的隐私对我们至关重要。本政策详细说明我们如何收集、使用和保护您的个人信息。
            </p>
            <p className="text-sm text-muted mt-4">
              最后更新时间：{new Date().getFullYear()}年{new Date().getMonth() + 1}月{new Date().getDate()}日
            </p>
          </div>
        </section>

        {/* 隐私政策内容 */}
        <section className="w-full py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto prose prose-lg">
              
              {/* 1. 引言 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Eye className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">1. 引言</h2>
                </div>
                <div className="space-y-4 text-muted leading-relaxed">
                  <p>
                    欢迎使用 Dopamind！我们致力于为您提供一个安全、可靠的 AI 伙伴，帮助您管理任务、提升专注力。本隐私政策旨在向您说明，当您使用我们的服务时，我们如何收集、使用、保护和处理您的个人信息。
                  </p>
                  <p>
                    您的隐私对我们至关重要，我们承诺以负责任的态度对待您的数据。我们遵循隐私设计原则，仅收集为您提供优质服务所必需的信息，并采用行业领先的安全措施保护您的数据。
                  </p>
                  <div className="bg-blue-50 border-l-4 border-primary p-4 rounded-r-lg mt-6">
                    <p className="text-sm font-medium text-primary mb-2">英文版 (English Version)</p>
                    <p className="text-sm text-muted">
                      Welcome to Dopamind! We are committed to providing you with a secure and reliable AI companion to help you manage tasks and enhance focus. This Privacy Policy explains how we collect, use, protect, and handle your personal information when you use our services. Your privacy is critically important to us, and we are committed to being transparent about how we treat your data.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. 我们收集的信息 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">2. 我们收集的信息</h2>
                </div>
                <div className="space-y-6 text-muted leading-relaxed">
                  <p>为了提供和改进服务，我们会收集以下类型的信息：</p>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">您直接提供的信息</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      <li><strong>账户信息</strong>：昵称、电子邮件地址和加密后的密码</li>
                      <li><strong>任务和习惯数据</strong>：您创建的任务、设定的习惯、完成记录等</li>
                      <li><strong>AI 对话记录</strong>：您与 Dopamind AI 的对话历史，用于提供个性化建议</li>
                      <li><strong>偏好设置</strong>：应用设置、通知偏好、主题选择等</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">自动收集的信息</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      <li><strong>使用数据</strong>：应用使用时长、功能使用频率等（已匿名化）</li>
                      <li><strong>设备信息</strong>：设备型号、操作系统版本、应用版本号</li>
                      <li><strong>技术数据</strong>：IP 地址、设备标识符（仅用于技术支持）</li>
                    </ul>
                  </div>

                  <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                    <p className="text-sm font-medium text-yellow-800 mb-2">重要说明</p>
                    <p className="text-sm text-yellow-700">
                      订阅和支付信息由 Apple App Store 或 Google Play Store 直接处理。我们<strong>不会</strong>收集或存储您的信用卡号等完整的支付信息。我们只会从应用商店接收到关于您订阅状态的确认信息。
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. 我们如何使用您的信息 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">3. 我们如何使用您的信息</h2>
                </div>
                <div className="space-y-4 text-muted leading-relaxed">
                  <p>我们使用收集到的信息来：</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-foreground mb-2">提供和维护服务</h4>
                      <p className="text-sm">创建和管理您的账户，同步您的数据，并让您能够使用 App 的所有功能</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-foreground mb-2">个性化您的体验</h4>
                      <p className="text-sm">AI 利用您的任务和对话历史提供更相关、更个性化的建议和鼓励</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-foreground mb-2">改进我们的产品</h4>
                      <p className="text-sm">通过分析匿名使用数据，了解功能使用情况，优化产品设计</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-foreground mb-2">与您沟通</h4>
                      <p className="text-sm">发送重要服务通知、更新信息，或在您联系我们时提供支持</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. 我们如何分享您的信息 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">4. 我们如何分享您的信息</h2>
                </div>
                <div className="space-y-4 text-muted leading-relaxed">
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                    <p className="font-semibold text-green-800 mb-2">我们的承诺</p>
                    <p className="text-green-700">
                      我们<strong>不会</strong>出售、租赁或以其他方式向第三方披露您的个人信息，除以下情况外：
                    </p>
                  </div>
                  <ul className="space-y-3 list-disc list-inside">
                    <li><strong>服务提供商</strong>：我们可能与可信的第三方服务提供商共享必要信息，如云存储、数据分析服务，但他们只能在我们的指示下使用这些信息</li>
                    <li><strong>法律要求</strong>：在法律要求或为保护我们的权利、财产或安全时，我们可能会披露信息</li>
                    <li><strong>业务转让</strong>：在合并、收购或资产出售的情况下，您的信息可能会作为业务资产的一部分被转让</li>
                  </ul>
                </div>
              </div>

              {/* 5. 数据安全 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">5. 数据安全</h2>
                </div>
                <div className="space-y-4 text-muted leading-relaxed">
                  <p>我们采用行业标准的安全措施来保护您的个人信息：</p>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h4 className="font-semibold text-foreground mb-1">数据加密</h4>
                      <p className="text-sm">传输和存储过程中的端到端加密</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h4 className="font-semibold text-foreground mb-1">访问控制</h4>
                      <p className="text-sm">严格的员工访问权限和审计制度</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Eye className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h4 className="font-semibold text-foreground mb-1">安全监控</h4>
                      <p className="text-sm">24/7 安全监控和威胁检测</p>
                    </div>
                  </div>
                  <p>
                    尽管我们采取了合理的预防措施，但请注意，通过互联网传输的数据无法保证 100% 安全。我们会持续改进安全措施，并在发现任何安全事件时立即通知用户。
                  </p>
                </div>
              </div>

              {/* 6. 您的权利与选择 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">6. 您的权利与选择</h2>
                </div>
                <div className="space-y-4 text-muted leading-relaxed">
                  <p>您对您的数据拥有以下权利：</p>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-foreground mb-2">📋 访问与更新</h4>
                      <p className="text-sm">您可以随时在 App 的「账户信息」页面查看和修改您的昵称、邮箱和头像</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-foreground mb-2">📤 数据导出</h4>
                      <p className="text-sm">您可以联系我们，请求导出您的个人数据副本</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-foreground mb-2">🗑️ 账户删除</h4>
                      <p className="text-sm">您可以在 App 的「账户信息」页面选择永久删除您的账户。此操作将删除您的所有个人数据，且无法恢复</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-foreground mb-2">🔔 推送通知</h4>
                      <p className="text-sm">您可以随时在设备的系统设置中开启或关闭 Dopamind 的推送通知权限</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 7. 儿童隐私 */}
              <div className="mb-12">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">7. 儿童隐私</h2>
                  <p className="text-muted">
                    我们的服务不面向 13 岁以下的儿童。我们不会有意收集 13 岁以下儿童的个人身份信息。如果我们发现无意中收集了此类信息，我们将立即采取措施将其删除。如果您是家长或监护人，并且您知道您的孩子向我们提供了个人信息，请联系我们。
                  </p>
                </div>
              </div>

              {/* 8. 政策变更 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">8. 政策变更</h2>
                </div>
                <div className="space-y-4 text-muted leading-relaxed">
                  <p>
                    我们可能会不时更新本隐私政策。如果我们做出重大变更，我们将通过以下方式通知您：
                  </p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>在 App 内显示通知</li>
                    <li>向您的注册邮箱发送邮件</li>
                    <li>在本网站上发布更新通知</li>
                  </ul>
                  <p>
                    我们建议您定期查看本页面以了解任何变更。在更新的政策生效后，您继续使用我们的服务即表示您接受修订后的隐私政策。
                  </p>
                </div>
              </div>

              {/* 9. 联系我们 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">9. 联系我们</h2>
                </div>
                <div className="bg-gray-900 text-white rounded-lg p-6">
                  <p className="mb-4">如果您对本隐私政策有任何疑问或疑虑，请随时联系我们：</p>
                  <div className="space-y-2">
                    <p><strong>邮箱：</strong> privacy@dopamind.com</p>
                    <p><strong>支持邮箱：</strong> support@dopamind.com</p>
                  </div>
                  <p className="mt-4 text-sm text-gray-300">
                    我们会在收到您的询问后 48 小时内回复。
                  </p>
                </div>
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