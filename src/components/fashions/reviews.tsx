import { Avatar, List, Rate, Image as AntdImage, Tabs, TabsProps, Button, Skeleton } from 'antd'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import useSWRImmutable from 'swr/immutable'
import httpService from '~/lib/http-service'
import { FASHION_API } from '~/utils/api-urls'
import { toNextImageLink } from '~/utils/common'

interface IProps {
  id: number
  description?: string
}

export default function Reviews({ id, description }: IProps) {
  const [beginGetReviews, setBeginGetReviews] = useState<boolean>(false)
  const [params, setParams] = useState<PaginationType>({ page: 1, pageSize: 3 })

  const [loading, setLoading] = useState<boolean>(true)
  const [visible, setVisible] = useState<boolean>(false)
  const [currentImage, setCurrentImage] = useState<string>()

  const [reviews, setReviews] = useState<ProductReviewsType[]>([])
  const [list, setList] = useState<ProductReviewsType[]>([])

  const { data, isLoading } = useSWRImmutable<PagedType<ProductReviewsType>>(
    beginGetReviews && [FASHION_API + `/${id}/reviews`, params],
    ([url, params]) => httpService.getWithParams(url, params),
  )

  const onBeginGetReviews = () => setBeginGetReviews(true)

  const onViewImage = (url: string) => {
    setCurrentImage(url)
    setVisible(true)
  }

  useEffect(() => {
    if (data) {
      const newData = list.concat(data.items)
      setList(newData)
      setReviews(newData)
    }
  }, [data])

  useEffect(() => {
    if (!isLoading && beginGetReviews) setLoading(false)
  }, [isLoading, beginGetReviews])

  const onLoadMore = () => {
    setReviews(
      list.concat([...new Array(3)].map(() => ({ id: '', star: 5, username: '', imagesUrls: [] }))),
    )
    setParams((pre) => ({ ...pre, page: pre.page++ }))
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
          <div className="grid grid-cols-12">
            <div>Mô tả</div>
            <div className="col-span-11">
              {description || 'Chưa có mô tả'}
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
            {/* <pre className="col-span-11">{description ?? 'Chưa có mô tả'}</pre> */}
          </div>
          <div className="grid grid-cols-12">
            <div>Chất liệu</div>
            <div className="col-span-11">95% Polyester 5% Spandex</div>
          </div>
        </div>
      ),
    },
    {
      key: '2',
      label: <div onClick={onBeginGetReviews}>Đánh giá sản phẩm</div>,
      children: (
        <List
          loading={loading}
          itemLayout="horizontal"
          loadMore={loadMore}
          dataSource={reviews}
          renderItem={(item, index) => (
            <List.Item>
              <Skeleton avatar title={false} loading={!item.id} active>
                <List.Item.Meta
                  avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                  title={<a href="https://ant.design">{item.username}</a>}
                  description={<Rate disabled value={item.star} />}
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
                    sizes="10vw"
                    src={toNextImageLink(url)}
                    onClick={() => onViewImage(url)}
                    alt="review"
                    className="w-auto h-auto cursor-pointer"
                  />
                ))}
              </div>
            </List.Item>
          )}
        />
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
