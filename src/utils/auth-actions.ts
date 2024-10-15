export const enum AuthActionEnums {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  CHANGEINFO = 'CHANGEINFO',
}

const LOGIN = (data?: UserInfoType): AuthActionType => ({
  type: AuthActionEnums.LOGIN,
  payload: data,
})

const LOGOUT: AuthActionType = {
  type: AuthActionEnums.LOGOUT,
}

const CHANGEINFO = (data?: UserInfoType): AuthActionType => ({
  type: AuthActionEnums.CHANGEINFO,
  payload: data,
})

export const AuthActions = {
  LOGIN,
  LOGOUT,
  CHANGEINFO,
}
