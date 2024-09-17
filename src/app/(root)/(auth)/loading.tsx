import { Skeleton } from 'antd'

export default function Loading() {
  return <Skeleton active className="p-2" paragraph={{ rows: 6 }} />
}
