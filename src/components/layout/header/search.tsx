import { CameraOutlined } from '@ant-design/icons'
import {
  App,
  AutoComplete,
  AutoCompleteProps,
  Button,
  Drawer,
  Empty,
  Input,
  Spin,
  Upload,
  UploadProps,
} from 'antd'
import debounce from 'debounce'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import useSWRImmutable from 'swr/immutable'
import CardProduct from '~/components/ui/card-product'
import httpService from '~/lib/http-service'
import { FASHION_API } from '~/utils/api-urls'
import { showError, toNextImageLink } from '~/utils/common'

export default function Search() {
  const { message } = App.useApp()
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>()
  const router = useRouter()

  const [loading, setLoading] = useState<boolean>(false)
  const [imageSearchResult, setImageSearchResult] = useState<ProductType[]>([])

  const { data, isLoading } = useSWRImmutable<ProductType[]>(
    searchText ? [FASHION_API + '/search', { key: searchText }] : undefined,
    ([url, params]) => httpService.getWithParams(url, params),
  )

  const [options, setOptions] = useState<AutoCompleteProps['options']>([])

  const showSearchResult = (product: ProductType) => ({
    label: (
      <Link
        href={{ pathname: `/fashions/${product.id}`, query: { name: product.name } }}
        onClick={() => setShowSearch(false)}
        className="text-black"
      >
        <div className="w-full inline-flex gap-2">
          <div className="w-20 h-20 flex justify-center items-center">
            <Image
              height={0}
              width={0}
              sizes="100vw"
              className="h-auto w-auto object-contain object-center"
              src={toNextImageLink(product.imageUrl)}
              alt={product.name}
            />
          </div>
          <div className="line-clamp-2">{product.name}</div>
        </div>
      </Link>
    ),
  })

  useEffect(() => {
    if (data) setOptions(data.map((product) => showSearchResult(product)))
  }, [data])

  const onSearch = debounce(async (value: string) => {
    if (value) {
      if (value !== searchText) setSearchText(value)
    } else setOptions([])
  }, 800)

  const handleSearch = (value: string) => {
    if (value) {
      setShowSearch(false)
      router.push(`/fashions?key=${value}`)
    }
  }

  const handleChangeImage: UploadProps['onChange'] = async ({ file }) => {
    try {
      setLoading(true)
      const formData = new FormData()
      const imageFile = file as unknown as Blob
      formData.append('image', imageFile)

      const data: ProductType[] = await httpService.post(FASHION_API + '/search/image', formData)
      setImageSearchResult(data)
    } catch (error) {
      message.error(showError(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <FaSearch
        onClick={() => setShowSearch(!showSearch)}
        className="flex-shrink-0 transition-colors text-slate-400 hover:text-slate-500 "
      />
      <Drawer
        title="Tìm kiếm"
        placement="top"
        onClose={() => setShowSearch(false)}
        open={showSearch}
        styles={{ wrapper: { height: 'fit-content' } }}
        destroyOnClose
        afterOpenChange={() => {
          setSearchText(undefined)
          setOptions([])
        }}
      >
        <div className="flex items-center gap-2">
          <AutoComplete
            listHeight={300}
            options={options}
            disabled={loading}
            onSearch={onSearch}
            notFoundContent={searchText && !isLoading && <Empty />}
            className="w-full"
          >
            <Input.Search
              loading={isLoading}
              onSearch={handleSearch}
              placeholder="Nhập sản phẩm cần tìm"
              size="large"
              allowClear
            />
          </AutoComplete>
          <Upload beforeUpload={() => false} showUploadList={false} onChange={handleChangeImage}>
            <Button disabled={loading} size="large" className="mt-2">
              <CameraOutlined className="text-xl" />
            </Button>
          </Upload>
        </div>
        {loading && (
          <div className="mt-4 flex justify-center">
            <Spin />
          </div>
        )}
        {!imageSearchResult.length || (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-4">
            <CardProduct products={imageSearchResult} />
          </div>
        )}
      </Drawer>
    </>
  )
}
