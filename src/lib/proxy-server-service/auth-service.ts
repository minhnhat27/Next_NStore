import axios from 'axios'

const login = async (data: LoginType) => await axios.post('/api/login', data)

const register = async (data: RegisterType) => await axios.post('/api/register', data)

const sendOTP = async (data: SendOTPType) => await axios.post('/api/send-otp', data)

const verifyOTP = async (data: VerifyOTPType) => await axios.post('/api/verify-otp', data)

const AuthService = {
  login,
  register,
  sendOTP,
  verifyOTP,
}
export default AuthService
