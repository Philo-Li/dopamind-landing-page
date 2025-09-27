import AppLayout from '@/components/AppLayout'
import { cookies } from 'next/headers'

export default async function FocusPage() {
  const cookieStore = await cookies()
  const collapsedCookie = cookieStore.get('sidebar-collapsed')
  const initialSidebarCollapsed = collapsedCookie ? collapsedCookie.value === '1' : false

  return <AppLayout initialSidebarCollapsed={initialSidebarCollapsed} />
}

