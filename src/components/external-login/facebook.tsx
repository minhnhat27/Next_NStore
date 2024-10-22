import { App, Button } from 'antd'
import Image from 'next/image'
import { useFacebook } from '~/hooks/useFacebook'
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

export default function LoginFacebook({
  disabled,
  onSuccessLogin,
  startLoading,
  stopLoading,
}: Props) {
  const { message } = App.useApp()
  const { loginWithFacebook, getFacebookLoginStatus, logoutFromFacebook } = useFacebook()

  const login = async () => {
    try {
      const status = await getFacebookLoginStatus()
      // let token = status.authResponse?.userID
      if (status.status === 'connected') {
        await logoutFromFacebook()
      }
      const response = await loginWithFacebook()
      const token = response.authResponse?.userID
      if (token) {
        startLoading()
        const data = await httpService.post(AUTH_API + '/login/facebook', { token })
        onSuccessLogin({ ...data, provider: LoginProvider.FACEBOOK })
      }
    } catch (error) {
      message.warning(showError(error))
    } finally {
      stopLoading()
    }
  }

  return (
    <>
      <Button className="p-0" type="link" disabled={disabled} onClick={login}>
        <Image
          alt="logo"
          src="/images/Facebook_Logo.png"
          width={0}
          height={0}
          sizes="20vw"
          className="h-9 w-auto cursor-pointer"
        />
      </Button>
    </>
  )
}
