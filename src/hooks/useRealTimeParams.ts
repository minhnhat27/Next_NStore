import { usePathname, useRouter } from 'next/navigation'

export const useRealTimeParams = () => {
  const router = useRouter()
  const pathname = usePathname()

  const setRealTimeParams = (params: Record<any, any>) => {
    const url = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => url.set(key, value))

    router.replace(`${pathname}?${url.toString()}`)
  }

  return { setRealTimeParams }
}
