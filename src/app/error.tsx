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
    // global-error must include html and body tags
    <html>
      <body>
        <Result
          status="500"
          title="500"
          subTitle="Có lỗi xảy ra."
          extra={
            <Button type="primary" onClick={() => reset()}>
              Thử lại
            </Button>
          }
        />
      </body>
    </html>
  )
}
