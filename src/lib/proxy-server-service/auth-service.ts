import axios from 'axios'

const login = async (data: LoginType) => await axios.post('/api/auth/login', data)

const register = async (data: RegisterType) => await axios.post('/api/auth/register', data)

const sendOTP = async (data: SendOTPType) => await axios.post('/api/auth/send-otp', data)

const verifyOTP = async (data: VerifyOTPType) => await axios.post('/api/auth/verify-otp', data)

const AuthService = {
  login,
  register,
  sendOTP,
  verifyOTP,
}
export default AuthService
