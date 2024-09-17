import { Divider, Image, Card, Carousel } from 'antd'
import React from 'react'

const { Meta } = Card

const FlashSale: React.FC = () => {
  return (
    <>
      <Divider>
        <div className="text-center animate-pulse my-6 uppercase font-semibold text-xl md:text-2xl text-orange-500">
          Flash Sale
        </div>
      </Divider>
      <Carousel
        arrows
        infinite
        autoplay
        dots={false}
        slidesToShow={5}
        responsive={[{ breakpoint: 768, settings: { slidesToShow: 3 } }]}
      >
        <Image src="/images/Banner.png" className="px-2" preview={false} alt="banner" />
        <Image src="/images/Banner.png" className="px-2" preview={false} alt="banner" />
        <Image src="/images/Banner.png" className="px-2" preview={false} alt="banner" />
        <Image src="/images/Banner.png" className="px-2" preview={false} alt="banner" />
        <Image src="/images/Banner.png" className="px-2" preview={false} alt="banner" />
      </Carousel>
    </>
  )
}
export default FlashSale
