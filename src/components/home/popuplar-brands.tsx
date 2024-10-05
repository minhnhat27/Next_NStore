'use client'

import { Carousel, Divider, Skeleton } from 'antd'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import useSWRImmutable from 'swr/immutable'
import httpService from '~/lib/http-service'
import { BRAND_API } from '~/utils/api-urls'
import { toNextImageLink } from '~/utils/common'

export default function PopularBrands() {
  const router = useRouter()

  const { data, isLoading } = useSWRImmutable<BrandType[]>(BRAND_API, httpService.get)

  return (
    <div className="bg-gray-200 py-6">
      <div className="text-center pb-6 font-semibold text-xl md:text-3xl text-blue-950 font-sans">
        Thương hiệu phổ biến
      </div>
      <div className="px-8 md:px-16">
        {isLoading ? (
          <div className="grid grid-cols-5 gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton.Image className="h-28 w-full" active key={i} />
            ))}
          </div>
        ) : (
          <Carousel
            arrows
            infinite
            autoplay
            dots={false}
            slidesToShow={5}
            responsive={[
              { breakpoint: 480, settings: { slidesToShow: 2 } },
              { breakpoint: 768, settings: { slidesToShow: 3 } },
              { breakpoint: 1024, settings: { slidesToShow: 4 } },
            ]}
          >
            {data?.map((brand, i) => (
              <Image
                key={i}
                src={toNextImageLink(brand.imageUrl)}
                width={0}
                height={0}
                sizes="100vw"
                className="h-24 md:h-32 w-auto px-1 cursor-pointer"
                alt="brand"
                onClick={() => router.push(`/fashions?brandIds=${brand.id}`)}
              />
            ))}
          </Carousel>
        )}
      </div>
    </div>
  )
}
