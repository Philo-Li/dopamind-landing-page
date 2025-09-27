import FridgeForm from '@/components/fridge/FridgeForm'
import { cookies } from 'next/headers'

export default async function FridgeFormPage() {
  const cookieStore = await cookies()
  const collapsedCookie = cookieStore.get('sidebar-collapsed')
  const initialSidebarCollapsed = collapsedCookie ? collapsedCookie.value === '1' : false

  return <FridgeForm initialSidebarCollapsed={initialSidebarCollapsed} />
}
