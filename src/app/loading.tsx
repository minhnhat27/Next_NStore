import React from 'react'
import { Skeleton } from 'antd'

const Loading: React.FC = () => (
  <>
    <div className="space-y-4">
      <Skeleton active />
      <Skeleton active />
      <Skeleton active />
      <Skeleton active />
    </div>
  </>
)
export default Loading
