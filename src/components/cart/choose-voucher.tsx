import { WarningOutlined } from '@ant-design/icons'
import { Button, Card, Divider, Form, FormProps, Input, Modal, Skeleton } from 'antd'
import { Dispatch, SetStateAction, useState } from 'react'
import { BiSolidDiscount } from 'react-icons/bi'
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'
import httpService from '~/lib/http-service'
import { VOUCHER_API } from '~/utils/api-urls'
import { formatDate, formatVND, showError } from '~/utils/common'
import Voucher from '../ui/voucher'

interface IProps {
  session?: string
  cartPrice: number
  voucher?: VoucherType
  onChooseVoucher: (selected?: VoucherType) => boolean
}

export default function ChooseVoucher({ session, cartPrice, voucher, onChooseVoucher }: IProps) {
  const [form] = Form.useForm()
  const [openModelVoucher, setOpenModelVoucher] = useState<boolean>(false)
  const [selected, setSelected] = useState<VoucherType | undefined>(voucher)

  // const [commonVoucher, setCommonVoucher] = useState<VoucherType>()

  const [loading, setLoading] = useState<boolean>(false)
  // const [voucherApply, setVoucherApply] = useState<string>()

  const {
    data: vouchers,
    isLoading,
    mutate,
  } = useSWR<VoucherType[]>(openModelVoucher && [VOUCHER_API, session], ([VOUCHER_API, session]) =>
    httpService.getWithSession(VOUCHER_API, session),
  )

  const handleApplyVoucher: FormProps['onFinish'] = async (values) => {
    try {
      if (vouchers?.some((e) => e.code === values.code)) {
        throw new Error('Mã giảm giá đã có sẳn.')
      }

      setLoading(true)
      const voucher = await httpService.post(VOUCHER_API + '/add-voucher', values)
      mutate(vouchers ? [voucher, ...vouchers] : [voucher])
      form.resetFields()
      const result = onChooseVoucher(voucher)
      if (result) closeModal()
    } catch (error) {
      form.setFields([
        {
          name: 'code',
          errors: [showError(error)],
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => setOpenModelVoucher(false)

  return (
    <>
      <Modal
        open={openModelVoucher}
        onCancel={closeModal}
        onOk={() => {
          const result = onChooseVoucher(selected)
          if (result) closeModal()
        }}
        destroyOnClose
        afterOpenChange={() => setSelected(voucher)}
        okText="Xác nhận"
        okButtonProps={{ danger: true }}
        styles={{ content: { maxHeight: '100vh' } }}
        centered
      >
        <div className="space-y-2">
          <div className="font-semibold text-base">Mã giảm giá</div>
          <div className="p-4 bg-gray-100">
            <Form form={form} layout="inline" disabled={loading} onFinish={handleApplyVoucher}>
              <Form.Item<{ code: string }>
                name="code"
                className="flex-1"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập mã giảm giá',
                    validateTrigger: 'onSubmit',
                  },
                ]}
              >
                <Input allowClear placeholder="Nhập mã giảm giá" className="rounded-sm" />
              </Form.Item>
              <Button loading={loading} htmlType="submit" className="rounded-sm">
                Áp dụng
              </Button>
            </Form>
          </div>
        </div>
        {/* {commonVoucher && (
          <Voucher
            voucher={commonVoucher}
            disabled={cartPrice < commonVoucher.minOrder || loading}
            onClick={() =>
              selected?.code === commonVoucher.code
                ? setSelected(undefined)
                : setSelected(commonVoucher)
            }
            className={selected?.code === commonVoucher.code ? 'text-red-500' : ''}
          >
            {cartPrice < commonVoucher.minOrder && (
              <>
                <Divider className="my-2" />
                <div className="text-xs">
                  <WarningOutlined className="text-yellow-500" /> Mua thêm{' '}
                  {formatVND.format(commonVoucher.minOrder - cartPrice)} để sử dụng Voucher
                </div>
              </>
            )}
          </Voucher>
        )} */}
        <div className="px-1">
          <Divider className="my-4" />
          <div className="font-semibold text-base">Voucher của bạn</div>
        </div>
        <div className="max-h-[55vh] overflow-y-auto">
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
                <Voucher
                  voucher={v}
                  key={i}
                  disabled={cartPrice < v.minOrder || loading}
                  onClick={() =>
                    selected?.code === v.code ? setSelected(undefined) : setSelected(v)
                  }
                  className={selected?.code === v.code ? 'text-red-500' : ''}
                >
                  {cartPrice < v.minOrder && (
                    <>
                      <Divider className="my-2" />
                      <div className="text-xs">
                        <WarningOutlined className="text-yellow-500" /> Mua thêm{' '}
                        {formatVND.format(v.minOrder - cartPrice)} để sử dụng Voucher
                      </div>
                    </>
                  )}
                </Voucher>
              ))
            )}
          </div>
        </div>
      </Modal>
      <div className="flex justify-between items-center">
        <div>
          {voucher && cartPrice >= voucher.minOrder && (
            <div>
              <span>{voucher.code.toUpperCase()} </span>
              {voucher.discountPercent
                ? `-${voucher.discountPercent}%`
                : formatVND.format(voucher.discountAmount ?? 0)}
            </div>
          )}
        </div>
        <Button type="link" onClick={() => setOpenModelVoucher(true)} className="px-0">
          Chọn mã giảm giá
        </Button>
      </div>
    </>
  )
}
