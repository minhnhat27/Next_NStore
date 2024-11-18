import { Carousel } from 'antd'
import Image from 'next/image'
import httpService from '~/lib/http-service'
import { HOME_API } from '~/utils/api-urls'
import { toNextImageLink } from '~/utils/common'

export const revalidate = 7200

const getBanner = async (): Promise<string[]> => {
  try {
    const data = await httpService.get(process.env.API_URL + HOME_API + '/banner')
    return data ?? []
  } catch (error) {
    return []
  }
}

export default async function Banner() {
  const images = await getBanner()

  return (
    <Carousel arrows autoplay className="transition-all h-48 sm:h-screen--header 2xl:h-[36rem]">
      {images.map((url, i) => (
        <Image
          key={i}
          width={0}
          height={0}
          sizes="100vw"
          priority
          quality={100}
          src={toNextImageLink(url)}
          className="transition-all h-48 sm:h-screen--header 2xl:h-[36rem]"
          alt="banner"
        />
      ))}
    </Carousel>
  )
}
