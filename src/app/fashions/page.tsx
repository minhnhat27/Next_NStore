'use client'

import { FunnelPlotOutlined } from '@ant-design/icons'
import {
  Badge,
  Button,
  Checkbox,
  Drawer,
  Flex,
  Image,
  Pagination,
  Rate,
  Select,
  Slider,
  Typography,
} from 'antd'
import Link from 'next/link'
import React, { useState } from 'react'
import { Filters } from '~/utils/types'

const { Title } = Typography

const sortOpts = [
  { value: 'best', label: 'Bán chạy' },
  { value: 'asc', label: 'Giá từ thấp đến cao' },
  { value: 'desc', label: 'Giá từ cao đến thấp' },
  { value: 'newest', label: 'Mới nhất' },
]

const categoryOptions = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' },
  { label: 'Apple1', value: 'Apple1' },
  { label: 'Pear1', value: 'Pear1' },
  { label: 'Orange1', value: 'Orange1' },
  { label: 'Apple2', value: 'Apple2' },
  { label: 'Pear2', value: 'Pear2' },
  { label: 'Orange2', value: 'Orange2' },
]

const brandOptions = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' },
  { label: 'Apple1', value: 'Apple1' },
  { label: 'Pear1', value: 'Pear1' },
  { label: 'Orange1', value: 'Orange1' },
  { label: 'Apple2', value: 'Apple2' },
  { label: 'Pear2', value: 'Pear2' },
  { label: 'Orange2', value: 'Orange2' },
]

const saleOptions = [
  { label: 'Đang giảm giá', value: 'discount' },
  { label: 'Pear', value: 'Pear' },
]

const initFilters: Filters = {
  categories: [],
  brands: [],
  priceRange: [0, 500000],
  rate: 0,
  sales: [],
}

enum FilterTypes {
  CATEGORIES = 'categories',
  BRANDS = 'brands',
  PRICERANGE = 'priceRange',
  RATE = 'rate',
  SALES = 'sales',
}

export default function Fashions() {
  const [filterOpen, setFilterOpen] = useState<boolean>(false)
  const [filters, setFilters] = useState<Filters>(initFilters)

  const toggleFilterOpen = () => {
    setFilterOpen(!filterOpen)
  }

  const onChangeFilters = (type: FilterTypes, values: string[] | number | number[]) => {
    const newFilters = {
      ...filters,
      [type]: values,
    }
    setFilters(newFilters)
  }

  const clearFilter = () => setFilters(initFilters)

  return (
    <>
      <div className="p-4">
        <div className="py-2 flex flex-col sm:flex-row sm:justify-between">
          <Title level={3}>Tất cả sản phẩm</Title>
          <Flex align="center" className="space-x-2">
            <Button onClick={toggleFilterOpen}>
              <FunnelPlotOutlined /> Bộ lọc
            </Button>
            <div className="hidden md:inline-block">Sắp xếp theo: </div>
            <Select defaultValue="best" className="w-full sm:w-48" options={sortOpts} />
          </Flex>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <Link href="/fashions/details/1">
            <div className="border hover:drop-shadow hover:-translate-y-0.5 transition-transform">
              <Badge.Ribbon text="-20%" color="red" rootClassName="flex">
                <Image
                  rootClassName="max-h-72 md:max-h-80 2xl:max-h-[32rem] min-h-20"
                  className="object-cover object-center h-full"
                  src="/images/product.png"
                  preview={false}
                />
              </Badge.Ribbon>
              <div className="p-2 space-y-2">
                <div className="text-black text-xs sm:text-sm">
                  Áo thun nam áo thun nam áo thun nam áo thun nam
                </div>
                <div className="space-x-2">
                  <span className="text-red-600 font-semibold text-lg">80.000đ</span>
                  <span className="line-through text-gray-500">100.000đ</span>
                </div>
                <Flex justify="space-between" align="center">
                  <span>
                    <Rate count={1} value={1} /> <span className="text-gray-400">4.8</span>
                  </span>
                  <div className="text-xs 2xl:text-base text-slate-600">Đã bán 124</div>
                </Flex>
              </div>
            </div>
          </Link>
          <Link href="/fashions/details/1">
            <div className="border hover:drop-shadow hover:-translate-y-0.5 transition-transform">
              <Badge.Ribbon text="-20%" color="red" rootClassName="flex">
                <Image
                  rootClassName="max-h-72 md:max-h-80 2xl:max-h-[32rem] min-h-20"
                  className="object-cover object-center h-full"
                  src="/images/product.png"
                  preview={false}
                />
              </Badge.Ribbon>
              <div className="p-2 space-y-2">
                <div className="text-black text-xs sm:text-sm">
                  Áo thun nam áo thun nam áo thun nam áo thun nam
                </div>
                <div className="space-x-2">
                  <span className="text-red-600 font-semibold text-lg">80.000đ</span>
                  <span className="line-through text-gray-500">100.000đ</span>
                </div>
                <Flex justify="space-between" align="center">
                  <span>
                    <Rate count={1} value={1} /> <span className="text-gray-400">4.8</span>
                  </span>
                  <div className="text-xs 2xl:text-base text-slate-600">Đã bán 124</div>
                </Flex>
              </div>
            </div>
          </Link>
          <Link href="/fashions/details/1">
            <div className="border hover:drop-shadow hover:-translate-y-0.5 transition-transform">
              <div className="flex">
                <Image
                  rootClassName="max-h-72 md:max-h-80 2xl:max-h-[32rem] min-h-20"
                  className="object-cover object-center h-full"
                  src="/images/product.png"
                  preview={false}
                />
              </div>
              <div className="p-2 space-y-2">
                <div className="text-black text-xs sm:text-sm">
                  Áo thun nam áo thun nam áo thun nam áo thun nam
                </div>
                <div className="text-red-500 font-semibold text-lg">80.000đ</div>
                <Flex justify="space-between" align="center">
                  <span>
                    <Rate count={1} value={1} /> <span className="text-gray-400">4.8</span>
                  </span>
                  <div className="text-xs 2xl:text-base text-slate-600">Đã bán 124</div>
                </Flex>
              </div>
            </div>
          </Link>
          <Link href="/fashions/details/1">
            <div className="border hover:drop-shadow hover:-translate-y-0.5 transition-transform">
              <div className="flex">
                <Image
                  rootClassName="max-h-72 md:max-h-80 2xl:max-h-[32rem] min-h-20"
                  className="object-cover object-center h-full"
                  src="/images/product.png"
                  preview={false}
                />
              </div>
              <div className="p-2 space-y-2">
                <div className="text-black text-xs sm:text-sm">
                  Áo thun nam áo thun nam áo thun nam áo thun nam
                </div>
                <div className="text-red-500 font-semibold text-lg">80.000đ</div>
                <Flex justify="space-between" align="center">
                  <span>
                    <Rate count={1} value={1} /> <span className="text-gray-400">4.8</span>
                  </span>
                  <div className="text-xs 2xl:text-base text-slate-600">Đã bán 124</div>
                </Flex>
              </div>
            </div>
          </Link>
          <Link href="/fashions/details/1">
            <div className="border hover:drop-shadow hover:-translate-y-0.5 transition-transform">
              <div className="flex">
                <Image
                  rootClassName="max-h-72 md:max-h-80 2xl:max-h-[32rem] min-h-20"
                  className="object-cover object-center h-full"
                  src="/images/product.png"
                  preview={false}
                />
              </div>
              <div className="p-2 space-y-2">
                <div className="text-black text-xs sm:text-sm">
                  Áo thun nam áo thun nam áo thun nam áo thun nam
                </div>
                <div className="text-red-500 font-semibold text-lg">80.000đ</div>
                <Flex justify="space-between" align="center">
                  <span>
                    <Rate count={1} value={1} /> <span className="text-gray-400">4.8</span>
                  </span>
                  <div className="text-xs 2xl:text-base text-slate-600">Đã bán 124</div>
                </Flex>
              </div>
            </div>
          </Link>
          <Link href="/fashions/details/1">
            <div className="border hover:drop-shadow hover:-translate-y-0.5 transition-transform">
              <div className="flex">
                <Image
                  rootClassName="max-h-72 md:max-h-80 2xl:max-h-[32rem] min-h-20"
                  className="object-cover object-center h-full"
                  src="/images/product.png"
                  preview={false}
                />
              </div>
              <div className="p-2 space-y-2">
                <div className="text-black text-xs sm:text-sm">
                  Áo thun nam áo thun nam áo thun nam áo thun nam
                </div>
                <div className="text-red-500 font-semibold text-lg">80.000đ</div>
                <Flex justify="space-between" align="center">
                  <span>
                    <Rate count={1} value={1} /> <span className="text-gray-400">4.8</span>
                  </span>
                  <div className="text-xs 2xl:text-base text-slate-600">Đã bán 124</div>
                </Flex>
              </div>
            </div>
          </Link>
          <Link href="/fashions/details/1">
            <div className="border hover:drop-shadow hover:-translate-y-0.5 transition-transform">
              <div className="flex">
                <Image
                  rootClassName="max-h-72 md:max-h-80 2xl:max-h-[32rem] min-h-20"
                  className="object-cover object-center h-full"
                  src="/images/product.png"
                  preview={false}
                />
              </div>
              <div className="p-2 space-y-2">
                <div className="text-black text-xs sm:text-sm">
                  Áo thun nam áo thun nam áo thun nam áo thun nam
                </div>
                <div className="text-red-500 font-semibold text-lg">80.000đ</div>
                <Flex justify="space-between" align="center">
                  <span>
                    <Rate count={1} value={1} /> <span className="text-gray-400">4.8</span>
                  </span>
                  <div className="text-xs 2xl:text-base text-slate-600">Đã bán 124</div>
                </Flex>
              </div>
            </div>
          </Link>
          <Link href="/fashions/details/1">
            <div className="border hover:drop-shadow hover:-translate-y-0.5 transition-transform">
              <div className="flex">
                <Image
                  rootClassName="max-h-72 md:max-h-80 2xl:max-h-[32rem] min-h-20"
                  className="object-cover object-center h-full"
                  src="/images/product.png"
                  preview={false}
                />
              </div>
              <div className="p-2 space-y-2">
                <div className="text-black text-xs sm:text-sm">
                  Áo thun nam áo thun nam áo thun nam áo thun nam
                </div>
                <div className="text-red-500 font-semibold text-lg">80.000đ</div>
                <Flex justify="space-between" align="center">
                  <span>
                    <Rate count={1} value={1} /> <span className="text-gray-400">4.8</span>
                  </span>
                  <div className="text-xs 2xl:text-base text-slate-600">Đã bán 124</div>
                </Flex>
              </div>
            </div>
          </Link>
        </div>
        <Pagination align="center" className="py-4" defaultCurrent={6} total={500} />
      </div>
      <Drawer
        onClose={toggleFilterOpen}
        open={filterOpen}
        placement="bottom"
        title="Bộ lọc"
        footer={
          <div className="text-center space-x-2">
            <Button onClick={clearFilter}>Xóa tất cả</Button>
            <Button>Xem kết quả</Button>
          </div>
        }
      >
        <div className="space-y-2">
          <Title level={5}>Danh mục</Title>
          <Checkbox.Group
            value={filters.categories}
            onChange={(e) => onChangeFilters(FilterTypes.CATEGORIES, e)}
            options={categoryOptions}
          />
          <Title level={5}>Thương hiệu</Title>
          <Checkbox.Group
            value={filters.brands}
            onChange={(e) => onChangeFilters(FilterTypes.BRANDS, e)}
            options={brandOptions}
          />
          <Title level={5}>Đánh giá</Title>
          <div className="space-x-2">
            <Rate value={filters.rate} onChange={(e) => onChangeFilters(FilterTypes.RATE, e)} />
            <span>trở lên</span>
          </div>
          <Title level={5}>Khoảng giá</Title>
          <Slider
            range
            min={0}
            max={2000000}
            value={filters.priceRange}
            onChange={(e) => onChangeFilters(FilterTypes.PRICERANGE, e)}
            step={10000}
          />
          <Title level={5}>Khuyến mãi</Title>
          <Checkbox.Group
            value={filters.sales}
            onChange={(e) => onChangeFilters(FilterTypes.SALES, e)}
            options={saleOptions}
          />
        </div>
      </Drawer>
    </>
  )
}
