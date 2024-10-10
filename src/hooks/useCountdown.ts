import { useEffect, useState } from 'react'

const useCountdown = () => {
  const [countdown, setCountdown] = useState<number>(0)

  useEffect(() => {
    if (countdown && countdown > 0) {
      const timerId = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timerId)
    }
  }, [countdown])

  return { countdown, setCountdown }
}
export default useCountdown
