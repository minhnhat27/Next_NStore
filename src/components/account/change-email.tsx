import { ArrowLeftOutlined, MailOutlined } from '@ant-design/icons'
import { App, Button, Form, FormProps, Input, Modal, Statistic } from 'antd'
import { useCallback, useMemo, useState } from 'react'
import httpService from '~/lib/http-service'
import { AuthTypeEnum } from '~/types/enum'
import { AUTH_API } from '~/utils/api-urls'
import { maskEmail, showError } from '~/utils/common'

enum ChangeEmailState {
  CHECK_PASSWORD,
  NEW_EMAIL,
  OTP_CONFIRM,
}

type ChangeEmailType = {
  password: string
  email: string
  token: string
}

interface Props {
  info?: InfoType
  mutate_info: (info: InfoType) => void
}

export default function ChangeEmail({ info, mutate_info }: Props) {
  const [form] = Form.useForm()
  const { notification } = App.useApp()
  const [loading, setLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [formState, setFormState] = useState<ChangeEmailState>(ChangeEmailState.CHECK_PASSWORD)

  const [newEmail, setNewEmail] = useState<string>()
  const [countdownValue, setCountdownValue] = useState(0)

  const resetFormState = () => {
    form.resetFields()
    setFormState(ChangeEmailState.CHECK_PASSWORD)
  }

  const nextFormState = useCallback(
    () =>
      setFormState((prev) => (prev < Object.keys(ChangeEmailState).length - 1 ? prev + 1 : prev)),
    [],
  )

  const handleCheckPassword = async (password: string) => {
    try {
      await httpService.post(AUTH_API + '/check-password', { password })
      nextFormState()
    } catch (error) {
      form.setFields([{ name: 'password', errors: [showError(error)] }])
    }
  }

  const handleSendOTP = useCallback(
    async (email: string, nextState: boolean = true) => {
      try {
        const data = { email, type: AuthTypeEnum.ChangeEmail }
        await httpService.post(AUTH_API + '/send-otp', data)
        setNewEmail(email)
        nextState && nextFormState()
      } catch (error) {
        form.setFields([{ name: 'email', errors: [showError(error)] }])
      }
    },
    [form, nextFormState],
  )

  const handleChangeEmail = async (token: string) => {
    try {
      if (newEmail) {
        const data = { email: newEmail, token }
        await httpService.put(AUTH_API + '/change-email', data)
        mutate_info({ ...info, email: maskEmail(newEmail) })
        resetFormState()
        setOpen(false)
        notification.success({
          message: 'Thành công',
          description: 'Đã thay đổi địa chỉ Email',
          className: 'text-green-500',
        })
      } else throw new Error('Không tìm thấy Email')
    } catch (error) {
      form.setFields([{ name: 'token', errors: [showError(error)] }])
    }
  }

  const onFinish: FormProps['onFinish'] = async (values) => {
    setLoading(true)
    switch (formState) {
      case ChangeEmailState.CHECK_PASSWORD:
        await handleCheckPassword(values.password)
        break
      case ChangeEmailState.NEW_EMAIL:
        await handleSendOTP(values.email)
        setCountdownValue(60)
        break
      case ChangeEmailState.OTP_CONFIRM:
        await handleChangeEmail(values.token)
        break
    }
    setLoading(false)
  }

  const renderInteface = useMemo(() => {
    const handleResend = () => {
      if (newEmail) {
        setCountdownValue(60)
        handleSendOTP(newEmail, false)
        form.setFieldValue('token', undefined)
      } else form.setFields([{ name: 'token', errors: ['Không tìm thấy email'] }])
    }

    const previousFormState = () => {
      form.setFieldValue('token', undefined)
      setFormState((prev) => (prev > 0 ? prev - 1 : prev))
    }
    switch (formState) {
      case ChangeEmailState.CHECK_PASSWORD:
        return (
          <Form.Item<ChangeEmailType>
            name="password"
            label="Xác nhận mật khẩu"
            rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu.' }]}
          >
            <Input.Password className="rounded-sm" size="large" placeholder="Xác nhận mật khẩu" />
          </Form.Item>
        )
      case ChangeEmailState.NEW_EMAIL:
        return (
          <Form.Item<ChangeEmailType>
            name="email"
            label="Địa chỉ Email mới"
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
              placeholder="Email"
              className="rounded-sm"
              size="large"
            />
          </Form.Item>
        )
      case ChangeEmailState.OTP_CONFIRM:
        return (
          <>
            <ArrowLeftOutlined onClick={previousFormState} />
            <div className="text-center">
              <div className="flex flex-col items-center mb-4">
                <span>Mã xác thực sẽ được gửi qua Email đến</span>
                <span className="space-x-1">
                  <MailOutlined className="text-gray-400" />
                  <span>{newEmail}</span>
                </span>
              </div>
              <div className="flex justify-center">
                <Form.Item<ChangeEmailType>
                  name="token"
                  rules={[{ required: true, message: 'Vui lòng nhập mã xác thực.' }]}
                >
                  <Input.OTP size="large" />
                </Form.Item>
              </div>
              <div className="flex justify-center items-center gap-1">
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
          </>
        )
      default:
        return (
          <Form.Item<ChangeEmailType>
            name="password"
            label="Xác nhận mật khẩu"
            rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu.' }]}
          >
            <Input.Password className="rounded-sm" size="large" placeholder="Xác nhận mật khẩu" />
          </Form.Item>
        )
    }
  }, [formState, countdownValue, newEmail, form, handleSendOTP])

  return (
    <>
      <Modal
        open={open}
        onCancel={() => {
          setOpen(false)
          resetFormState()
          form.resetFields()
        }}
        okText="Xác nhận"
        okButtonProps={{
          autoFocus: true,
          htmlType: 'submit',
          danger: true,
          className: 'rounded-sm',
          loading: loading,
        }}
        cancelButtonProps={{ className: 'rounded-sm', disabled: loading }}
        destroyOnClose
        centered
        closable={false}
        maskClosable={false}
        onClose={resetFormState}
        modalRender={(dom) => (
          <Form layout="vertical" form={form} name="changeEmail" onFinish={onFinish}>
            {dom}
          </Form>
        )}
      >
        {renderInteface}
      </Modal>
      <div className="flex flex-row justify-between items-center">
        <Form.Item className="truncate" label="Địa chỉ Email (Tên đăng nhập)">
          <div className="truncate font-semibold">{info?.email}</div>
        </Form.Item>
        {info?.email && (
          <Button onClick={() => setOpen(true)} type="link" className="px-0 w-fit justify-self-end">
            Thay đổi
          </Button>
        )}
      </div>
    </>
  )
}
