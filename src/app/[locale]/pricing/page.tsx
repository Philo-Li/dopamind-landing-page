import PricingSection from '../../../components/PricingSection';

interface PricingPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function PricingPage({ params }: PricingPageProps) {
  const { locale } = await params;

  return (
    <>
        <PricingSection locale={locale} />
        
        {/* FAQ 或其他内容可以在这里添加 */}
        <section className="w-full py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">
                常见问题
              </h2>
              <p className="text-lg text-muted md:text-xl">
                关于订阅和功能的常见问题解答
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-foreground mb-2">7天免费试用包含哪些功能？</h3>
                <p className="text-muted">免费试用期间，您可以使用所有Premium功能，包括AI智能建议、无限任务管理、专注模式、云端同步等。试用结束后，您可以选择继续订阅或使用免费版本。</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-foreground mb-2">可以随时取消订阅吗？</h3>
                <p className="text-muted">是的，您可以随时在设置中取消订阅。取消后，您仍可使用Premium功能直到当前计费周期结束，之后将自动转为免费版本。</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-foreground mb-2">年度订阅有什么优势？</h3>
                <p className="text-muted">年度订阅可以节省12%的费用，相当于获得两个月的免费使用。此外，年度订阅用户还享有优先客户支持服务。</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-foreground mb-2">支持哪些支付方式？</h3>
                <p className="text-muted">我们支持主要的信用卡和借记卡支付，包括Visa、MasterCard、American Express等。所有支付都通过Stripe安全处理。</p>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}