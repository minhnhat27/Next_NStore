import { Carousel } from 'antd'
import Image from 'next/image'
import { toNextImageLink } from '~/utils/common'

interface IProps {
  images: string[]
}

export default function Banner({ images }: IProps) {
  return (
    <Carousel arrows autoplay className="h-auto lg:max-h-screen">
      {images.map((url, i) => (
        <Image
          key={i}
          width={0}
          height={0}
          sizes="100vw"
          priority
          quality={100}
          src={toNextImageLink(url)}
          className="h-auto lg:max-h-screen"
          alt="banner"
        />
      ))}
    </Carousel>
  )
}
