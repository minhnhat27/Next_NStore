'use client'

import { App, Button, Divider, Form, FormProps, Input, Statistic, Typography } from 'antd'
import Link from 'next/link'
import React, { useCallback, useMemo, useState } from 'react'
import {
  LockOutlined,
  UserOutlined,
  MailOutlined,
  ArrowLeftOutlined,
  PhoneOutlined,
} from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { showError } from '~/utils/common'
import httpService from '~/lib/http-service'
import { AUTH_API } from '~/utils/api-urls'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'

const { Title } = Typography

enum State {
  EMAIL,
  VERIFY,
  REGISTER,
}

const Register: React.FC = () => {
  const [form] = Form.useForm()
  const { notification, message } = App.useApp()
  const router = useRouter()
  const [OTP, setOTP] = useState<string>()
  const [email, setEmail] = useState<string>()
  const [formState, setFormState] = useState(State.EMAIL)
  const [loading, setLoading] = useState(false)

  const [countdownValue, setCountdownValue] = useState(0)

  const previousFormState = () => setFormState((prev) => (prev > 0 ? prev - 1 : prev))

  const nextFormState = useCallback(
    () => setFormState((prev) => (prev < Object.keys(State).length - 1 ? prev + 1 : prev)),
    [],
  )

  const handleSendOTP = useCallback(
    async (email: string, nextState: boolean = true) => {
      try {
        const data: SendOTPType = { email }
        await httpService.post(AUTH_API + '/send-otp', data)
        setEmail(email)
        nextState && nextFormState()
      } catch (error: any) {
        form.setFields([
          {
            name: 'email',
            errors: [showError(error)],
          },
        ])
      }
    },
    [form, nextFormState],
  )

  const handleVerifyOTP = async (token: string) => {
    try {
      if (email) {
        const data: VerifyOTPType = { email, token }
        await httpService.post(AUTH_API + '/verify-otp', data)
        setOTP(token)
        nextFormState()
      } else throw new Error('Email không tồn tại')
    } catch (error: any) {
      form.setFields([
        {
          name: 'token',
          errors: [showError(error)],
        },
      ])
    }
  }

  const handleRegister = async (values: any) => {
    try {
      const data: RegisterType = {
        ...values,
        token: OTP,
        email,
      }
      await httpService.post(AUTH_API + '/register', data)

      notification.success({
        className: 'text-green-500',
        message: 'Đăng ký thành công',
        description: 'Vui lòng đăng nhập.',
      })
      router.replace('/login')
    } catch (error: any) {
      form.setFields([
        {
          name: 'passwordConfirm',
          errors: [showError(error)],
        },
      ])
    }
  }

  const handleSubmit: FormProps['onFinish'] = async (values) => {
    setLoading(true)
    switch (formState) {
      case State.EMAIL: {
        await handleSendOTP(values.email)
        setCountdownValue(60)
        break
      }
      case State.VERIFY: {
        await handleVerifyOTP(values.token)
        break
      }
      case State.REGISTER: {
        await handleRegister(values)
        break
      }
    }
    setLoading(false)
  }

  const googleRegister = async (response: CredentialResponse) => {
    try {
      setLoading(true)
      if (response.credential) {
        await httpService.post(AUTH_API + '/register/google', { token: response.credential })
        setFormState(State.REGISTER)
        // setIsGoogleRegister(true)
        setOTP(response.credential)
        setEmail(undefined)
      } else throw Error('Không thể đăng ký với Google')
    } catch (error) {
      message.error(showError(error))
    } finally {
      setLoading(false)
    }
  }

  const renderInteface = useMemo(() => {
    const handleResend = () => {
      if (email) {
        handleSendOTP(email, false)
        setCountdownValue(60)
        form.setFieldValue('token', undefined)
      } else form.setFields([{ name: 'token', errors: ['Không tìm thấy email'] }])
    }

    switch (formState) {
      case State.EMAIL:
        return (
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
        )
      case State.VERIFY:
        return (
          <div className="text-center">
            <div className="mb-8 flex flex-col items-center">
              <span>Mã xác thực sẽ được gửi qua Email đến</span>
              <span className="space-x-1">
                <MailOutlined className="text-gray-400" />
                <span>{email}</span>
              </span>
            </div>
            <Form.Item<RegisterType>
              name="token"
              rules={[{ required: true, message: 'Vui lòng nhập mã xác thực.' }]}
            >
              <Input.OTP size="large" />
            </Form.Item>
            <div className="mb-8 flex justify-center items-center gap-1">
              {countdownValue > 0 ? (
                <>
                  <div className="text-gray-500">Gửi lại sau</div>{' '}
                  <Statistic.Countdown
                    onFinish={() => setCountdownValue(0)}
                    valueStyle={{ fontSize: 12, fontWeight: 'bold', color: 'red' }}
                    format="ss"
                    value={new Date().getTime() + countdownValue * 1000}
                  />
                  <span className="text-gray-500">giây.</span>
                </>
              ) : (
                <div className="flex items-center">
                  <span>Bạn vẫn chưa nhận được?</span>
                  <Button type="link" onClick={handleResend}>
                    Gửi lại
                  </Button>
                </div>
              )}
            </div>
          </div>
        )
      case State.REGISTER:
        return (
          <>
            <Form.Item<RegisterType>
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập tên của bạn.' }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Họ và tên"
                size="large"
              />
            </Form.Item>
            <Form.Item<RegisterType> name="phoneNumber">
              <Input
                prefix={<PhoneOutlined className="text-gray-400" />}
                placeholder="Số điện thoại"
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
                allowClear
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
                allowClear
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Xác nhận mật khẩu"
                size="large"
              />
            </Form.Item>
          </>
        )

      default:
        return (
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
        )
    }
  }, [countdownValue, form, email, formState, handleSendOTP])

  return (
    <>
      <div className="flex h-16 gap-2">
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
      </div>
      <Form form={form} disabled={loading} layout="vertical" onFinish={handleSubmit}>
        {renderInteface}
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
        <div className="space-y-4">
          <Divider plain>Đăng ký với</Divider>
          <div className="flex justify-center">
            <Button disabled={loading} type="link" className="p-0">
              <GoogleLogin
                type="icon"
                shape="circle"
                context="signup"
                useOneTap
                onSuccess={googleRegister}
                onError={() => message.error('Đăng nhập bằng Google thất bại')}
              />
            </Button>
          </div>
          <div className="flex justify-between items-center text-xs md:text-sm">
            <Link href="/forget-password">Quên mật khẩu</Link>
            <span>
              Đã có tài khoản?
              <Link href="/login"> Đăng nhập</Link>
            </span>
          </div>
        </div>
      )}
    </>
  )
}

export default Register
