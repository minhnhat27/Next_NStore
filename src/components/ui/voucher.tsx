import { CheckCircleFilled, CheckCircleOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { MouseEventHandler } from 'react'
import { BiSolidDiscount } from 'react-icons/bi'
import { formatDate, formatVND } from '~/utils/common'

interface Props extends IProps {
  voucher: VoucherType
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLElement>
}

export default function Voucher({ voucher, className, disabled, children, onClick }: Props) {
  return (
    <>
      <Button
        type="text"
        disabled={disabled}
        onClick={onClick}
        className={`relative w-full h-full my-1 p-0 hover:bg-inherit text-start shadow border-gray-200`}
      >
        <div className="grid grid-cols-4 min-h-28 w-full">
          <div className="bg-gray-100 h-full flex flex-col justify-center items-center rounded-s-md">
            <div className="font-semibold">{voucher.code.toUpperCase()}</div>
            <BiSolidDiscount className="text-5xl text-teal-400" />
          </div>
          <div className="col-span-3 py-2 px-8 flex flex-col justify-center">
            <div>
              Giảm
              {voucher.discountPercent
                ? ` ${voucher.discountPercent}% `
                : ` ${formatVND.format(voucher.discountAmount ?? 0)} `}
              {voucher.discountPercent && `tối đa ${formatVND.format(voucher.maxDiscount)}`}
            </div>
            <div>Đơn tối thiểu {formatVND.format(voucher.minOrder)}</div>
            <div className="mt-1 text-xs font-semibold text-end">
              HSD: {formatDate(voucher.endDate)}
            </div>
            {children}
          </div>
        </div>
        <CheckCircleFilled
          className={`absolute text-lg right-2 ${
            className || 'text-white border border-gray-300 rounded-full'
          }`}
        />
      </Button>
    </>
  )
}
