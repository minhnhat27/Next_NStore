import {
  Avatar,
  List,
  Rate,
  Image as AntdImage,
  Tabs,
  TabsProps,
  Button,
  Skeleton,
  Divider,
  Card,
} from 'antd'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import useSWRImmutable from 'swr/immutable'
import httpService from '~/lib/http-service'
import { Gender } from '~/types/enum'
import { FASHION_API } from '~/utils/api-urls'
import { formatDateTime, rateDesc, toNextImageLink } from '~/utils/common'

interface IProps {
  product: ProductDetailsType
}

export default function Reviews({ product }: IProps) {
  const [beginGetReviews, setBeginGetReviews] = useState<boolean>(false)
  const [params, setParams] = useState<PaginationType>({ page: 1, pageSize: 3 })

  const [loading, setLoading] = useState<boolean>(true)
  const [visible, setVisible] = useState<boolean>(false)
  const [currentImage, setCurrentImage] = useState<string>()

  const [reviews, setReviews] = useState<ProductReviewsType[]>([])
  const [list, setList] = useState<ProductReviewsType[]>([])

  const [currentStar, setCurrentStar] = useState<number>(0)
  // const [hasPicture, setHasPicture] = useState<boolean>(false)

  // console.log(product.id)

  const { data, isLoading } = useSWRImmutable<PagedType<ProductReviewsType>>(
    beginGetReviews && [FASHION_API + `/${product.id}/reviews`, params],
    ([url, params]) => httpService.getWithParams(url, params),
  )

  const onBeginGetReviews = () => setBeginGetReviews(true)

  const onViewImage = (url: string) => {
    setCurrentImage(url)
    setVisible(true)
  }

  useEffect(() => {
    if (data) {
      setList((pre) => {
        const newData = pre.concat(data.items)
        setReviews(newData)
        return newData
      })
    }
  }, [data])

  useEffect(() => {
    if (!isLoading && beginGetReviews) setLoading(false)
  }, [isLoading, beginGetReviews])

  const onLoadMore = () => {
    setReviews(
      list.concat(
        [...new Array(3)].map(() => ({
          id: '',
          star: 5,
          username: '',
          imagesUrls: [],
          createdAt: '',
          variant: '',
        })),
      ),
    )
    setParams((pre) => ({ ...pre, page: pre.page + 1 }))
  }

  const loadMore =
    !isLoading && data && data.totalItems > reviews.length ? (
      <div className="pt-4 flex justify-center">
        <Button type="primary" onClick={onLoadMore}>
          Xem thêm
        </Button>
      </div>
    ) : null

  const detailItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'Chi tiết sản phẩm',
      children: (
        <div className="space-y-4">
          <div className="grid grid-cols-6 gap-2">
            <div className="col-span-1">Danh mục</div>
            <div className="col-span-5">{product.categoryName}</div>
            <div className="col-span-1">Chất liệu</div>
            <div className="col-span-5">{product.materialNames.map((e) => e).join(', ')}</div>
            <div className="col-span-1">Giới tính</div>
            <div className="col-span-5">{Gender[product.gender]}</div>
            <div className="col-span-1">Thương hiệu</div>
            <div className="col-span-5">{product.brandName}</div>
            <div className="col-span-1">Mô tả</div>
            <div className="col-span-5">
              {product.description || 'Chưa có mô tả'}
              {/* {description
                  ? description?.split('\n').length > 5 && !isShowMore
                    ? description
                        ?.split('\n')
                        .slice(0, 5)
                        .map((row, i) => <div key={i}>{row}</div>)
                    : description?.split('\n').map((row, i) => <div key={i}>{row}</div>)
                  : 'Chưa có mô tả'}
                {description && description?.split('\n').length > 5 && (
                  <Button
                    type="link"
                    className="p-0"
                    onClick={() => {
                      setIsShowMore && setIsShowMore(!isShowMore)
                    }}
                  >
                    {!isShowMore ? 'Xem thêm' : 'Thu gọn'}
                  </Button>
                )} */}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: '2',
      label: <div onClick={onBeginGetReviews}>Đánh giá sản phẩm</div>,
      children: (
        <>
          <Card className="rounded-sm">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex flex-col gap-2">
                <div className="text-xl">
                  <span className="text-3xl">{product.rating}</span> trên 5{' '}
                </div>
                <Rate
                  className="text-red-500 text-nowrap"
                  allowHalf
                  disabled={true}
                  value={product.rating}
                />
              </div>
              <div className="">
                <div>
                  {[...new Array(6)].map((_, i) => {
                    if (i === 0)
                      return (
                        <Button
                          key={i}
                          onClick={() => setCurrentStar(i)}
                          type={currentStar === i ? 'primary' : 'default'}
                          className="rounded-sm md:px-6 m-1"
                        >
                          Tất cả
                        </Button>
                      )
                    return (
                      <Button
                        key={i}
                        onClick={() => setCurrentStar(i)}
                        type={currentStar === i ? 'primary' : 'default'}
                        className="rounded-sm md:px-6 m-1"
                      >
                        {i} Sao
                      </Button>
                    )
                  })}
                </div>
                <Button
                  onClick={() => setCurrentStar(6)}
                  type={currentStar === 6 ? 'primary' : 'default'}
                  className="rounded-sm md:px-6 m-1"
                >
                  Có bình luận
                </Button>
                <Button
                  onClick={() => setCurrentStar(7)}
                  type={currentStar === 7 ? 'primary' : 'default'}
                  className="rounded-sm md:px-6 m-1"
                >
                  Có hình ảnh
                </Button>
              </div>
            </div>
          </Card>
          <List
            loading={loading}
            itemLayout="horizontal"
            loadMore={loadMore}
            dataSource={reviews}
            renderItem={(item, index) => (
              <List.Item>
                <Skeleton avatar title={false} loading={!item.id} active>
                  <List.Item.Meta
                    avatar={
                      <Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />
                    }
                    title={
                      <div className="text-gray-500">
                        <span className="text-sm">{item.username}</span>
                        <Divider type="vertical" />
                        <span className="text-xs">{formatDateTime(item.createdAt)}</span>
                        <div className="text-sm">Phân loại: {item.variant}</div>
                      </div>
                    }
                    description={
                      <>
                        <Rate className="text-base" disabled value={item.star} />{' '}
                        {item.star ? (
                          <span className="text-xs">{rateDesc[item.star - 1]}</span>
                        ) : null}
                      </>
                    }
                  />
                </Skeleton>
                {item.description}
                <div className="flex gap-2 mt-2">
                  {item.imagesUrls.map((url, i) => (
                    <Image
                      key={i}
                      width={0}
                      height={0}
                      quality={100}
                      sizes="100vw"
                      src={toNextImageLink(url)}
                      onClick={() => onViewImage(url)}
                      alt="review"
                      className="w-32 h-32 object-cover cursor-pointer"
                    />
                  ))}
                </div>
              </List.Item>
            )}
          />
        </>
      ),
    },
  ]

  return (
    <>
      <AntdImage
        width={0}
        hidden
        preview={{
          visible,
          src: toNextImageLink(currentImage),
          onVisibleChange: (value) => setVisible(value),
        }}
      />
      <Tabs
        className="mt-4 border px-4 pb-4 bg-white"
        defaultActiveKey="1"
        type="line"
        size="large"
        items={detailItems}
      />
    </>
  )
}
