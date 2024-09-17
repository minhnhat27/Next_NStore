'use client'

import { Button, Result } from 'antd'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <Result
      status="500"
      title="Có lỗi xảy ra."
      subTitle={error.message}
      extra={
        <Button type="primary" onClick={() => reset()}>
          Thử lại
        </Button>
      }
    />
  )
}
