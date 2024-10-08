import { Drawer } from 'antd'

interface IProps {
  open: boolean
  onCloseViewDetail: () => void
}

export default function OrderDetails({ open, onCloseViewDetail }: IProps) {
  return (
    <>
      <div>Order Detail</div>
      <Drawer
        open={open}
        closable
        destroyOnClose
        onClose={onCloseViewDetail}
        title="Chi tiết đơn hàng"
      >
        <p className="site-description-item-profile-p">User Profile</p>
      </Drawer>
    </>
  )
}
