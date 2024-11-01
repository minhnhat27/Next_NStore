type SendOTPType = {
  email: string
  type?: number
}

interface LoginType {
  username: string
  password: string
}

type RegisterType = {
  name: string
  email?: string
  phoneNumber?: string
  token: string
  password: string
}

type ForgetPasswordType = {
  token: string
  email: string
  password: string
}

type VerifyOTPType = {
  email: string
  token: string
  type?: number
}

interface UserInfoType {
  fullname?: string
  session: string
  provider?: number
}

interface LoginResType {
  accessToken: string
  // refreshToken: string
  fullName?: string
  expires: string
  session: string
}

type AuthContextType = {
  redirectIfNoAuthenticated: () => void
  state: AuthStateType
  dispatch: React.Dispatch<AuthActionType>
}

type FavoritesContextType = {
  favorites: number[]
  addFavorite: (id: number) => Promise<void>
  removeFavorite: (id: number) => Promise<void>
}

type AuthActionType = {
  type: AuthActionEnums
  payload?: UserInfoType
}

type AuthStateType = {
  isAuthenticated: boolean
  userInfo?: UserInfoType
}
