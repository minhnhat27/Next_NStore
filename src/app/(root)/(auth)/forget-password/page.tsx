'use client'

import { ArrowLeftOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { App, Button, Form, FormProps, Input, Statistic, Typography } from 'antd'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import httpService from '~/lib/http-service'
import { AuthTypeEnum } from '~/types/enum'
import { AUTH_API } from '~/utils/api-urls'
import { showError } from '~/utils/common'

const { Title } = Typography

enum State {
  EMAIL,
  VERIFY,
  RESET,
}

export default function ForgetPassword() {
  const [form] = Form.useForm()
  const router = useRouter()

  const [email, setEmail] = useState<string>()
  const [OTP, setOTP] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)

  const { notification } = App.useApp()

  const [formState, setFormState] = useState(State.EMAIL)

  // const { countdown, setCountdown } = useCountdown()
  const [countdownValue, setCountdownValue] = useState(0)

  const previousFormState = () => setFormState((prev) => (prev > 0 ? prev - 1 : prev))

  const nextFormState = useCallback(
    () => setFormState((prev) => (prev < Object.keys(State).length - 1 ? prev + 1 : prev)),
    [],
  )

  const handleSendOTP = async (email: string, nextState: boolean = true) => {
    try {
      const data: SendOTPType = { email, type: AuthTypeEnum.ForgetPassword }
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
  }

  const handleResend = () => {
    if (email) {
      setCountdownValue(60)
      handleSendOTP(email, false)
      form.setFieldValue('token', undefined)
    } else form.setFields([{ name: 'token', errors: ['Không tìm thấy email'] }])
  }

  const handleVerifyOTP = async (token: string) => {
    try {
      if (email) {
        const data: VerifyOTPType = { email, token, type: AuthTypeEnum.ForgetPassword }
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

  const handleReset = async (password: string) => {
    try {
      if (OTP && email) {
        const data: ForgetPasswordType = {
          password,
          token: OTP,
          email,
        }
        await httpService.put(AUTH_API + '/reset', data)

        notification.success({
          className: 'text-green-500',
          message: 'Thành công',
          description: 'Mật khẩu đã được thay đổi',
        })
        router.replace('/login')
      } else throw new Error('Có lỗi xảy ra')
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
      case State.RESET: {
        await handleReset(values.password)
        break
      }
    }
    setLoading(false)
  }

  return (
    <>
      <div className="flex h-16 gap-2">
        <Button
          disabled={loading}
          onClick={formState !== State.EMAIL ? previousFormState : router.back}
          type="text"
        >
          <ArrowLeftOutlined className="text-2xl" />
        </Button>
        <Title level={3}>{formState == State.RESET ? 'Đặt lại mật khẩu' : 'Quên mật khẩu'}</Title>
      </div>
      <Form form={form} disabled={loading} onFinish={handleSubmit}>
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
            <div className="mb-8 flex flex-col items-center">
              <span>Mã xác thực sẽ được gửi qua Email đến</span>
              <span className="space-x-1">
                <MailOutlined className="text-gray-400" />
                <span>{email}</span>
              </span>
            </div>
            <Form.Item<ForgetPasswordType>
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
        ) : (
          <>
            <Form.Item<ForgetPasswordType>
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
    </>
  )
}
