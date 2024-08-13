'use client'

import { GiftOutlined, RollbackOutlined, TruckOutlined } from '@ant-design/icons'
import { Carousel, Flex, Image, Typography } from 'antd'
import BestSeller from '~/components/home-page/best-seller'
import FlashSale from '~/components/home-page/flash-sale'
import ProductHighlight from '~/components/home-page/product-highlight'

const { Title } = Typography

export default function Home() {
  return (
    <div className="pb-4">
      <Carousel arrows autoplay className="md:h-screen--header">
        <Image
          rootClassName="w-full"
          src="/images/Banner.png"
          className="md:h-screen--header"
          preview={false}
          alt="banner"
        />
        <Image
          rootClassName="w-full"
          src="/images/Banner.png"
          className="md:h-screen--header"
          preview={false}
          alt="banner"
        />
      </Carousel>
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 p-4 md:py-10 text-sx sm:text-sm md:text-base">
          <div className="text-center py-4">
            <div className="h-2/3">
              <TruckOutlined className="text-4xl" />
              <div className="text-gray-600 text-lg font-semibold">Miễn phí vận chuyển</div>
            </div>
            <div className="text-sm text-center p-1">
              Miễn phí vận chuyển đơn hàng tối thiểu 150.000đ
            </div>
          </div>
          <div className="text-center py-4">
            <div className="h-2/3">
              <GiftOutlined className="text-4xl" />
              <div className="text-gray-600 text-lg font-semibold">Ưu đãi bất tận</div>
            </div>
            <div className="text-sm text-center p-1">Giảm giá và áp dụng mã giảm của bạn</div>
          </div>
          <div className="text-center py-4">
            <div className="h-2/3">
              <TruckOutlined className="text-4xl" />
              <div className="text-gray-600 text-lg font-semibold">Giao hàng nhanh chóng</div>
            </div>
            <div className="text-sm text-center p-1">
              Giao hàng nhanh chóng với các đối tác giao hàng
            </div>
          </div>
          <div className="text-center py-4">
            <div className="h-2/3">
              <RollbackOutlined className="text-4xl" />
              <div className="text-gray-600 text-lg font-semibold">Hoàn tiền sản phẩm lỗi</div>
            </div>
            <div className="text-sm text-center p-1">Liên hệ với chúng tôi nếu sản phẩm bị lỗi</div>
          </div>
        </div>
        <FlashSale />
        <BestSeller />
        <ProductHighlight />
      </div>
    </div>
  )
}
