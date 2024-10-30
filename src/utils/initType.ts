export const initPagination: PaginationType = {
  page: 1,
  pageSize: 10,
}

export const initFilters: FilterType = {
  sorter: '0',
  page: 1,
  pageSize: 10,
}

export const initProduct: ProductType = {
  id: 0,
  name: '',
  enable: false,
  gender: 0,
  sold: 0,
  discountPercent: 0,
  price: 0,
  categoryName: '',
  brandName: '',
  imageUrl: '',
  rating: 0,
  ratingCount: 0,
}

export const initOrder: OrderType = {
  id: 0,
  amountPaid: 0,
  orderDate: '',
  shippingCost: 0,
  total: 0,
  paymentMethodName: '',
  orderStatus: 0,
  voucherDiscount: 0,
}
