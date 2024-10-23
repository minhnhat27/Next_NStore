import { Carousel } from 'antd'
import Image from 'next/image'

export default function Flashsale() {
  return (
    <>
      <Carousel
        arrows
        infinite
        autoplay
        dots={false}
        slidesToShow={5}
        responsive={[{ breakpoint: 768, settings: { slidesToShow: 3 } }]}
      >
        {[...new Array(4)].map((_, i) => (
          <Image
            key={i}
            width={0}
            height={0}
            sizes="100vw"
            src="/images/Banner.png"
            className="px-2 h-auto w-auto"
            alt="banner"
          />
        ))}
      </Carousel>
    </>
  )
}
