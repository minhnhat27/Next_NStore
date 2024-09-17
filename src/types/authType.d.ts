type LoginType = {
  username: string
  password: string
}

type RegisterType = {
  name: string
  email: string
  token: string
  password: string
}

type SendOTPType = {
  email: string
}

type VerifyOTPType = {
  email: string
  token: string
}

type UserInfoType = {
  fullname?: string
  session: string
}

type AuthContextType = {
  state: AuthStateType
  dispatch: React.Dispatch<AuthActionType>
}

type AuthActionType = {
  type: AuthActionEnums
  payload?: UserInfoType
}

type AuthStateType = {
  isAuthenticated: boolean
  userInfo?: UserInfoType
}

type LoginResType = {
  accessToken: string
  refreshToken: string
  fullName?: string
}
