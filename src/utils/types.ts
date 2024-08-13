export type LoginType = {
  username: string
  password: string
}

export type RegisterType = {
  name: string
  email: string
  token: string
  password: string
}

export type SendOTPType = {
  email: string
}

export type VerifyOTPType = {
  email: string
  token: string
}

export const enum AuthActionEnums {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

export type AuthActionType = {
  type: AuthActionEnums
}

export type AuthStateType = {
  isAuthenticated: boolean
}

const LOGIN: AuthActionType = {
  type: AuthActionEnums.LOGIN,
}

const LOGOUT: AuthActionType = {
  type: AuthActionEnums.LOGOUT,
}

export const AuthActions = {
  LOGIN,
  LOGOUT,
}

export type LoginResType = {
  accessToken: string
  refreshToken: string
  fullName?: string
}

export type Filters = {
  categories: string[]
  brands: string[]
  priceRange: number[]
  rate: number
  sales: string[]
}
