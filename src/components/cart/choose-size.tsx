import { DownOutlined } from '@ant-design/icons'
import { Button, Popconfirm } from 'antd'
import { useState } from 'react'

interface IProps {
  item: CartItemsType
  cartItems: CartItemsType[]
  onChangeSize: (item: CartItemsType, value: number) => void
}

export default function ChooseSize({ item, cartItems, onChangeSize }: IProps) {
  const [sizeId, setSizeId] = useState<number>(item.sizeId)

  return (
    <>
      <Popconfirm
        trigger={['click']}
        description={
          <div className="space-y-2 my-2 w-40">
            <div>
              {item.sizeInStocks.map((size, i) => (
                <Button
                  type={sizeId === size.sizeId ? 'primary' : 'default'}
                  key={i}
                  disabled={
                    size.inStock <= 0 ||
                    cartItems.some(
                      (e) =>
                        e.productId === item.productId &&
                        e.colorId === item.colorId &&
                        e.sizeId !== item.sizeId && //khac size hien tai
                        e.sizeId === size.sizeId, //size khac da co hay chua
                    )
                  }
                  onClick={() => setSizeId(size.sizeId)}
                  className="rounded-sm m-1"
                >
                  {size.sizeName}
                </Button>
              ))}
            </div>
            <div className="px-2">
              {item.sizeInStocks.find((e) => e.sizeId === sizeId)?.inStock} còn hàng
            </div>
          </div>
        }
        title="Chọn size"
        onConfirm={() => onChangeSize(item, sizeId)}
        onOpenChange={() => setSizeId(item.sizeId)}
        zIndex={10}
        className="cursor-pointer mx-1"
        placement="bottom"
        icon={null}
        overlayInnerStyle={{ padding: '1rem' }}
        okButtonProps={{ danger: true }}
        showCancel={false}
      >
        {item.sizeInStocks.find((e) => e.sizeId === item.sizeId)?.sizeName}{' '}
        <DownOutlined className="text-xs" />
      </Popconfirm>
    </>
  )
}
