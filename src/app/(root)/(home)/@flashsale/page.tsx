'use client'

import { Badge, Carousel, CountdownProps, Divider, Skeleton, Statistic } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import { BsFire } from 'react-icons/bs'
import { FcFlashOn } from 'react-icons/fc'
import useSWR from 'swr'
import httpService from '~/lib/http-service'
import { FLASHSALE_API } from '~/utils/api-urls'
import { formatVND, toNextImageLink } from '~/utils/common'

const { Countdown } = Statistic

export default function Flashsale() {
  const { data, isLoading, mutate } = useSWR<FlashSaleResponse>(FLASHSALE_API, httpService.get)

  // const getTimeDisabled = (key: string) => {
  //   const hours = new Date().getHours()
  //   if (hours >= 10 && hours < 12 && key === '0') return true
  //   else if (hours >= 19 && hours < 22 && (key === '0' || key === '1')) return true

  //   return false
  // }

  // const tabItems = [
  //   {
  //     label: '00:00',
  //     key: '0',
  //     children: 'Tab 1',
  //     disabled: getTimeDisabled('0'),
  //   },
  //   {
  //     label: '10:00',
  //     key: '1',
  //     children: 'Tab 2',
  //     disabled: getTimeDisabled('1'),
  //   },
  //   {
  //     label: '19:00',
  //     key: '2',
  //     children: 'Tab 3',
  //     disabled: getTimeDisabled('2'),
  //   },
  // ]

  // const getTimeFrameNow = () => {
  //   const hours = new Date().getHours()
  //   if (hours >= 0 && hours < 2) return '0'
  //   else if (hours >= 10 && hours < 12) return '1'
  //   else if (hours >= 19 && hours < 22) return '2'
  //   return undefined
  // }

  const nextTimeFrame = () => {
    const hours = new Date().getHours()
    if (hours < 10) return '10:00'
    else if (hours < 19) return '19:00'
    else if (hours < 22) return '00:00'

    return '00:00'
  }

  const onFinish: CountdownProps['onFinish'] = () => {
    mutate({
      products: [],
      endFlashSale: new Date().toISOString(),
    })
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 px-2">
        {[...new Array(6)].map((_, i) => (
          <Skeleton.Image className="h-64 w-full" active key={i} />
        ))}
      </div>
    )
  }

  return (
    <>
      <Divider>
        <div className="flex justify-center items-center gap-2 text-center">
          <div className="my-6 font-bold text-xl md:text-3xl text-orange-600 font-sans flex items-center gap-2">
            Flash Sale
            <BsFire className="text-red-600 animate-pulse" />
          </div>
          {data?.endFlashSale ? (
            <Countdown
              className="animate-pulse"
              valueStyle={{ color: 'red' }}
              value={new Date(data?.endFlashSale).getTime()}
              onFinish={onFinish}
            />
          ) : (
            'Đã kết thúc'
          )}
        </div>
        {!data?.endFlashSale ? (
          <>
            Khung giờ tiếp theo: <span className="text-red-500">{nextTimeFrame()}</span>
          </>
        ) : (
          !data?.products.length && <span>Không có sản phẩm tham gia chương trình</span>
        )}
      </Divider>
      {/* <Tabs defaultActiveKey={getTimeFrameNow()} type="card" items={tabItems} /> */}
      {!(data && data.products.length) || (
        <Carousel
          arrows
          infinite
          autoplay
          dots={false}
          slidesToShow={data.products.length < 5 ? data.products.length : 5}
          // responsive={[{ breakpoint: 768, settings: { slidesToShow: 3 } }]}
        >
          {data.products.map((item, i) => (
            <div key={i} className="px-2">
              <Link href={{ pathname: `/fashions/${item.id}`, query: { name: item.name } }}>
                <div className="bg-slate-200 w-full place-items-center">
                  <Badge.Ribbon
                    rootClassName="w-fit"
                    color="red"
                    text={
                      <div className="flex items-center">
                        <FcFlashOn className="animate-pulse" /> -{item.flashSaleDiscountPercent}%
                      </div>
                    }
                  >
                    <Image
                      width={0}
                      height={0}
                      sizes="100vw"
                      src={toNextImageLink(item.imageUrl)}
                      className="h-48 w-auto object-contain"
                      alt="banner"
                    />
                  </Badge.Ribbon>
                </div>
              </Link>
              <div className="text-center text-xl text-red-500">
                {formatVND.format(item.price - item.price * (item.flashSaleDiscountPercent / 100))}
              </div>
            </div>
          ))}
        </Carousel>
      )}
    </>
  )
}
