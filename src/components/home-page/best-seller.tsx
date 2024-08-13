import React from 'react'
import { Button, ConfigProvider, Divider, Image, Typography } from 'antd'
import Link from 'next/link'

const { Title } = Typography

const BestSeller: React.FC = () => {
  return (
    <>
      <Divider>
        <div className="text-center my-6 uppercase font-semibold text-xl md:text-2xl text-sky-600">
          Sản phẩm bán chạy
        </div>
      </Divider>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Image src="/images/Banner.png" preview={false} alt="banner" />
        <Image src="/images/Banner.png" preview={false} alt="banner" />
        <Image src="/images/Banner.png" preview={false} alt="banner" />
        <Image src="/images/Banner.png" preview={false} alt="banner" />
      </div>
      <Link href="/fashions" className="flex justify-center my-6">
        <ConfigProvider
          theme={{
            components: {
              Button: {
                defaultHoverBorderColor: 'black',
                defaultHoverColor: 'black',
              },
            },
          }}
        >
          <Button
            className="uppercase text-base text-nowrap w-1/2 md:w-1/3 rounded-none"
            type="default"
          >
            Xem tất cả
          </Button>
        </ConfigProvider>
      </Link>
    </>
  )
}
export default BestSeller
