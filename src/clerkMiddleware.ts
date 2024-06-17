// clerkMiddleware.ts
import { withClerkMiddleware } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: ['/((?!_next|api|static|favicon.ico).*)'],
}

export default withClerkMiddleware((req: NextRequest) => {
  const res = NextResponse.next()
  res.headers.set('Content-Type', 'text/html')
  return res
})
