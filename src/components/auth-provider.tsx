'use client'

import { NextPage } from 'next'
import React, { createContext, useContext, useReducer } from 'react'
import { AuthActionEnums, AuthActionType, AuthStateType } from '~/utils/types'

type AuthContextType = {
  state: AuthStateType
  dispatch: React.Dispatch<AuthActionType>
}

type Props = {
  children: React.ReactNode
  initialState: AuthStateType
}

const reducer = (state: AuthStateType, action: AuthActionType): AuthStateType => {
  switch (action.type) {
    case AuthActionEnums.LOGIN:
      return {
        ...state,
        isAuthenticated: true,
      }
    case AuthActionEnums.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
      }
    default:
      return state
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AuthProvider: NextPage<Props> = ({ children, initialState }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>
}
export default AuthProvider

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
