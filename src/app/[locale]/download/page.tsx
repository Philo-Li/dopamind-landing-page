import { CheckCircle, AlertTriangle } from 'lucide-react';
import { getLandingTranslation } from '@/lib/i18n';
import { getChangelog } from '../../../lib/changelog';
import AndroidDownloadButton from '../../../components/AndroidDownloadButton';
import AppStoreButton from '../../../components/AppStoreButton';

// 格式化 changelog 内容为 HTML
function formatChangelogContent(content: string): string {
  if (!content) return '';
  
  const lines = content.split('\n');
  const formattedLines: string[] = [];
  let inList = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // 跳过版本标题行
    if (trimmedLine.startsWith('##') || trimmedLine.startsWith('###') || trimmedLine === '---') {
      continue;
    }
    
    // 处理粗体段落标题 (e.g., **【New Features & Major Improvements】**)
    if (trimmedLine.match(/^\*\*【.+】\*\*$/) || trimmedLine.match(/^\*\*[^*]+:\*\*$/)) {
      if (inList) {
        formattedLines.push('</ul>');
        inList = false;
      }
      const text = trimmedLine.replace(/^\*\*(.+)\*\*$/, '$1');
      formattedLines.push(`<h4 class="font-semibold text-foreground mt-4 mb-2">${text}</h4>`);
      continue;
    }
    
    // 处理主要功能点 (• **🚀 Complete Focus Mode Overhaul:**)
    if (trimmedLine.match(/^• \*\*[^:]+:\*\*/)) {
      if (!inList) {
        formattedLines.push('<ul class="space-y-3">');
        inList = true;
      }
      const match = trimmedLine.match(/^• \*\*([^:]+):\*\*(.*)/);
      if (match) {
        const title = match[1];
        const description = match[2].trim();
        // 处理描述中的markdown粗体语法
        const processedDescription = description ? ' ' + description.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') : '';
        formattedLines.push(`<li class="text-sm"><strong class="text-foreground">${title}:</strong>${processedDescription}</li>`);
      }
      continue;
    }
    
    // 处理子功能点 (  - **New Stopwatch Mode**: description)
    if (trimmedLine.match(/^\s*-\s+\*\*[^:]+\*\*:/)) {
      if (!inList) {
        formattedLines.push('<ul class="space-y-2 ml-4">');
        inList = true;
      }
      const match = trimmedLine.match(/^\s*-\s+\*\*([^:]+)\*\*:\s*(.*)/);
      if (match) {
        const title = match[1];
        const description = match[2];
        // 处理描述中的markdown粗体语法
        const processedDescription = description.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        formattedLines.push(`<li class="text-sm"><strong class="text-primary">${title}</strong>: ${processedDescription}</li>`);
      }
      continue;
    }
    
    // 处理简单的子点 (  - description)
    if (trimmedLine.match(/^\s*-\s+/)) {
      if (!inList) {
        formattedLines.push('<ul class="space-y-1 ml-4">');
        inList = true;
      }
      const description = trimmedLine.replace(/^\s*-\s+/, '');
      // 处理描述中的markdown粗体语法
      const processedDescription = description.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      formattedLines.push(`<li class="text-sm text-muted-foreground">${processedDescription}</li>`);
      continue;
    }
    
    // 处理简单的功能点 (• description)
    if (trimmedLine.startsWith('• ')) {
      if (!inList) {
        formattedLines.push('<ul class="space-y-2">');
        inList = true;
      }
      const description = trimmedLine.substring(2);
      // 处理描述中的markdown粗体语法
      const processedDescription = description.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      formattedLines.push(`<li class="text-sm">${processedDescription}</li>`);
      continue;
    }
    
    // 处理普通段落
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      if (inList) {
        formattedLines.push('</ul>');
        inList = false;
      }
      // 处理段落中的markdown粗体语法
      const processedLine = trimmedLine.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      formattedLines.push(`<p class="text-sm text-muted-foreground mb-2">${processedLine}</p>`);
    }
  }
  
  // 确保最后的列表被关闭
  if (inList) {
    formattedLines.push('</ul>');
  }
  
  return formattedLines.join('\n');
}

interface DownloadPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function DownloadPage({ params }: DownloadPageProps) {
  const { locale } = await params;
  const t = getLandingTranslation(locale);
  const changelog = getChangelog(locale);
  
  // 应用信息
  const appInfo = {
    version: '1.7.1',
    lastUpdated: '2025-09-30',
    ios: {
      size: '29.2 MB'
    },
    android: {
      size: '92 MB',
      downloadUrl: 'https://r2.dopamind.app/dopamind-android-release-1.7.1.apk'
    }
  };

  return (
    <>
        {/* Hero Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary w-fit mb-6">
                {t.download.hero.badge}
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6">
                {t.download.hero.title}
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl max-w-3xl mx-auto">
                {t.download.hero.description}
              </p>
            </div>

            {/* 下载选项 */}
            <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
              {/* iOS 下载 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">{t.download.platforms.ios.title}</h2>
                  <p className="text-muted-foreground mb-4">{t.download.platforms.ios.description}</p>

                  {/* iOS 应用信息 */}
                  <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
                    <div>
                      <div className="text-muted-foreground">{t.download.hero.version}</div>
                      <div className="font-semibold">{appInfo.version}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">{t.download.hero.size}</div>
                      <div className="font-semibold">{appInfo.ios.size}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">{t.download.hero.lastUpdated}</div>
                      <div className="font-semibold">{appInfo.lastUpdated}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <AppStoreButton size="large" locale={locale} />
                </div>
              </div>

              {/* Android 下载 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993.9993.4482.9993.9993c0 .5511-.4482.9997-.9993.9997zm-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993.9993.4482.9993.9993c0 .5511-.4482.9997-.9993.9997zm11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8452 7.8508 12 7.8508s-3.5902.3931-5.1333 1.0329L4.8442 5.3819a.4161.4161 0 00-.5676-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6456 0 18.761h24c-.3435-4.1154-2.6892-7.5743-6.1185-9.4396z"/>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">{t.download.platforms.android.title}</h2>
                  <p className="text-muted-foreground mb-4">{t.download.platforms.android.description}</p>

                  {/* APK 信息 */}
                  <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
                    <div>
                      <div className="text-muted-foreground">{t.download.hero.version}</div>
                      <div className="font-semibold">{appInfo.version}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">{t.download.hero.size}</div>
                      <div className="font-semibold">{appInfo.android.size}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">{t.download.hero.lastUpdated}</div>
                      <div className="font-semibold">{appInfo.lastUpdated}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <AndroidDownloadButton 
                    size="large" 
                    downloadUrl={appInfo.android.downloadUrl}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Changelog Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">
                {changelog.title}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {changelog.description}
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-8">
              {changelog.versions.map((version, index) => (
                <div key={version.version} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
                      <span className="text-2xl">{version.emoji}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-foreground">
                          {version.version} ({version.date})
                        </h3>
                        {index === 0 && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
                            Latest
                          </span>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-foreground mb-2">
                          {version.title}
                        </h4>
                      </div>

                      <div className="space-y-4">
                        <div
                          className="prose prose-sm max-w-none text-muted-foreground"
                          dangerouslySetInnerHTML={{
                            __html: formatChangelogContent(version.content)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 系统要求 Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
              <div className="flex flex-col justify-center space-y-6">
                <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  {t.download.requirements.title}
                </h2>
                <ul className="space-y-4">
                  {t.download.requirements.items.map((requirement: any, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                      <span className="text-muted-foreground">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* 安全保障卡片 */}
              <div className="grid gap-4">
                {t.download.security.items.map((item: any, index: number) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="text-2xl">{item.icon}</div>
                      <div>
                        <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 安装步骤 Section */}
        <section className="w-full py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">
                {t.download.installation.title}
              </h2>
              
              {/* 安全警告 */}
              <div className="max-w-3xl mx-auto bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <p className="text-sm text-orange-700">{t.download.installation.warning}</p>
                </div>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid gap-8 md:grid-cols-2">
                {t.download.installation.steps.map((step: any, index: number) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full font-bold text-green-600">
                        {step.number}
                      </div>
                      <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {t.download.faq.title}
              </h2>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
              {t.download.faq.items.map((faq: any, index: number) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-foreground mb-3 text-lg">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </>
  );
}



