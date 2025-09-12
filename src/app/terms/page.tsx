'use client';

import { FileText, Shield, Users, AlertTriangle, Calendar, Mail } from 'lucide-react';
import { getTranslation } from '../../lib/i18n';

// Use English as default locale
const t = getTranslation('en');

export default function TermsPage() {
  return (
    <>
        {/* 页面标题 */}
        <section className="w-full py-16 md:py-20">
          <div className="container mx-auto px-4 text-center md:px-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              <FileText className="h-12 w-12 text-primary" />
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
                {t.terms.title}
              </h1>
            </div>
            <p className="text-lg text-muted md:text-xl max-w-3xl mx-auto">
              {t.terms.subtitle}
            </p>
            <p className="text-sm text-muted mt-4">
              {t.terms.lastUpdated}: {new Date().toLocaleDateString('en-US')}
            </p>
          </div>
        </section>

        {/* 服务条款内容 */}
        <section className="w-full py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto prose prose-lg">
              
              {/* 1. 服务条款的接受 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">1. {t.terms.sections.acceptance.title}</h2>
                </div>
                <div className="space-y-4 text-muted leading-relaxed">
                  <p>{t.terms.sections.acceptance.content}</p>
                </div>
              </div>

              {/* 2. 服务描述 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">2. {t.terms.sections.serviceDescription.title}</h2>
                </div>
                <div className="space-y-4 text-muted leading-relaxed">
                  <p>{t.terms.sections.serviceDescription.content}</p>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">{t.terms.sections.serviceDescription.features.title}</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      {t.terms.sections.serviceDescription.features.items.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 3. 用户责任 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">3. {t.terms.sections.userResponsibilities.title}</h2>
                </div>
                <div className="space-y-4 text-muted leading-relaxed">
                  <p>{t.terms.sections.userResponsibilities.content}</p>
                  <div className="space-y-4">
                    {t.terms.sections.userResponsibilities.items.map((item: {title: string, description: string}, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                        <p className="text-sm">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. 禁止行为 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">4. {t.terms.sections.prohibitedUses.title}</h2>
                </div>
                <div className="space-y-4 text-muted leading-relaxed">
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                    <p className="font-semibold text-red-800 mb-2">Important Notice</p>
                    <p className="text-red-700">{t.terms.sections.prohibitedUses.content}</p>
                  </div>
                  <ul className="space-y-2 list-disc list-inside">
                    {t.terms.sections.prohibitedUses.items.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 5. 知识产权 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">5. {t.terms.sections.intellectualProperty.title}</h2>
                </div>
                <div className="space-y-4 text-muted leading-relaxed">
                  <p>{t.terms.sections.intellectualProperty.content}</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">User Content Rights</h4>
                    <p className="text-blue-700">{t.terms.sections.intellectualProperty.content}</p>
                  </div>
                </div>
              </div>

              {/* 6. 付费服务 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">6. {t.terms.sections.paidServices.title}</h2>
                </div>
                <div className="space-y-4 text-muted leading-relaxed">
                  <div className="grid gap-4 md:grid-cols-2">
                    {t.terms.sections.paidServices.items.map((item: {title: string, description: string}, index: number) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                        <p className="text-sm">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 7. 免责声明 */}
              <div className="mb-12">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                    <h2 className="text-2xl font-bold text-foreground">7. {t.terms.sections.disclaimer.title}</h2>
                  </div>
                  <div className="space-y-4 text-muted leading-relaxed">
                    <p>{t.terms.sections.disclaimer.content}</p>
                  </div>
                </div>
              </div>

              {/* 8. 服务变更和终止 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">8. {t.terms.sections.serviceChanges.title}</h2>
                </div>
                <div className="space-y-4 text-muted leading-relaxed">
                  <p>{t.terms.sections.serviceChanges.content}</p>
                  <div className="space-y-2">
                  </div>
                </div>
              </div>

              {/* 9. 适用法律 */}
              <div className="mb-12">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">9. {t.terms.sections.governingLaw.title}</h2>
                  <p className="text-muted">{t.terms.sections.governingLaw.content}</p>
                </div>
              </div>

              {/* 10. 联系我们 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">10. {t.terms.sections.contact.title}</h2>
                </div>
                <div className="bg-gray-900 text-white rounded-lg p-6">
                  <div className="space-y-2">
                    <p><strong>Email: </strong> {t.terms.sections.contact.support}</p>
                  </div>
                  <p className="mt-4 text-sm text-gray-300">
                    {t.terms.sections.contact.responseTime}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>
    </>
  );
}