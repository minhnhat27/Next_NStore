'use client'

import { FunnelPlotOutlined } from '@ant-design/icons'
import {
  Badge,
  Button,
  ButtonProps,
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
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import useSWRImmutable from 'swr/immutable'
import httpService from '~/lib/http-service'
import { FASHION_API } from '~/utils/api-urls'
import { formatVND, toNextImageLink } from '~/utils/common'

const { Title } = Typography

const sortOpts = [
  { value: 0, label: 'Bán chạy' },
  { value: 1, label: 'Giá từ thấp đến cao' },
  { value: 2, label: 'Giá từ cao đến thấp' },
  { value: 3, label: 'Mới nhất' },
]

const saleOptions = [
  { label: 'Đang giảm giá', value: 'discount' },
  { label: 'Flash sale', value: 'flashsale' },
]

const initFilters: FilterType = {
  sorter: 0,
  page: 1,
  pageSize: 10,
}

enum FilterTypes {
  CATEGORIES = 'categoryIds',
  BRANDS = 'brandIds',
  MATERIALS = 'materialIds',
  PRICERANGE = 'priceRange',
  RATING = 'rating',
  SALES = 'sales',
  SORTER = 'sorter',
}

interface IProps {
  brands: BrandType[]
  categories: CategoryType[]
  material: MaterialType[]
}

const countFilter = (filters: FilterType): number => {
  let count = 0
  Object.keys(filters).forEach((key) => {
    const value = filters[key]

    if (Array.isArray(value)) {
      if (value.length > 0) {
        count += value.length
      }
    } else if (value !== null && value !== undefined) {
      count++
    }
  })
  if (count >= 3) count -= 3
  return count
}

export default function Products({ brands, categories, material }: IProps) {
  const [filterOpen, setFilterOpen] = useState<boolean>(false)

  const [filters, setFilters] = useState<FilterType>(initFilters)

  const [brandOptions, setBrandOptions] = useState<CheckboxOptionType[]>([])
  const [categoryOptions, setCategoryOptions] = useState<CheckboxOptionType[]>([])
  const [materialOptions, setMaterialOptions] = useState<CheckboxOptionType[]>([])

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  const [params, setParams] = useState<FilterType>(filters)

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

  const toggleFilterOpen = () => setFilterOpen(!filterOpen)

  const getFilters = (filters: FilterType, p?: number, pSize?: number) => {
    let newParams: Filters = { ...filters }
    if (filters.sales && filters.sales.length > 0) {
      filters.sales.forEach((item) => {
        newParams[item] = true
      })
    }
    if (!filters.rating) {
      newParams.rating = undefined
    }
    if (filters.priceRange && filters.priceRange[0] === filters.priceRange[0]) {
      newParams.minPrice = filters.priceRange[0]
    } else {
      if (filters.priceRange && filters.priceRange[0]) {
        newParams.minPrice = filters.priceRange[0]
      }
      if (filters.priceRange && filters.priceRange[1]) {
        newParams.maxPrice = filters.priceRange[1]
      }
    }

    newParams.page = p ?? currentPage
    newParams.pageSize = pSize ?? pageSize

    setParams(newParams)
  }

  const onChangeFilters = (type: FilterTypes, values: string[] | number | number[]) => {
    const newFilters = {
      ...filters,
      [type]: values,
    }
    setFilters(newFilters)

    if (type === FilterTypes.SORTER) {
      getFilters(newFilters)
    }
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
        {[...Array(5)].map(() => (
          <Skeleton.Image className="h-[28rem] w-full" active />
        ))}
      </div>
    )

  return (
    <>
      <div className="py-2 flex flex-col sm:flex-row sm:justify-between">
        <Title level={3}>Tất cả sản phẩm</Title>
        <Flex align="center" className="space-x-2">
          <Select
            placeholder="Sắp xếp theo: "
            labelRender={(item) => 'Sắp xếp: ' + item.label}
            value={filters.sorter}
            onChange={(e) => onChangeFilters(FilterTypes.SORTER, e)}
            className="w-full sm:w-64"
            options={sortOpts}
          />
          <Badge color="orange" count={countFilter(filters)}>
            <Button onClick={toggleFilterOpen}>
              <FunnelPlotOutlined /> Bộ lọc
            </Button>
          </Badge>
        </Flex>
      </div>
      {data?.items && data.items.length <= 0 ? (
        <Result
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {data?.items.map((product, i) => {
            if (product.discountPercent) {
              const discountedPrice =
                product.price - product.price * ((product.discountPercent ?? 0) / 100.0)

              return (
                <Link key={i} href={`/fashions/details/${product.id}`}>
                  <div className="border h-[28rem] hover:-translate-y-0.5 transition-transform">
                    <Badge.Ribbon
                      text={`-${product.discountPercent}%`}
                      color="red"
                      rootClassName="h-3/4"
                    >
                      <Image
                        src={toNextImageLink(product.imageUrl)}
                        alt="Product Image"
                        width={0}
                        height={0}
                        sizes="100vw"
                        priority={i < 5}
                        quality={100}
                        className="w-full h-full object-cover"
                      />
                    </Badge.Ribbon>
                    <div className="relative space-y-2 h-1/4">
                      <div className="text-black text-xs sm:text-sm line-clamp-2 px-2 pt-2">
                        {product.name}
                      </div>
                      <div className="absolute bottom-0 w-full">
                        <div className="text-red-500 font-semibold text-lg px-2">
                          {formatVND.format(discountedPrice)}
                          <span className="mx-2 text-sm text-gray-500 line-through">
                            {formatVND.format(product.price)}
                          </span>
                        </div>
                        <Flex justify="space-between" align="center" className="px-2 py-1">
                          <span>
                            <Rate count={1} value={1} /> <span className="text-gray-400">4.8</span>
                          </span>
                          <div className="text-xs 2xl:text-base text-slate-600">
                            Đã bán {product.sold}
                          </div>
                        </Flex>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            }
            return (
              <Link key={i} href={`/fashions/details/${product.id}`}>
                <div className="border h-[28rem] hover:drop-shadow hover:-translate-y-0.5 transition-transform">
                  <Image
                    src={toNextImageLink(product.imageUrl)}
                    alt="Product Image"
                    width={0}
                    height={0}
                    sizes="100vw"
                    priority={i < 5}
                    quality={100}
                    className="w-full h-3/4 object-cover"
                  />
                  <div className="relative space-y-2 h-1/4">
                    <div className="text-black text-xs sm:text-sm line-clamp-2 px-2 pt-2">
                      {product.name}
                    </div>
                    <div className="absolute bottom-0 w-full">
                      <div className="text-red-500 font-semibold text-lg px-2">
                        {formatVND.format(product.price)}
                      </div>
                      <Flex justify="space-between" align="center" className="px-2 py-1">
                        <span>
                          <Rate count={1} value={1} /> <span className="text-gray-400">4.8</span>
                        </span>
                        <div className="text-xs 2xl:text-base text-slate-600">
                          Đã bán {product.sold}
                        </div>
                      </Flex>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
      {(data?.items && data.items.length <= 0) || (
        <Pagination
          //hideOnSinglePage
          align="center"
          className="py-4"
          current={currentPage}
          pageSize={pageSize}
          showSizeChanger
          onChange={onChangeCurrentPage}
          total={data?.totalItems}
        />
      )}

      <Drawer
        onClose={toggleFilterOpen}
        open={filterOpen}
        placement="right"
        title="Bộ lọc"
        footer={
          <div className="text-center space-x-2">
            <Button danger onClick={clearFilter}>
              Xóa tất cả
            </Button>
            <Button type="primary" onClick={handleFilters}>
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
          <Checkbox.Group
            className="grid grid-cols-2 gap-1"
            value={filters.sales}
            onChange={(e) => onChangeFilters(FilterTypes.SALES, e)}
            options={saleOptions}
          />
        </div>
      </Drawer>
    </>
  )
}
