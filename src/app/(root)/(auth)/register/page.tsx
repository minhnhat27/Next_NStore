'use client'

import { App, Button, Divider, Flex, Form, Image, Input, Typography } from 'antd'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { LockOutlined, UserOutlined, MailOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import AuthService from '~/lib/proxy-server-service/auth-service'
import { showError } from '~/utils/common'

const { Title } = Typography

enum State {
  EMAIL,
  VERIFY,
  REGISTER,
}

const Register: React.FC = () => {
  const [form] = Form.useForm()
  const { notification } = App.useApp()
  const router = useRouter()
  const [OTP, setOTP] = useState('')
  const [email, setEmail] = useState('')
  const [formState, setFormState] = useState(State.EMAIL)
  const [loading, setLoading] = useState(false)

  const [countdown, setCountdown] = useState(0)

  const previousFormState = () => setFormState(formState > 0 ? formState - 1 : formState)

  const nextFormState = () =>
    setFormState(formState < Object.keys(State).length - 1 ? formState + 1 : formState)

  useEffect(() => {
    if (countdown > 0) {
      const timerId = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timerId)
    }
  }, [countdown])

  const handleSendOTP = async () => {
    try {
      const em = form.getFieldValue('email')
      const data: SendOTPType = {
        email: em,
      }
      await AuthService.sendOTP(data)
      setEmail(em)
      nextFormState()
    } catch (error: any) {
      form.setFields([
        {
          name: 'email',
          errors: [showError(error)],
        },
      ])
    }
  }

  const handleVerifyOTP = async () => {
    try {
      const data: VerifyOTPType = {
        email: form.getFieldValue('email'),
        token: OTP,
      }
      await AuthService.verifyOTP(data)
      nextFormState()
    } catch (error: any) {
      form.setFields([
        {
          name: 'token',
          errors: [showError(error)],
        },
      ])
    }
  }

  const handleRegister = async () => {
    try {
      const data: RegisterType = {
        ...form.getFieldsValue(),
        token: OTP,
        email: email,
      }
      await AuthService.register(data)
    } catch (error: any) {
      form.setFields([
        {
          name: 'passwordConfirm',
          errors: [showError(error)],
        },
      ])
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    switch (formState) {
      case State.EMAIL: {
        await handleSendOTP()
        setCountdown(60)
        break
      }
      case State.VERIFY: {
        await handleVerifyOTP()
        break
      }
      case State.REGISTER: {
        await handleRegister()
        notification.success({
          className: 'text-green-500',
          message: 'Đăng ký thành công',
          description: 'Vui lòng đăng nhập.',
        })
        router.replace('/login')
        break
      }
    }
    setLoading(false)
  }

  const handleResend = async () => {
    setLoading(true)
    const data: SendOTPType = {
      email: form.getFieldValue('email'),
    }
    await AuthService.sendOTP(data)
    setLoading(false)
    setCountdown(60)
  }

  return (
    <>
      <Flex className="h-16">
        {formState === State.VERIFY && (
          <Button onClick={previousFormState} type="text">
            <ArrowLeftOutlined className="text-2xl" />
          </Button>
        )}
        <Title level={3}>
          {formState === State.EMAIL
            ? 'Đăng ký'
            : formState === State.VERIFY
            ? 'Nhập mã xác nhận'
            : 'Xác nhận thông tin'}
        </Title>
      </Flex>
      <Form form={form} disabled={loading} layout="vertical" onFinish={handleSubmit}>
        {formState === State.EMAIL ? (
          <Form.Item<SendOTPType>
            name="email"
            hasFeedback
            rules={[
              {
                type: 'email',
                message: 'Email không hợp lệ',
              },
              { required: true, message: 'Vui lòng nhập Email của bạn.' },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Địa chỉ Email"
              size="large"
            />
          </Form.Item>
        ) : formState === State.VERIFY ? (
          <div className="text-center">
            <Flex vertical className="mb-8">
              <span>Mã xác thực sẽ được gửi qua Email đến</span>
              <span className="space-x-1">
                <MailOutlined className="text-gray-400" />
                <span>{email}</span>
              </span>
            </Flex>
            <Form.Item<RegisterType>
              name="token"
              rules={[{ required: true, message: 'Vui lòng nhập mã xác thực.' }]}
            >
              <Flex justify="center">
                <Input.OTP value={OTP} onChange={setOTP} size="large" />
              </Flex>
            </Form.Item>
            <Flex vertical className="h-16">
              {countdown > 0 ? (
                <span className="text-gray-500">
                  Vui lòng chờ <span className="font-semibold text-red-500">{countdown}</span> giây
                  để gửi lại.
                </span>
              ) : (
                <>
                  <span>Bạn vẫn chưa nhận được?</span>
                  <Button type="link" onClick={handleResend}>
                    Gửi lại
                  </Button>
                </>
              )}
            </Flex>
          </div>
        ) : (
          <>
            <Form.Item<RegisterType>
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập Tên của bạn.' }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Họ và tên"
                size="large"
              />
            </Form.Item>
            <Form.Item<RegisterType>
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu.' },
                {
                  pattern: /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/,
                  message: 'Mật khẩu ít nhất 6 ký tự, 1 ký tự hoa, thường và 1 số.',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Mật khẩu"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="passwordConfirm"
              rules={[
                { required: true, message: 'Vui lòng nhập xác nhận mật khẩu' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp.'))
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Xác nhận mật khẩu"
                size="large"
              />
            </Form.Item>
          </>
        )}
        <Form.Item>
          <Button
            loading={loading}
            htmlType="submit"
            type="primary"
            className="w-full"
            size="large"
          >
            {formState === State.EMAIL ? 'Tiếp tục' : 'Xác nhận'}
          </Button>
        </Form.Item>
      </Form>
      {formState === State.EMAIL && (
        <>
          <Divider className="my-4" plain>
            Hoặc tiếp tục với
          </Divider>
          <Flex justify="center" align="center" className="space-x-3">
            <Image alt="logo" src="/images/Facebook_Logo.png" width={35} preview={false} />
            <Image alt="logo" src="/images/Google_Logo.png" width={35} preview={false} />
          </Flex>
          <Flex justify="space-between" align="center" className="mt-2 text-xs md:text-sm">
            <Link href="/forget-password">Quên mật khẩu</Link>
            <span>
              Đã có tài khoản?
              <Link href="/login"> Đăng nhập</Link>
            </span>
          </Flex>
        </>
      )}
    </>
  )
}

export default Register
