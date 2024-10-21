import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { App, Button } from 'antd'
import httpService from '~/lib/http-service'
import { LoginProvider } from '~/types/enum'
import { AUTH_API } from '~/utils/api-urls'
import { showError } from '~/utils/common'

interface Props {
  onSuccessLogin: (data: UserInfoType) => void
  startLoading: () => void
  stopLoading: () => void
  disabled: boolean
}

export default function LoginGoogle({
  disabled,
  onSuccessLogin,
  startLoading,
  stopLoading,
}: Props) {
  const { message } = App.useApp()

  const handleSuccessLogin = async (response: CredentialResponse) => {
    try {
      startLoading()
      const data: UserInfoType = await httpService.post(AUTH_API + '/login/google', {
        token: response.credential,
      })
      onSuccessLogin({ ...data, provider: LoginProvider.GOOGLE })
    } catch (error) {
      message.error(showError(error))
    } finally {
      stopLoading()
    }
  }

  return (
    <>
      <Button disabled={disabled} type="link" className="p-0">
        <GoogleLogin
          type="icon"
          shape="circle"
          useOneTap
          onSuccess={handleSuccessLogin}
          onError={() => message.error('Đăng nhập bằng Google thất bại')}
        />
      </Button>
    </>
  )
}
