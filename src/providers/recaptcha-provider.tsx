'use client'

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

const reCaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_KEY ?? ''

export default function RecaptchaProvider({ children }: IProps) {
  return <GoogleReCaptchaProvider reCaptchaKey={reCaptchaKey}>{children}</GoogleReCaptchaProvider>
}
