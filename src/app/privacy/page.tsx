import { redirect } from 'next/navigation';
import { defaultLocale } from '../../lib/i18n';

export default function PrivacyPage() {
  // 重定向到默认语言的隐私页面
  redirect(`/${defaultLocale}/privacy`);
}