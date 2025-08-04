"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ArrowLeft, CreditCard, HelpCircle } from 'lucide-react';

export default function PaymentCancelledPage() {
  useEffect(() => {
    // 可以在这里添加分析或日志
    console.log('User cancelled payment');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden py-12">
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-red-300/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-yellow-100/50 rounded-full blur-2xl"></div>
      </div>
      
      <div className="max-w-2xl w-full mx-auto px-4 relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image 
              src="/dopamind-logo.png"
              alt="Dopamind Logo" 
              width={48}
              height={48}
              className="rounded-xl"
            />
            <span className="text-2xl font-bold text-foreground">Dopamind</span>
          </Link>
        </div>

        <div className="max-w-lg mx-auto">
          {/* 取消图标 */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="w-12 h-12 text-orange-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-4">
              支付已取消
            </h1>
            
            <p className="text-lg text-muted mb-2">
              没关系，您可以随时重新开始
            </p>
            
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
              <span>未完成支付</span>
            </div>
          </div>

          {/* 说明信息 */}
          <div className="bg-white rounded-xl p-6 shadow-lg border mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">发生了什么？</h3>
            
            <div className="space-y-3 text-sm text-muted">
              <p>• 您的支付过程被中断或取消</p>
              <p>• 没有产生任何费用</p>
              <p>• 您的账户状态保持不变</p>
              <p>• 可以随时重新尝试购买</p>
            </div>
          </div>

          {/* 重新尝试的理由 */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              为什么选择 Premium？
            </h3>
            
            <div className="grid gap-3">
              {[
                '🧠 AI 对话式规划 - 像聊天一样安排生活',
                '🎯 沉浸式专注模式 - 告别拖延症',
                '📊 可视化成长报告 - 见证每天的进步',
                '☁️ 多设备云端同步 - 随时随地访问',
                '🎮 智能游戏化系统 - 让自律变得有趣'
              ].map((feature, index) => (
                <div key={index} className="text-sm text-foreground">
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* 行动按钮 */}
          <div className="flex flex-col gap-4">
            <Link
              href="/pricing"
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg"
            >
              <CreditCard className="w-4 h-4" />
              重新选择订阅计划
            </Link>
            
            <div className="flex gap-3">
              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-foreground font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                返回首页
              </Link>
              
              <Link
                href="/support"
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-foreground font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                联系客服
              </Link>
            </div>
          </div>

          {/* 特别优惠提示 */}
          <div className="text-center mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-sm text-yellow-800 font-medium mb-2">
              💡 小贴士
            </p>
            <p className="text-xs text-yellow-700">
              年度订阅可节省 2 个月费用，相当于 88 折优惠！
              <br />
              还能获得专属会员社群访问权限。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}