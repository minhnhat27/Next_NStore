import { GiftOutlined, RollbackOutlined, TruckOutlined } from '@ant-design/icons'

export default async function Policy() {
  return (
    <>
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
      </div>
    </>
  )
}
