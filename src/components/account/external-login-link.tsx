import { App, Button, Popconfirm } from 'antd'
import Image from 'next/image'
import { useState } from 'react'
import { useFacebook } from '~/hooks/useFacebook'
import httpService from '~/lib/http-service'
import { AUTH_API } from '~/utils/api-urls'
import { showError } from '~/utils/common'

interface Props {
  facebook?: boolean
  info?: InfoType
  mutate_info: (info: InfoType) => void
}

export default function ExternalLoginLink({ facebook, info, mutate_info }: Props) {
  const { notification, message } = App.useApp()
  const [loading, setLoading] = useState<boolean>(false)
  const { getFacebookLoginStatus, loginWithFacebook, logoutFromFacebook } = useFacebook()

  const linkToFacebook = async () => {
    try {
      const status = await getFacebookLoginStatus()
      let token = status.authResponse?.userID
      if (status.status !== 'connected') {
        setLoading(true)
        const response = await loginWithFacebook()

        if (response.status === 'unknown') {
          throw new Error('Đã hủy liên kết')
        }

        token = response.authResponse?.userID
      }
      if (token) {
        await httpService.post(AUTH_API + '/link/facebook', { token })
        mutate_info({ ...info, facebook: true })
        logoutFromFacebook()
        notification.success({
          message: 'Thành công',
          description: 'Đã liên kết tài khoản Facebook',
          className: 'text-green-500',
        })
      }
    } catch (error) {
      message.warning(showError(error))
    } finally {
      setLoading(false)
    }
  }

  const unlinkFacebook = async () => {
    try {
      const status = await getFacebookLoginStatus()
      if (status.status === 'connected') {
        logoutFromFacebook()
      }

      await httpService.get(AUTH_API + '/unlink/facebook')
      mutate_info({ ...info, facebook: false })

      notification.success({
        message: 'Thành công',
        description: 'Đã hủy liên kết tài khoản Facebook',
        className: 'text-green-500',
      })
    } catch (error) {
      message.warning(showError(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="py-2">Tài khoản liên kết</div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Image
            width={0}
            height={0}
            sizes="10vw"
            className="h-6 w-auto"
            src="/images/Google_Logo.png"
            alt="google-logo"
          />
          <Button className="text-gray-500" disabled type="link">
            Đã liên kết
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Image
            width={0}
            height={0}
            sizes="10vw"
            className="h-6 w-auto"
            src="/images/Facebook_Logo.png"
            alt="facebook-logo"
          />
          {facebook ? (
            <Popconfirm title="Xác nhận hủy liên kết" onConfirm={unlinkFacebook}>
              <Button type="link">Hủy liên kết</Button>
            </Popconfirm>
          ) : (
            <Button loading={loading} onClick={linkToFacebook} type="link">
              Liên kết
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
