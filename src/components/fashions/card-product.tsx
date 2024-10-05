import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import { Badge, Card, Empty, Rate } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import useAuth from '~/hooks/useAuth'
import useFavorite from '~/hooks/useFavorites'
import { formatVND, toNextImageLink } from '~/utils/common'

const { Meta } = Card

interface IProps {
  products?: ProductType[]
}

export default function CardProduct({ products }: IProps) {
  const { state } = useAuth()
  const { favorites, addFavorite, removeFavorite } = useFavorite()

  if (!products) return <Empty />

  return products.map((product, i) => {
    if (product.discountPercent) {
      const discountedPrice =
        product.price - product.price * ((product.discountPercent ?? 0) / 100.0)
      return (
        <Link
          key={i}
          href={{
            pathname: `/fashions/${product.id}`,
            query: { name: product.name },
          }}
        >
          <Badge.Ribbon text={`-${product.discountPercent}%`} color="red">
            <Card
              hoverable
              className="h-96"
              styles={{
                cover: { height: '70%' },
                body: { height: '30%', padding: '1rem' },
              }}
              cover={
                <Image
                  src={toNextImageLink(product.imageUrl)}
                  alt="Product Image"
                  width={0}
                  height={0}
                  sizes="100vw"
                  priority={i < 5}
                  quality={100}
                  className="w-full h-full object-cover border"
                />
              }
            >
              <Meta
                title={product.name}
                description={
                  <div className="space-y-1">
                    <div className="font-semibold text-red-500">
                      <span className="text-lg">{formatVND.format(discountedPrice)}</span>
                      <span className="ml-2 text-xs text-gray-500 line-through">
                        {formatVND.format(product.price)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <Rate count={1} value={1} /> <span className="text-gray-400">4.8</span>
                      </div>
                      <div className="inline-flex gap-1 text-lg text-red-500">
                        {state.isAuthenticated &&
                          (favorites.includes(product.id) ? (
                            <HeartFilled
                              onClick={async (e) => {
                                e.preventDefault()
                                await removeFavorite(product.id)
                              }}
                              className="transition-transform hover:scale-125 px-1"
                            />
                          ) : (
                            <HeartOutlined
                              onClick={async (e) => {
                                e.preventDefault()
                                await addFavorite(product.id)
                              }}
                              className="transition-transform hover:scale-125 px-1"
                            />
                          ))}
                        <div className="text-xs 2xl:text-base text-slate-600">
                          Đã bán {product.sold}
                        </div>
                      </div>
                    </div>
                  </div>
                }
              />
            </Card>
          </Badge.Ribbon>
        </Link>
      )
    }
    return (
      <Link key={i} href={{ pathname: `/fashions/${product.id}`, query: { name: product.name } }}>
        <Card
          hoverable
          className="h-96"
          styles={{
            cover: { height: '70%' },
            body: { height: '30%', padding: '1rem' },
          }}
          cover={
            <>
              <Image
                src={toNextImageLink(product.imageUrl)}
                alt="Product Image"
                width={0}
                height={0}
                sizes="100vw"
                priority={i < 5}
                quality={100}
                className="w-full h-full object-cover border"
              />
            </>
          }
        >
          <Meta
            title={product.name}
            description={
              <div className="space-y-1">
                <div className="font-semibold text-lg text-red-500">
                  {formatVND.format(product.price)}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <Rate count={1} value={1} /> <span className="text-gray-400">4.8</span>
                  </div>
                  <div className="inline-flex gap-1 text-lg text-red-500">
                    {state.isAuthenticated &&
                      (favorites.includes(product.id) ? (
                        <HeartFilled
                          onClick={async (e) => {
                            e.preventDefault()
                            await removeFavorite(product.id)
                          }}
                          className="transition-transform hover:scale-125 px-1"
                        />
                      ) : (
                        <HeartOutlined
                          onClick={async (e) => {
                            e.preventDefault()
                            await addFavorite(product.id)
                          }}
                          className="transition-transform hover:scale-125 px-1"
                        />
                      ))}
                    <div className="text-xs 2xl:text-base text-slate-600">
                      Đã bán {product.sold}
                    </div>
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
