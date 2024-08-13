'use client'

import { Button, Divider, Flex, Form, FormProps, Image, Input, Typography } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useAuth } from '~/components/auth-provider'
import AuthService from '~/lib/service/auth-service'

import { showError } from '~/utils/common'
import { AuthActions, LoginType } from '~/utils/types'

const { Title } = Typography

const Login: React.FC = () => {
  const { dispatch } = useAuth()
  const router = useRouter()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmitLogin: FormProps<LoginType>['onFinish'] = async (values: LoginType) => {
    setLoading(true)
    try {
      await AuthService.login(values)
      dispatch(AuthActions.LOGIN)
      router.replace('/')
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
        <Image src="/images/Facebook_Logo.png" width={35} preview={false} />
        <Image src="/images/Google_Logo.png" width={35} preview={false} />
      </Flex>
    </>
  )
}
export default Login
