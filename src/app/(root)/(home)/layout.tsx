import { Divider } from 'antd'

interface Props {
  banner: React.ReactNode
  policy: React.ReactNode
  flashsale: React.ReactNode
  bestSeller: React.ReactNode
  popuplarBrands: React.ReactNode
  productHighlight: React.ReactNode
}

export default function Layout({
  banner,
  policy,
  flashsale,
  bestSeller,
  popuplarBrands,
  productHighlight,
}: Props) {
  return (
    <>
      {banner}
      {policy}
      <Divider>
        <div className="text-center my-6 font-bold text-xl md:text-3xl text-orange-600 font-sans">
          Flash Sale
        </div>
      </Divider>
      {flashsale}
      <Divider>
        <div className="text-center my-6 font-semibold text-xl md:text-3xl text-blue-950 font-sans">
          Sản phẩm bán chạy
        </div>
      </Divider>
      {bestSeller}
      {popuplarBrands}
      <Divider>
        <div className="text-center pb-6 font-semibold text-xl md:text-3xl text-blue-950 font-sans">
          Sản phẩm nổi bật
        </div>
      </Divider>
      {productHighlight}
    </>
  )
}
