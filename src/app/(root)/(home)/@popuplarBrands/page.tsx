import { Carousel, Empty } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import httpService from '~/lib/http-service'
import { BRAND_API } from '~/utils/api-urls'
import { toNextImageLink } from '~/utils/common'

const API_URL = process.env.API_URL

const getPopularBrands = async (): Promise<BrandType[] | undefined> => {
  try {
    const data = await httpService.get(`${API_URL}${BRAND_API}/popular`)
    return data
  } catch (error) {
    return undefined
  }
}

export default async function PopularBrands() {
  // const a = () => new Promise((r) => setTimeout(r, 5000))
  // await a()

  const brands = await getPopularBrands()

  return (
    <div className="bg-gray-300 py-6">
      <div className="text-center pb-6 font-semibold text-xl md:text-3xl text-blue-950 font-sans">
        Thương hiệu phổ biến
      </div>
      <div className="px-2 sm:px-8 md:px-16">
        {brands ? (
          <Carousel
            arrows
            infinite
            autoplay
            dots={false}
            slidesToShow={brands.length > 5 ? 5 : brands.length}
            responsive={[
              { breakpoint: 480, settings: { slidesToShow: 2 } },
              { breakpoint: 768, settings: { slidesToShow: 3 } },
              { breakpoint: 1024, settings: { slidesToShow: 4 } },
            ]}
            className="px-6"
          >
            {brands.map((brand, i) => (
              <Link
                key={i}
                className="h-24 md:h-32 w-auto px-1"
                href={`/fashions?brandIds=${brand.id}`}
              >
                <Image
                  src={toNextImageLink(brand.imageUrl)}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="h-full w-full"
                  alt="brand"
                />
              </Link>
            ))}
          </Carousel>
        ) : (
          <Empty />
        )}
      </div>
    </div>
  )
}
