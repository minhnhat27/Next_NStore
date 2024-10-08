import { GiftOutlined, RollbackOutlined, TruckOutlined } from '@ant-design/icons'
import { Divider } from 'antd'
import axios from 'axios'
import Banner from '~/components/home/banner'
import BestSeller from '~/components/home/best-seller'
import FlashSale from '~/components/home/flash-sale'
import PopularBrands from '~/components/home/popuplar-brands'
import ProductHighlight from '~/components/home/product-highlight'
import { HOME_API } from '~/utils/api-urls'

export const revalidate = 7200

const getBanner = async () => {
  try {
    const res = await axios.get(process.env.API_URL + HOME_API + '/banner')
    const data: string[] = res.data
    return data
  } catch (error) {
    return []
  }
}

export default async function Home() {
  const images = await getBanner()

  return (
    <>
      <Banner images={images} />
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 p-4 md:pt-10 text-sx sm:text-sm md:text-base">
          <div className="text-center py-4">
            <div className="h-2/3">
              <TruckOutlined className="text-4xl" />
              <div className="text-gray-600 text-lg font-semibold">Miễn phí vận chuyển</div>
            </div>
            <div className="text-sm text-center p-1">Miễn phí vận chuyển đơn hàng từ 200.000đ</div>
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
            <div className="text-sm text-center p-1">
              Liên hệ với chúng tôi nếu sản phẩm của bạn gặp lỗi
            </div>
          </div>
        </div>
        <>
          <Divider>
            <div className="text-center my-6 font-bold text-xl md:text-3xl text-orange-600 font-sans">
              Flash Sale
            </div>
          </Divider>
          <FlashSale />
        </>
        <>
          <Divider>
            <div className="text-center my-6 font-semibold text-xl md:text-3xl text-blue-950 font-sans">
              Sản phẩm bán chạy
            </div>
          </Divider>
          <BestSeller />
        </>

        <PopularBrands />

        <>
          <Divider>
            <div className="text-center pb-6 font-semibold text-xl md:text-3xl text-blue-950 font-sans">
              Sản phẩm nổi bật
            </div>
          </Divider>
          <ProductHighlight />
        </>
      </div>
    </>
  )
}
