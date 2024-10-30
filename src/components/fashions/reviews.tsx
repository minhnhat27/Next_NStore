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
import { initPagination } from '~/utils/initType'

interface Props {
  product: ProductDetailsType
}

enum ReviewFilters {
  ALL,
  ONE,
  TWO,
  THREE,
  FOUR,
  FIVE,
  HAVECOMMENT,
  HAVEPICTURE,
}

export default function Reviews({ product }: Props) {
  const [beginGetReviews, setBeginGetReviews] = useState<boolean>(false)

  // const [currentStar, setCurrentStar] = useState<number>(0)
  const [isShowMore, setIsShowMore] = useState<boolean>(true)

  const [params, setParams] = useState<PaginationType & { rate: ReviewFilters }>({
    ...initPagination,
    rate: 0,
    pageSize: 5,
  })

  const [loading, setLoading] = useState<boolean>(true)
  const [visible, setVisible] = useState<boolean>(false)
  const [currentImage, setCurrentImage] = useState<string>()

  const [reviews, setReviews] = useState<ProductReviewsType[]>([])
  const [list, setList] = useState<ProductReviewsType[]>([])

  const { data, isLoading } = useSWRImmutable<PagedType<ProductReviewsType>>(
    beginGetReviews ? [FASHION_API + `/${product.id}/reviews`, params] : null,
    ([url, params]) => httpService.getWithParams(url, params),
  )

  const onBeginGetReviews = () => setBeginGetReviews(true)

  const onViewImage = (url: string) => {
    setCurrentImage(url)
    setVisible(true)
  }

  useEffect(() => {
    if (data) {
      if (isShowMore) {
        setList((pre) => {
          const newData = pre.concat(data.items)
          setReviews(newData)
          return newData
        })
      } else {
        setList(data.items)
        setReviews(data.items)
      }
    }
  }, [data, isShowMore])

  useEffect(() => {
    if (!isLoading && beginGetReviews) setLoading(false)
  }, [isLoading, beginGetReviews])

  const onLoadMore = () => {
    setIsShowMore(true)
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

  const onChangeRate = (rate: ReviewFilters) => {
    setIsShowMore(false)
    setParams({ ...initPagination, pageSize: 5, rate })
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
            <pre className="col-span-5">
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
            </pre>
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
                    if (i === ReviewFilters.ALL)
                      return (
                        <Button
                          key={i}
                          onClick={() => onChangeRate(i)}
                          disabled={isLoading}
                          type={params.rate === i ? 'primary' : 'default'}
                          className="rounded-sm md:px-6 m-1"
                        >
                          Tất cả
                        </Button>
                      )
                    return (
                      <Button
                        key={i}
                        disabled={isLoading}
                        onClick={() => onChangeRate(i)}
                        type={params.rate === i ? 'primary' : 'default'}
                        className="rounded-sm md:px-6 m-1"
                      >
                        {i} Sao
                      </Button>
                    )
                  })}
                </div>
                <Button
                  disabled={isLoading}
                  onClick={() => onChangeRate(ReviewFilters.HAVECOMMENT)}
                  type={params.rate === ReviewFilters.HAVECOMMENT ? 'primary' : 'default'}
                  className="rounded-sm md:px-6 m-1"
                >
                  Có bình luận
                </Button>
                <Button
                  disabled={isLoading}
                  onClick={() => onChangeRate(ReviewFilters.HAVEPICTURE)}
                  type={params.rate === ReviewFilters.HAVEPICTURE ? 'primary' : 'default'}
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
                <div className="flex gap-4 mt-2">
                  {item.imagesUrls.map((url, i) => (
                    <Image
                      key={i}
                      width={0}
                      height={0}
                      quality={100}
                      sizes="20vw"
                      src={toNextImageLink(url)}
                      onClick={() => onViewImage(url)}
                      alt="review"
                      className="w-24 h-24 object-cover cursor-pointer"
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

  // console.log(product.id)

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
