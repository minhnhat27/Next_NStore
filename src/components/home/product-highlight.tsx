import { Button, ConfigProvider, Divider, Flex, Image } from 'antd'
import React from 'react'

export default function ProductHighlight() {
  return (
    <>
      <Divider>
        <div className="text-center pb-6 font-semibold text-xl md:text-3xl text-blue-950 font-sans">
          Sản phẩm nổi bật
        </div>
      </Divider>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Image src="/images/Banner.png" preview={false} alt="banner" />
        <Image src="/images/Banner.png" preview={false} alt="banner" />
        <Image src="/images/Banner.png" preview={false} alt="banner" />
        <Image src="/images/Banner.png" preview={false} alt="banner" />
        <Image src="/images/Banner.png" preview={false} alt="banner" />
        <Image src="/images/Banner.png" preview={false} alt="banner" />
      </div>
      <Flex justify="center" className="my-6">
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
            Xem thêm
          </Button>
        </ConfigProvider>
      </Flex>
    </>
  )
}
