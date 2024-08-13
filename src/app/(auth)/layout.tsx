import { Card, Flex } from 'antd'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Flex
      justify="center"
      align="center"
      className="min-h-screen--header py-8 transition-all duration-300 bg-gradient-to-br from-slate-950 to-teal-400"
    >
      <Card className="transition-all w-11/12 md:w-3/5 lg:w-2/5">{children}</Card>
    </Flex>
  )
}
