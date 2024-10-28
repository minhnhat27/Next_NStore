'use client'

import { App, Button, Divider, Form, FormProps, Input, Typography } from 'antd'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import useAuth from '~/hooks/useAuth'

import { showError } from '~/utils/common'
import { AuthActions } from '~/utils/auth-actions'
import httpService from '~/lib/http-service'
import { AUTH_API } from '~/utils/api-urls'
import LoginGoogle from '~/components/external-login/google'
import LoginFacebook from '~/components/external-login/facebook'

const { Title } = Typography

export default function Login() {
  const { dispatch } = useAuth()
  const router = useRouter()
  const { notification } = App.useApp()

  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')

  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const onSuccessLogin = (data: UserInfoType) => {
    dispatch(AuthActions.LOGIN(data))
    notification.info({
      message: 'Thành công',
      description: 'Đăng nhập thành công',
      className: 'text-green-500',
    })
    const redirectTo = redirect || '/'
    router.replace(redirectTo)
  }

  const startLoading = () => {
    setLoading(true)  
  }
  const stopLoading = () => {
    setLoading(false)
  }

  const handleSubmitLogin: FormProps<LoginType>['onFinish'] = async (values: LoginType) => {
    try {
      startLoading()
      const data: UserInfoType = await httpService.post(AUTH_API + '/login', values)
      onSuccessLogin(data)
    } catch (error: any) {
      form.setFields([
        {
          name: 'password',
          errors: [showError(error)],
        },
      ])
    } finally {
      stopLoading()
    }
  }

  return (
    <>
      <div className="flex h-16">
        <Title level={3}>Đăng nhập</Title>
      </div>
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
          <div className="flex justify-between items-center text-xs md:text-sm">
            <Link href="/forget-password">Quên mật khẩu</Link>
            <span>
              Chưa có tài khoản?
              <Link href="/register"> Đăng ký ngay</Link>
            </span>
          </div>
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
      <div className="flex justify-center gap-4">
        <LoginFacebook
          disabled={loading}
          startLoading={startLoading}
          stopLoading={stopLoading}
          onSuccessLogin={onSuccessLogin}
        />
        <LoginGoogle
          disabled={loading}
          startLoading={startLoading}
          stopLoading={stopLoading}
          onSuccessLogin={onSuccessLogin}
        />
      </div>
    </>
  )
}
