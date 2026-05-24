'use client'

import dynamic from 'next/dynamic'

const PostHogPageViews = dynamic(() => import('./PostHogPageViews'), { ssr: false })

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PostHogPageViews />
      {children}
    </>
  )
}
