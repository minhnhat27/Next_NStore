'use client'

import { Badge, Card, Empty, Rate, Skeleton } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import { formatCount, formatVND, toNextImageLink } from '~/utils/common'
import Heart from './heart'
import { StarFilled, StarOutlined } from '@ant-design/icons'
import { FcFlashOn } from 'react-icons/fc'

const { Meta } = Card

interface Props extends IProps {
  products?: ProductType[]
  /** rem */
  height?: number

  object?: 'cover' | 'contain' | 'fill' | 'none'
}

export default function CardProduct({ products, object = 'cover', className }: Props) {
  if (!products || products.length === 0) return <Empty className="col-span-full" />

  return products.map((product, i) => {
    const discountPercent = product.flashSaleDiscountPercent || product.discountPercent

    if (discountPercent) {
      const discountedPrice = product.price - product.price * (discountPercent / 100.0)
      return !product.id ? (
        <Card cover={<Skeleton.Image className="w-full h-36 xs:h-44 md:h-52" active />} loading />
      ) : (
        <Link
          key={i}
          href={{
            pathname: `/fashions/${product.id}`,
            query: { name: product.name },
          }}
        >
          <Badge.Ribbon
            text={
              product.flashSaleDiscountPercent ? (
                <div className="flex items-center">
                  <FcFlashOn /> -{discountPercent}%
                </div>
              ) : (
                `-${discountPercent}%`
              )
            }
            color="red"
          >
            <Card
              hoverable
              styles={{
                body: { padding: '0.75rem' },
              }}
              classNames={{ cover: className || 'h-48 xs:h-56 md:h-64' }}
              rootClassName="relative"
              cover={
                <Image
                  src={toNextImageLink(product.imageUrl)}
                  alt="Product Image"
                  loading="lazy"
                  width={0}
                  height={0}
                  sizes="100vw"
                  quality={100}
                  className={`w-full h-full border object-${object}`}
                />
              }
            >
              <Heart className="absolute top-0" productId={product.id} />
              <Meta
                title={<div className="truncate text-sm sm:text-base">{product.name}</div>}
                description={
                  <div className="space-y-1 min-h-14">
                    <div className="font-semibold text-red-500">
                      <span className="text-base sm:text-lg">
                        {formatVND.format(discountedPrice)}
                      </span>
                      <span className="ml-2 text-xs text-gray-500 line-through">
                        {formatVND.format(product.price)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <Rate
                          disabled
                          count={1}
                          value={1}
                          character={!product.rating ? <StarOutlined /> : <StarFilled />}
                        />{' '}
                        <span className="text-gray-500 text-xs">
                          {product.rating ? (
                            <>
                              {product.rating}{' '}
                              <span className="text-[0.6rem] text-gray-400">
                                ({formatCount(product.ratingCount)})
                              </span>
                            </>
                          ) : null}
                        </span>
                      </div>
                      <div className="text-[0.65rem] 2xl:text-base text-slate-600">
                        Đã bán {product.sold}
                      </div>
                    </div>
                  </div>
                }
              />
            </Card>{' '}
          </Badge.Ribbon>
        </Link>
      )
    }
    return !product.id ? (
      <Card cover={<Skeleton.Image className="w-full h-36 xs:h-44 md:h-52" active />} loading />
    ) : (
      <Link key={i} href={{ pathname: `/fashions/${product.id}`, query: { name: product.name } }}>
        <Card
          loading={!product.id}
          hoverable
          styles={{
            body: { padding: '0.75rem' },
          }}
          classNames={{ cover: className || 'h-48 xs:h-56 md:h-64' }}
          rootClassName="relative"
          cover={
            <>
              <Image
                src={toNextImageLink(product.imageUrl)}
                alt="Product Image"
                loading="lazy"
                width={0}
                height={0}
                sizes="100vw"
                quality={100}
                className={`w-full h-full border object-${object}`}
              />
            </>
          }
        >
          <Heart className="absolute top-0" productId={product.id} />
          <Meta
            title={<div className="truncate text-sm sm:text-base">{product.name}</div>}
            description={
              <div className="space-y-1 min-h-14">
                <div className="font-semibold text-base sm:text-lg text-red-500">
                  {formatVND.format(product.price)}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <Rate
                      disabled
                      count={1}
                      value={1}
                      character={!product.rating ? <StarOutlined /> : <StarFilled />}
                    />{' '}
                    <span className="text-gray-500 text-xs">
                      {product.rating ? (
                        <>
                          {product.rating}{' '}
                          <span className="text-[0.6rem] text-gray-400">
                            ({formatCount(product.ratingCount)})
                          </span>
                        </>
                      ) : null}
                    </span>
                  </div>
                  <div className="text-[0.65rem] 2xl:text-base text-slate-600">
                    Đã bán {product.sold}
                  </div>
                </div>
              </div>
            }
          />
        </Card>
      </Link>
    )
  })
}
