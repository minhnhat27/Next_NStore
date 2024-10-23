import { useEffect } from 'react'

declare global {
  interface Window {
    FB: {
      init: (params: { appId: string; cookie: boolean; xfbml: boolean; version: string }) => void
      getLoginStatus: (callback: (response: FB.LoginStatusResponse) => void) => void
      login: (callback: (response: FB.LoginResponse) => void) => void
      logout: (callback?: () => void) => void
      api: (
        path: string,
        params: { fields: string; access_token: string },
        callback: (response: any) => void,
      ) => void
    }
    fbAsyncInit: () => void
  }
}

export namespace FB {
  export interface LoginStatusResponse {
    authResponse?: {
      accessToken: string
      data_access_expiration_time: number
      expiresIn: number
      graphDomain: string
      signedRequest: string
      userID: string
    }
    status: 'connected' | 'not_authorized' | 'unknown'
  }

  export interface LoginResponse {
    authResponse?: {
      accessToken: string
      data_access_expiration_time: number
      expiresIn: number
      // reauthorize_required_in: number
      graphDomain: string
      signedRequest: string
      userID: string
    }
    status: 'connected' | 'not_authorized' | 'unknown'
    name?: string
  }
}

const clientId = process.env.NEXT_PUBLIC_FACEBOOK_ID ?? ''

export const useFacebook = () => {
  useEffect(() => {
    const loadFacebookSdk = () => {
      if (window.FB) {
        window.FB.init({
          appId: clientId,
          cookie: true,
          xfbml: true,
          version: 'v19.0',
        })
        return
      }

      window.fbAsyncInit = () => {
        window.FB.init({
          appId: clientId,
          cookie: true,
          xfbml: true,
          version: 'v19.0',
        })
      }

      const script = document.createElement('script')
      script.src = 'https://connect.facebook.net/en_US/sdk.js'
      script.async = true
      script.defer = true
      document.body.appendChild(script)
    }
    loadFacebookSdk()
  }, [])

  const loginWithFacebook = (): Promise<FB.LoginResponse> =>
    new Promise<FB.LoginResponse & { name?: string }>((resolve) =>
      window.FB.login((response: FB.LoginResponse) => resolve(response)),
    )

  const loginWithFacebookAndGetInfo = (): Promise<FB.LoginResponse> =>
    new Promise<FB.LoginResponse>((resolve, reject) => {
      window.FB.login((response: FB.LoginResponse) => {
        if (response.authResponse) {
          const { accessToken } = response.authResponse
          window.FB.api(
            '/me',
            { fields: 'name', access_token: accessToken },
            (userInfo: { name: string }) => {
              resolve({ ...response, name: userInfo.name })
            },
          )
        } else {
          reject(new Error('Lấy thông tin thất bại.'))
        }
      })
    })

  const getFacebookLoginStatus = (): Promise<FB.LoginStatusResponse> =>
    new Promise<FB.LoginStatusResponse>((resolve) =>
      window.FB.getLoginStatus((response: FB.LoginStatusResponse) => resolve(response)),
    )

  const logoutFromFacebook = (): Promise<void> =>
    new Promise<void>((resolve) => window.FB.logout(() => resolve()))

  return {
    loginWithFacebook,
    getFacebookLoginStatus,
    logoutFromFacebook,
    loginWithFacebookAndGetInfo,
  }
}
