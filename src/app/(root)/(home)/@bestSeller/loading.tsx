'use client'

import { Skeleton } from 'antd'

export default function Loading() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-8 md:px-24 lg:px-28">
      {[...new Array(4)].map((_, i) => (
        <Skeleton.Image active className="h-64 md:h-72 w-full" key={i} />
      ))}
    </div>
  )
}
