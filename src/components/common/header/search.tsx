import { AutoComplete, AutoCompleteProps, Drawer, Empty, Input } from 'antd'
import debounce from 'debounce'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import useSWRImmutable from 'swr/immutable'
import httpService from '~/lib/http-service'
import { FASHION_API } from '~/utils/api-urls'
import { toNextImageLink } from '~/utils/common'

export default function Search() {
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>()
  const router = useRouter()

  const { data, isLoading } = useSWRImmutable<ProductType[]>(
    searchText ? [FASHION_API + '/search', { key: searchText }] : undefined,
    ([url, params]) => httpService.getWithParams(url, params),
  )

  const [options, setOptions] = useState<AutoCompleteProps['options']>([])

  useEffect(() => {
    if (data) setOptions(data.map((product) => searchResult(product)))
  }, [data])

  const onSearch = debounce(async (value: string) => {
    if (value) {
      if (value !== searchText) setSearchText(value)
    } else setOptions([])
  }, 800)

  const handleSearch = (value: string) => {
    console.log('handle search')

    if (value) {
      setShowSearch(false)
      router.push(`/fashions?key=${value}`)
    }
  }

  const onSelect = (product: ProductType) => {
    console.log('on select')

    setShowSearch(false)
    router.push(`/fashions/${product.id}/?name=${product.name}`)
  }

  const searchResult = (product: ProductType) => ({
    // value: product.name,
    label: (
      <div onClick={() => onSelect(product)} className="inline-flex gap-2">
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
    ),
  })

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
        <AutoComplete
          listHeight={300}
          options={options}
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
      </Drawer>
    </>
  )
}
