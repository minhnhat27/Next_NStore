export const enum AuthActionEnums {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

const LOGIN = (data?: UserInfoType): AuthActionType => ({
  type: AuthActionEnums.LOGIN,
  payload: data,
})

const LOGOUT: AuthActionType = {
  type: AuthActionEnums.LOGOUT,
}

export const AuthActions = {
  LOGIN,
  LOGOUT,
}
