import { Skeleton } from 'antd'

export default function Loading() {
  return <Skeleton className="p-4" active paragraph={{ rows: 15 }} />
}
