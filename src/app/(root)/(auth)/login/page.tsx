'use client'

import { Button, Divider, Flex, Form, FormProps, Image, Input, Typography } from 'antd'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import useAuth from '~/hooks/useAuth'
import AuthService from '~/lib/proxy-server-service/auth-service'

import { showError } from '~/utils/common'
import { AuthActions } from '~/utils/auth-actions'

const { Title } = Typography

export default function Login() {
  const { dispatch } = useAuth()
  const router = useRouter()

  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')

  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmitLogin: FormProps<LoginType>['onFinish'] = async (values: LoginType) => {
    try {
      setLoading(true)
      const res = await AuthService.login(values)
      dispatch(AuthActions.LOGIN(res.data))

      const redirectTo = redirect || '/'
      router.replace(redirectTo)
    } catch (error: any) {
      form.setFields([
        {
          name: 'password',
          errors: [showError(error)],
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Flex className="h-16">
        <Title level={3}>Đăng nhập</Title>
      </Flex>
      <Form form={form} disabled={loading} onFinish={handleSubmitLogin}>
        <Form.Item<LoginType>
          name="username"
          rules={[{ required: true, message: 'Vui lòng nhập Số điện thoại/Email' }]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Số điện thoại/Email"
            size="large"
          />
        </Form.Item>
        <Form.Item<LoginType>
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Password"
            size="large"
          />
        </Form.Item>
        <Form.Item>
          <Flex justify="space-between" align="center" className="text-xs md:text-sm">
            <Link href="/forget-password">Quên mật khẩu</Link>
            <span>
              Chưa có tài khoản?
              <Link href="/register"> Đăng ký ngay</Link>
            </span>
          </Flex>
        </Form.Item>
        <Form.Item>
          <Button
            loading={loading}
            htmlType="submit"
            type="primary"
            className="w-full"
            size="large"
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
      <Divider className="my-4" plain>
        Hoặc tiếp tục với
      </Divider>
      <Flex justify="center" align="center" className="space-x-2">
        <Image alt="logo" src="/images/Facebook_Logo.png" width={35} preview={false} />
        <Image alt="logo" src="/images/Google_Logo.png" width={35} preview={false} />
      </Flex>
    </>
  )
}
