import { redirect } from 'next/navigation';

export default function PricingPage() {
  // 重定向到默认语言的定价页面
  redirect('/zh/pricing');
}