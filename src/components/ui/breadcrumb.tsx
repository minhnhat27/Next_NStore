'use client'

import { Breadcrumb } from 'antd'
import {
  BreadcrumbItemType,
  BreadcrumbSeparatorType,
  ItemType,
} from 'antd/es/breadcrumb/Breadcrumb'
import Link from 'next/link'
import React from 'react'

const itemRender = (
  currentRoute: ItemType,
  params: any,
  items: ItemType[],
  paths: string[],
): React.ReactNode => {
  const isLast = currentRoute?.path === items[items.length - 1]?.path
  return isLast ? (
    <span>{currentRoute.title}</span>
  ) : (
    <Link href={`${paths.join('/') || '/'}`}>{currentRoute.title}</Link>
  )
}

interface BreadcrumbLinkProps {
  className?: string
  items?: Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[]
}

const BreadcrumbLink: React.FC<BreadcrumbLinkProps> = ({ items, className }) => {
  return <Breadcrumb className={className} itemRender={itemRender} items={items} />
}
export default BreadcrumbLink
