import { redirect } from 'next/navigation';
import { defaultLocale } from '../../lib/i18n';

export default function SupportPage() {
  // 重定向到默认语言的支持页面
  redirect(`/${defaultLocale}/support`);
}