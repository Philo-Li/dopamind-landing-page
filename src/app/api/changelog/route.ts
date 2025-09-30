import { NextRequest, NextResponse } from 'next/server'
import { getChangelog } from '@/lib/changelog'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const locale = searchParams.get('locale') || 'en'

    const changelogData = getChangelog(locale)

    return NextResponse.json(changelogData)
  } catch (error) {
    console.error('Error fetching changelog:', error)
    return NextResponse.json(
      { error: 'Failed to fetch changelog' },
      { status: 500 }
    )
  }
}