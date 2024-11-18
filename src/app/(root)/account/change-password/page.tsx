'use client'

import { App, Button, Form, FormProps, Input } from 'antd'
import { useState } from 'react'
import httpService from '~/lib/http-service'
import { AUTH_API } from '~/utils/api-urls'
import { showError } from '~/utils/common'

export default function ChangePassword() {
  const [form] = Form.useForm()
  const { notification } = App.useApp()
  const [loading, setLoading] = useState<boolean>(false)

  const handleChangePassword: FormProps['onFinish'] = async (values: ChangePasswordType) => {
    try {
      delete values.confirm
      setLoading(true)
      await httpService.put(AUTH_API + '/change-password', values)
      notification.success({
        message: 'Thành công',
        description: 'Đã thay đổi mật khẩu',
        className: 'text-green-500',
      })
      form.resetFields()
    } catch (error: any) {
      if (error?.response?.status === 400) {
        form.setFields([
          {
            name: 'currentPassword',
            errors: [showError(error)],
          },
        ])
      } else {
        form.setFields([
          {
            name: 'newPassword',
            errors: [showError(error)],
          },
        ])
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center mt-4 sm:mt-10">
      <Form
        form={form}
        disabled={loading}
        layout="vertical"
        className="transition-all w-full sm:w-1/2 lg:w-1/3"
        onFinish={handleChangePassword}
      >
        <Form.Item<ChangePasswordType>
          label="Mật khẩu hiện tại"
          name="currentPassword"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ' }]}
        >
          <Input.Password size="large" />
        </Form.Item>
        <Form.Item<ChangePasswordType>
          label="Mật khẩu mới"
          name="newPassword"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới' },
            {
              pattern: /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/,
              message: 'Mật khẩu ít nhất 6 ký tự, 1 ký tự hoa, thường và 1 số.',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('currentPassword') !== value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('Không được giống mật khẩu hiện tại'))
              },
            }),
          ]}
        >
          <Input.Password size="large" />
        </Form.Item>
        <Form.Item<ChangePasswordType>
          label="Xác nhận mật khẩu"
          name="confirm"
          rules={[
            { required: true, message: 'Vui lòng nhập xác nhận mật khẩu' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp.'))
              },
            }),
          ]}
        >
          <Input.Password size="large" />
        </Form.Item>
        <Button loading={loading} htmlType="submit" type="primary" danger>
          Xác nhận
        </Button>
      </Form>
    </div>
  )
}
