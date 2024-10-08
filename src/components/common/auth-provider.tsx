'use client'

import { useRouter } from 'next/navigation'
import { createContext, useContext, useReducer } from 'react'
import { AuthActionEnums } from '~/utils/auth-actions'

interface IProps {
  children: React.ReactNode
  initialState: AuthStateType
}

const reducer = (state: AuthStateType, action: AuthActionType): AuthStateType => {
  switch (action.type) {
    case AuthActionEnums.LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        userInfo: action.payload,
      }
    case AuthActionEnums.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        userInfo: action.payload,
      }
    default:
      return state
  }
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export default function AuthProvider({ children, initialState }: IProps) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const router = useRouter()

  const redirectIfNoAuthenticated = () => !state.isAuthenticated && router.push('/login')

  return (
    <AuthContext.Provider value={{ redirectIfNoAuthenticated, state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
