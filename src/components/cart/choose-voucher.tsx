import { WarningOutlined } from '@ant-design/icons'
import { Button, Card, Divider, Form, Input, Modal, Skeleton } from 'antd'
import { Dispatch, SetStateAction, useState } from 'react'
import { BiSolidDiscount } from 'react-icons/bi'
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'
import httpService from '~/lib/http-service'
import { VOUCHER_API } from '~/utils/api-urls'
import { formatDate, formatVND } from '~/utils/common'

interface IProps {
  session?: string
  cartPrice: number
  voucher?: VoucherType
  onChooseVoucher: (selected?: VoucherType) => boolean
}

export default function ChooseVoucher({ session, cartPrice, voucher, onChooseVoucher }: IProps) {
  const [openModelVoucher, setOpenModelVoucher] = useState<boolean>(false)

  const [selected, setSelected] = useState<VoucherType | undefined>(voucher)

  const { data: vouchers, isLoading } = useSWR<VoucherType[]>(
    openModelVoucher && [VOUCHER_API, session],
    ([VOUCHER_API, session]) => httpService.getWithSession(VOUCHER_API, session),
  )

  const closeModal = () => setOpenModelVoucher(false)

  return (
    <>
      <Modal
        open={openModelVoucher}
        onCancel={closeModal}
        onOk={() => {
          const result = onChooseVoucher(selected)
          if (result) {
            closeModal()
          }
        }}
        afterOpenChange={() => setSelected(voucher)}
        okText="Xác nhận"
        okButtonProps={{ danger: true }}
        styles={{ content: { maxHeight: '100vh' } }}
        centered
      >
        <div className="h-24 space-y-2 px-1">
          <div className="font-semibold text-base">Voucher</div>
          <div className="p-4 bg-gray-100 flex justify-center items-center gap-2">
            <Input placeholder="Nhập mã Voucher" className="rounded-sm" />
            <Button className="rounded-sm">Áp dụng</Button>
          </div>
        </div>
        <div className="px-1">
          <Divider className="my-4" />
          <div className="font-semibold text-base">Voucher của bạn</div>
        </div>
        <div className="max-h-[55vh] overflow-y-auto space-y-2 px-1">
          {isLoading &&
            [...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-2 mt-2">
                <Skeleton.Image active />
                <Skeleton active paragraph={{ rows: 2 }} />
              </div>
            ))}
          <div className="my-2">
            {vouchers && vouchers?.length <= 0 ? (
              <div>Bạn không có mã giảm giá</div>
            ) : (
              vouchers?.map((v, i) => (
                <Button
                  type="text"
                  key={i}
                  disabled={cartPrice < v.minOrder}
                  onClick={() =>
                    selected?.code === v.code ? setSelected(undefined) : setSelected(v)
                  }
                  className={`p-0 w-full h-full hover:bg-inherit text-start ${
                    selected?.code === v.code ? 'border-red-500' : 'border-gray-200'
                  }`}
                >
                  <div className="grid grid-cols-4 min-h-28 w-full">
                    <div className="bg-gray-100 h-full flex flex-col justify-center items-center rounded-s-md">
                      <div className="font-semibold">{v.code.toUpperCase()}</div>
                      <BiSolidDiscount className="text-5xl text-teal-400" />
                    </div>
                    <div className="col-span-3 py-2 px-8 flex flex-col justify-center">
                      <div>
                        Giảm
                        {v.discountPercent
                          ? ` ${v.discountPercent}% `
                          : ` ${formatVND.format(v.discountAmount ?? 0)} `}
                        tối đa {formatVND.format(v.maxDiscount)}
                      </div>
                      <div>Đơn tối thiểu {formatVND.format(v.minOrder)}</div>
                      <div className="mt-1 text-xs font-semibold text-end">
                        HSD: {formatDate(v.endDate)}
                      </div>
                      {cartPrice < v.minOrder && (
                        <>
                          <Divider className="my-2" />
                          <div className="text-xs">
                            <WarningOutlined className="text-yellow-500" /> Mua thêm{' '}
                            {formatVND.format(v.minOrder - cartPrice)} để sử dụng Voucher
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </Button>
              ))
            )}
          </div>
        </div>
      </Modal>
      <div className="flex justify-between items-center">
        <div>
          {voucher && cartPrice >= voucher.minOrder ? (
            <div>
              <span>{voucher.code.toUpperCase()} </span>
              {voucher.discountPercent
                ? `-${voucher.discountPercent}%`
                : formatVND.format(voucher.discountAmount ?? 0)}
            </div>
          ) : (
            'Voucher'
          )}
        </div>
        <Button type="link" onClick={() => setOpenModelVoucher(true)} className="px-0">
          Chọn Voucher
        </Button>
      </div>
    </>
  )
}
