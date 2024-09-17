import { Button, Result } from 'antd'
import Link from 'next/link'
import React from 'react'

export default function NotFound() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang bạn vừa truy cập không tồn tại."
      extra={
        <Link href="/" replace>
          <Button type="primary">Trang chủ</Button>
        </Link>
      }
    />
  )
}
