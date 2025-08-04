import { redirect } from 'next/navigation';
import { defaultLocale } from '../lib/i18n';

export default function HomePage() {
  // 重定向到默认语言页面
  redirect(`/${defaultLocale}`);
}