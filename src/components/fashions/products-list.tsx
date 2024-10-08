'use client'

import { FunnelPlotOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons'
import {
  Badge,
  Button,
  ButtonProps,
  Card,
  Checkbox,
  CheckboxOptionType,
  Drawer,
  Flex,
  Pagination,
  PaginationProps,
  Rate,
  Result,
  Select,
  Skeleton,
  Slider,
  Typography,
} from 'antd'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWRImmutable from 'swr/immutable'
import { useRealTimeParams } from '~/hooks/useRealTimeParams'
import httpService from '~/lib/http-service'
import { FASHION_API } from '~/utils/api-urls'
import CardProduct from './card-product'

const { Title } = Typography

const sortOpts = [
  { value: '0', label: 'Bán chạy' },
  { value: '1', label: 'Giá từ thấp đến cao' },
  { value: '2', label: 'Giá từ cao đến thấp' },
  { value: '3', label: 'Mới nhất' },
]
const genderOpts = [
  { value: '0', label: 'Nam' },
  { value: '1', label: 'Nữ' },
  { value: '2', label: 'Unisex' },
]

const initFilters: FilterType = {
  sorter: '0',
  page: 1,
  pageSize: 10,
}

enum FilterTypes {
  SORTER = 'sorter',
  CATEGORIES = 'categoryIds',
  BRANDS = 'brandIds',
  MATERIALS = 'materialIds',
  GENDERS = 'genders',
  PRICERANGE = 'priceRange',
  RATING = 'rating',
  SALES = 'sales',
  DISCOUNT = 'discount',
  FLASHSALE = 'flashsale',
}

interface IProps {
  brands: ProductAttrsType[]
  categories: ProductAttrsType[]
  material: ProductAttrsType[]
}

export default function Products({ brands, categories, material }: IProps) {
  const searchParams = useSearchParams()
  const key = searchParams.get('key')
  const { setRealTimeParams } = useRealTimeParams()

  const [filterOpen, setFilterOpen] = useState<boolean>(false)

  const [filters, setFilters] = useState<FilterType>(() => {
    var p = { ...initFilters }

    const urlParams = new URLSearchParams(searchParams)
    urlParams?.forEach((value, key) => {
      if (key === 'materialIds' || key === 'categoryIds' || key === 'brandIds') {
        p[key] = value.split(',').map((v) => v.trim())
      } else if (key === 'maxPrice' || key === 'minPrice' || key === 'page' || key === 'pageSize') {
        p[key] = parseInt(value)
      } else p[key] = value
    })

    p.priceRange = p.maxPrice
      ? [p.minPrice ?? 0, p.maxPrice]
      : p.minPrice
      ? [p.minPrice]
      : undefined

    return p
  })

  const [brandOptions, setBrandOptions] = useState<CheckboxOptionType[]>([])
  const [categoryOptions, setCategoryOptions] = useState<CheckboxOptionType[]>([])
  const [materialOptions, setMaterialOptions] = useState<CheckboxOptionType[]>([])

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  const filtersToParams = (filters: FilterType) => {
    let newParams: FilterType = { ...filters }
    if (!filters.rating) delete newParams.rating

    if (filters.priceRange && filters.priceRange[0] === filters.priceRange[1]) {
      newParams.minPrice = filters.priceRange[0]
    } else {
      if (filters.priceRange && filters.priceRange[0]) {
        newParams.minPrice = filters.priceRange[0]
      }
      if (filters.priceRange && filters.priceRange[1]) {
        newParams.maxPrice = filters.priceRange[1]
      }
    }
    delete newParams.priceRange

    return newParams
  }

  const paramsToFilters = (params: FilterType) => {
    let newFilters: FilterType = { ...params }

    if (params.minPrice && params.maxPrice) {
      newFilters.priceRange = [params.minPrice, params.maxPrice]
    } else if (params.minPrice) {
      newFilters.priceRange = [params.minPrice]
    } else if (params.maxPrice) {
      newFilters.priceRange = [0, params.maxPrice]
    }
    delete newFilters.minPrice
    delete newFilters.maxPrice

    return newFilters
  }

  const countFilter = (filters: FilterType): number => {
    filters = filtersToParams(filters)

    const count = Object.values(filters).reduce((pre, value) => {
      if (Array.isArray(value)) {
        return pre + value.length
      }
      return value !== null && value !== undefined ? pre + 1 : pre
    }, 0)

    let minus = 3
    if (filters.key || filters.key === '') minus += 1

    return count >= minus ? count - minus : count
  }

  const [params, setParams] = useState<FilterType>(filtersToParams(filters))

  const { data, isLoading } = useSWRImmutable<PagedType<ProductType>>(
    [FASHION_API, params],
    ([url, params]) => httpService.getWithParams(url, params),
  )

  useEffect(() => {
    const newBrands: CheckboxOptionType[] = brands.map((item) => ({
      label: item.name,
      value: item.id.toString(),
    }))
    setBrandOptions(newBrands)
  }, [brands])

  useEffect(() => {
    const newCategories: CheckboxOptionType[] = categories.map((item) => ({
      label: item.name,
      value: item.id.toString(),
    }))
    setCategoryOptions(newCategories)
  }, [categories])

  useEffect(() => {
    const newMaterials: CheckboxOptionType[] = material.map((item) => ({
      label: item.name,
      value: item.id.toString(),
    }))
    setMaterialOptions(newMaterials)
  }, [material])

  const toggleFilterOpen = () => {
    setFilterOpen(!filterOpen)
    const p = filtersToParams(filters)

    if (JSON.stringify(params) != JSON.stringify(p)) {
      setFilters(paramsToFilters(params))
    }
  }

  const getFilters = (filters: FilterType, p?: number, pSize?: number) => {
    let newParams: FilterType = filtersToParams(filters)

    newParams.page = p ?? currentPage
    newParams.pageSize = pSize ?? pageSize

    setParams(newParams)

    const filteredFilters = Object.fromEntries(
      Object.entries(newParams).filter(
        ([key, value]) => value !== initFilters[key as keyof FilterType],
      ),
    )
    setRealTimeParams(filteredFilters)
  }

  useEffect(() => {
    if (key) {
      const newFilters = { ...filters, key: key }
      setFilters(newFilters)
      getFilters(newFilters)
    }
  }, [key])

  const onChangeFilters = (
    type: FilterTypes,
    values: string | string[] | number | number[] | boolean,
  ) => {
    const newFilters = {
      ...filters,
      [type]: values,
    }

    if (Array.isArray(values) && values.length <= 0) {
      delete newFilters[type]
    }
    setFilters(newFilters)
    if (type === FilterTypes.SORTER) getFilters(newFilters)
  }

  const clearFilter: ButtonProps['onClick'] = () => setFilters(initFilters)

  const handleFilters: ButtonProps['onClick'] = () => {
    setCurrentPage(1)
    setPageSize(10)

    getFilters(filters, 1, 10)
    setFilterOpen(false)
  }

  const onChangeCurrentPage: PaginationProps['onChange'] = (page, pageSize) => {
    setCurrentPage(page)
    setPageSize(pageSize)
    getFilters(filters, page, pageSize)
  }

  if (isLoading)
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton.Image key={i} className="h-80 w-full" active />
        ))}
      </div>
    )

  return (
    <>
      <div className="py-2 flex flex-col sm:flex-row sm:justify-between">
        <Title level={3}>Tất cả sản phẩm</Title>
        <Flex align="center" className="space-x-2">
          <Select
            disabled={data && data.items.length <= 0}
            placeholder="Sắp xếp theo: "
            labelRender={(item) => 'Sắp xếp: ' + item.label}
            value={filters.sorter}
            onChange={(e) => onChangeFilters(FilterTypes.SORTER, e)}
            className="w-full sm:w-64"
            rootClassName="z-10"
            options={sortOpts}
          />
          <Badge count={countFilter(filters)}>
            <Button onClick={toggleFilterOpen}>
              <FunnelPlotOutlined /> Bộ lọc
            </Button>
          </Badge>
        </Flex>
      </div>
      {data && data.items.length <= 0 ? (
        <Result
          className="py-0"
          status="404"
          title="Không tìm thấy sản phẩm phù hợp"
          subTitle="Xin lỗi, chúng tôi không tìm thấy sản phẩm nào phù hợp với yêu cầu của bạn."
          extra={
            <Button type="primary" onClick={toggleFilterOpen}>
              Lọc lại
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
            <CardProduct products={data?.items} />
          </div>
          <Pagination
            align="center"
            className="py-4"
            current={currentPage}
            pageSize={pageSize}
            showSizeChanger
            onChange={onChangeCurrentPage}
            total={data?.totalItems}
          />
        </>
      )}

      <Drawer
        onClose={toggleFilterOpen}
        open={filterOpen}
        placement="right"
        title={
          <div className="flex items-center gap-2">
            Bộ lọc <Badge count={countFilter(filters)} />
          </div>
        }
        footer={
          <div className="text-center space-x-2">
            <Button danger className="rounded-sm" onClick={clearFilter}>
              Xóa tất cả
            </Button>
            <Button type="primary" danger className="rounded-sm" onClick={handleFilters}>
              Xem kết quả
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <Title level={5}>Danh mục</Title>
          <Checkbox.Group
            className="grid grid-cols-2 gap-1"
            value={filters.categoryIds}
            onChange={(e) => onChangeFilters(FilterTypes.CATEGORIES, e)}
            options={categoryOptions}
          />
          <Title level={5}>Thương hiệu</Title>
          <Checkbox.Group
            className="grid grid-cols-2 gap-1"
            value={filters.brandIds}
            onChange={(e) => onChangeFilters(FilterTypes.BRANDS, e)}
            options={brandOptions}
          />
          <Title level={5}>Chất liệu</Title>
          <Checkbox.Group
            className="grid grid-cols-2 gap-1"
            value={filters.materialIds}
            onChange={(e) => onChangeFilters(FilterTypes.MATERIALS, e)}
            options={materialOptions}
          />
          <Title level={5}>Giới tính</Title>
          <Checkbox.Group
            className="grid grid-cols-3 gap-1"
            value={filters.genders}
            onChange={(e) => onChangeFilters(FilterTypes.GENDERS, e)}
            options={genderOpts}
          />
          <Title level={5}>Đánh giá</Title>
          <div className="space-x-2">
            <Rate value={filters.rating} onChange={(e) => onChangeFilters(FilterTypes.RATING, e)} />
            <span>trở lên</span>
          </div>
          <Title level={5}>Khoảng giá</Title>
          <Slider
            range
            min={0}
            max={2000000}
            value={filters.priceRange}
            onChange={(e) => onChangeFilters(FilterTypes.PRICERANGE, e)}
            step={50000}
          />
          <Title level={5}>Khuyến mãi</Title>
          <div>
            <Checkbox
              checked={filters.discount}
              onChange={(e) => onChangeFilters(FilterTypes.DISCOUNT, e.target.checked)}
            >
              Đang giảm giá
            </Checkbox>
          </div>
          <div>
            <Checkbox
              checked={filters.flashsale}
              onChange={(e) => onChangeFilters(FilterTypes.FLASHSALE, e.target.checked)}
            >
              Flash sale
            </Checkbox>
          </div>
        </div>
      </Drawer>
    </>
  )
}
