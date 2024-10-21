'use client'

import { Image, Carousel } from 'antd'
import React from 'react'

export default function FlashSale() {
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
        <Image src="/images/Banner.png" className="px-2" preview={false} alt="banner" />
        <Image src="/images/Banner.png" className="px-2" preview={false} alt="banner" />
        <Image src="/images/Banner.png" className="px-2" preview={false} alt="banner" />
        <Image src="/images/Banner.png" className="px-2" preview={false} alt="banner" />
        <Image src="/images/Banner.png" className="px-2" preview={false} alt="banner" />
      </Carousel>
    </>
  )
}
