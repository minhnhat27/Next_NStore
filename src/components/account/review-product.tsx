import { PlusOutlined } from '@ant-design/icons'
import {
  App,
  Button,
  Divider,
  Form,
  FormProps,
  GetProp,
  Image as AntImage,
  Input,
  Modal,
  Rate,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd'
import { memo, useEffect, useState } from 'react'
import httpService from '~/lib/http-service'
import { ORDER_API } from '~/utils/api-urls'
import { getBase64, showError } from '~/utils/common'

interface IProps {
  id: number
  order_details_load: boolean
  getDetail: (id: number) => void
  order_details?: OrderDetailsType
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

type ReviewType = {
  productId: number
  productName?: string
  description?: string
  star: number
}

type UploadType = { productId: number; files: UploadFile[] }

const ReviewProduct = ({ id, order_details_load, order_details, getDetail }: IProps) => {
  const { notification } = App.useApp()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  const [fileList, setFileList] = useState<UploadType[]>([])

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType)
    }
    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
  }

  const onFinish: FormProps['onFinish'] = async ({ review }: { review: ReviewType[] }) => {
    try {
      setLoading(true)
      const formData = new FormData()
      review.forEach((e: ReviewType) => delete e.productName)

      review.forEach((item, i) => {
        Object.keys(item).forEach((key) => {
          const value = item[key as keyof ReviewType]
          if (value) {
            formData.append(`reviews[${i}].${key}`, value.toString())
          }
        })
        const images = fileList.find((e) => e.productId === item.productId)?.files
        if (images)
          images.forEach(
            (image) =>
              image.originFileObj && formData.append(`reviews[${i}].images`, image.originFileObj),
          )
      })
      await httpService.post(ORDER_API + `/${id}/review`, formData)
      notification.success({
        message: 'Thành công',
        description: 'Đã gửi đánh giá của bạn.',
        className: 'text-green-500',
      })
      setOpen(false)
      form.resetFields()
      setFileList([])
    } catch (error) {
      notification.error({
        message: 'Thất bại',
        description: showError(error),
        className: 'text-red-500',
      })
    } finally {
      setLoading(false)
    }
  }

  const openModel = () => {
    setOpen(true)
    getDetail(id)
  }

  const handleChange = (productId: number, newFileList: any) => {
    const existingProduct = fileList.some((item) => item.productId === productId)
    let newList
    if (existingProduct) {
      newList = fileList.map((item) =>
        item.productId === productId ? { ...item, files: newFileList } : item,
      )
    } else {
      newList = [...fileList, { productId, files: newFileList }]
    }
    setFileList(newList)
  }

  const uploadButton = (
    <button type="button">
      <PlusOutlined />
      <div>Upload</div>
    </button>
  )

  return (
    <>
      {previewImage && (
        <AntImage
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
      <Modal
        open={open}
        width={600}
        loading={order_details_load}
        onCancel={() => setOpen(false)}
        okText="Gửi đánh giá"
        okButtonProps={{
          autoFocus: true,
          htmlType: 'submit',
          danger: true,
          className: 'rounded-sm',
        }}
        confirmLoading={loading}
        cancelButtonProps={{ className: 'rounded-sm', disabled: loading }}
        destroyOnClose
        centered
        title={`Đánh giá đơn hàng #${id}`}
        className="rounded-sm"
        styles={{ content: { borderRadius: 3, margin: '0.5rem 0' } }}
        maskClosable={false}
        modalRender={(dom) => (
          <Form layout="vertical" form={form} name="changeEmail" onFinish={onFinish}>
            {dom}
          </Form>
        )}
      >
        {order_details && (
          <Form.List
            initialValue={order_details.productOrderDetails.map((value) => {
              if (value.productId) {
                const data: ReviewType = {
                  productId: value.productId,
                  productName: value.productName,
                  star: 5,
                }
                return data
              }
              return null
            })}
            name="review"
          >
            {(fields) => (
              <>
                {fields.map((field, i) => (
                  <div key={i}>
                    <Form.Item noStyle dependencies={['review', field.name, 'productId']}>
                      {({ getFieldValue }) => {
                        const productName = getFieldValue(['review', field.name, 'productName'])
                        return (
                          <div className="font-semibold text-lg text-gray-700">{productName}</div>
                        )
                      }}
                    </Form.Item>

                    <Divider className="my-1" />
                    <Form.Item
                      layout="horizontal"
                      label="Chất lượng"
                      name={[field.name, 'star']}
                      rules={[
                        {
                          validator: (_, value) =>
                            value < 1
                              ? Promise.reject(new Error('Tối thiểu 1 sao'))
                              : Promise.resolve(),
                        },
                      ]}
                      className="mb-0"
                    >
                      <Rate count={5} />
                    </Form.Item>
                    <Form.Item
                      name={[field.name, 'description']}
                      className="mb-1"
                      label="Nhận xét của bạn"
                    >
                      <Input.TextArea
                        className="rounded-sm"
                        placeholder="Hãy chia sẽ nhận xét cho sản phẩm này bạn nhé!"
                        showCount
                        maxLength={150}
                        size="large"
                      />
                    </Form.Item>
                    <Form.Item
                      dependencies={['review', field.name, 'productId']}
                      label="Thêm hình ảnh"
                    >
                      {({ getFieldValue }) => {
                        const productId = getFieldValue(['review', field.name, 'productId'])
                        const currentFileList =
                          fileList.find((e) => e.productId === productId)?.files || []

                        return (
                          <Upload
                            multiple
                            beforeUpload={() => false}
                            listType="picture-card"
                            fileList={currentFileList}
                            onPreview={handlePreview}
                            onChange={({ fileList }) => handleChange(productId, fileList)}
                          >
                            {currentFileList.length >= 3 ? null : uploadButton}
                          </Upload>
                        )
                      }}
                    </Form.Item>
                  </div>
                ))}
              </>
            )}
          </Form.List>
        )}
      </Modal>
      <Button type="link" onClick={openModel} className="px-0 rounded-sm text-yellow-500">
        Đánh giá <Rate value={1} count={1} />
      </Button>
    </>
  )
}

export default memo(ReviewProduct)
