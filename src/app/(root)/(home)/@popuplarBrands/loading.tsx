'use client'

import { Skeleton } from 'antd'

export default function Loading() {
  return (
    <div className="grid grid-cols-5 gap-2">
      {[...Array(5)].map((_, i) => (
        <Skeleton.Image className="h-28 w-full" active key={i} />
      ))}
    </div>
  )
}
