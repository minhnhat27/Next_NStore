'use client'

import { CloseOutlined, CommentOutlined, PaperClipOutlined, SendOutlined } from '@ant-design/icons'
import {
  Button,
  Divider,
  FloatButton,
  Form,
  FormProps,
  GetProp,
  Input,
  Image as AntdImage,
  Popover,
  Upload,
  UploadFile,
  UploadProps,
  InputRef,
  App,
} from 'antd'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { getBase64 } from '~/utils/common'
import Message from '../ui/message'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'

type Message = {
  isUser?: boolean
  message: string
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const storeName = process.env.NEXT_PUBLIC_STORE_NAME

export default function ChatBox() {
  const [form] = Form.useForm()
  const [open, setOpen] = useState<boolean>(false)

  const inputRef = useRef<InputRef>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const { notification } = App.useApp()

  const [loading, setLoading] = useState<boolean>(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [quickChat, setQuickChat] = useState<boolean>(false)

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const [connection, setConnection] = useState<HubConnection>()
  const [online, setOnline] = useState<boolean>(false)

  const [count, setCount] = useState<number>(0)

  const handleZaloChat = () => (window.location.href = 'zalo://conversation?phone=0358103707')

  const onStopChat = async () => {
    if (connection) {
      await connection.stop()
      if (messages.length) setMessages([])
      setFileList([])
      form.resetFields()
      setQuickChat(false)
      setOnline(false)
    }
  }

  const handleSendMessage: FormProps['onFinish'] = (values) => {
    if (connection) {
      const m: Message = { ...values, isUser: true }
      connection.invoke('SendToAdmin', values.message)
      setMessages((pre) => [...pre, m])
      form.resetFields()
    }
  }

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
  }

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList)

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
      inputRef.current?.focus({
        cursor: 'start',
      })
    }
    if (open) setCount(0)
  }, [messages, open])

  const title = (
    <>
      <div className="h-20 ps-2 pb-2 flex justify-between border-b">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              className="h-14 w-14 rounded-full"
              src="/images/Logo-t-1x1.png"
              alt="logo"
            />
            {online && (
              <div className="absolute right-0 bottom-1">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              </div>
            )}
          </div>
          <div className="text-xl">{storeName}</div>
        </div>
        <div className="flex gap-1 items-center">
          {quickChat && (
            <Button type="link" onClick={onStopChat}>
              Kết thúc
            </Button>
          )}

          <Button className="px-2" type="text" onClick={() => setOpen(false)}>
            <CloseOutlined className="text-lg text-gray-500" />
          </Button>
        </div>
      </div>
    </>
  )

  const connectChat = async () => {
    try {
      const connect = new HubConnectionBuilder()
        .withUrl(process.env.NEXT_PUBLIC_API_URL + '/chat')
        .withAutomaticReconnect()
        .build()

      connect.on('onUser', (message) => {
        const mess: Message = {
          message: message,
          isUser: false,
        }
        setMessages((pre) => [...pre, mess])
        setCount((pre) => pre + 1)
      })

      await connect.start()
      console.log('SignalR connected')
      setConnection(connect)

      return connect.invoke('GetAdminOnline')
    } catch (err) {
      console.error('SignalR connection error: ', err)
      throw new Error('SignalR connection error')
    }
  }

  const onClickQuickChat = async () => {
    try {
      setLoading(true)
      const onl: boolean = await connectChat()
      setOnline(onl)
      setQuickChat(true)
    } catch (error) {
      notification.error({
        message: 'Kết nối thất bại',
        description: `Không thể kết nối với ${storeName}`,
        className: 'text-red-500',
      })
    } finally {
      setLoading(false)
    }
  }

  const content = (
    <>
      <div className="text-xl text-gray-500 text-center py-10">
        Bắt đầu trò chuyện với {storeName}
      </div>
      <div className="space-y-4">
        <Button
          onClick={handleZaloChat}
          type="primary"
          size="large"
          className="w-full h-12 rounded-sm"
        >
          Chat bằng Zalo
        </Button>
        <Button
          loading={loading}
          onClick={onClickQuickChat}
          size="large"
          className="w-full h-12 rounded-sm"
        >
          Chat nhanh
        </Button>
      </div>
      <Divider />
    </>
  )

  const quickChatContent = (
    <>
      {!messages.length && (
        <div className="text-center text-xs text-gray-400">
          <div>Bắt đầu trò chuyện nhanh với {storeName}.</div>
          <div>Thông tin của bạn sẽ được ẩn.</div>
        </div>
      )}
      <div
        id="content"
        ref={contentRef}
        className={`overflow-y-auto py-2 flex flex-col ${messages.length ? 'h-64' : 'h-56'}`}
      >
        <Message message={`Xin chào! ${storeName} rất vui được hỗ trợ bạn.`} />
        {messages.map((m, i) => (
          <Message key={i} message={m.message} isUser={m.isUser} />
        ))}
      </div>
      <Divider className="my-2" />
      {fileList.map((file, i) => (
        <div key={i} className="relative cursor-pointer select-none w-fit m-1 group">
          <Image
            width={0}
            height={0}
            sizes="10vw"
            className="h-12 w-12 rounded object-cover"
            onClick={() => handlePreview(file)}
            src={file.originFileObj ? URL.createObjectURL(file.originFileObj) : ''}
            alt={file.name}
          />
          <CloseOutlined
            onClick={() => setFileList((pre) => pre.filter((e) => e.uid !== file.uid))}
            className="hidden group-hover:block absolute -top-2 -right-2 bg-white font-bold rounded-full text-[0.65rem] p-[0.15rem] border"
          />
        </div>
      ))}
      <Form form={form} variant="borderless" className="flex gap-1" onFinish={handleSendMessage}>
        <Form.Item<Message> noStyle name="message" className="flex-1">
          <Input
            showCount
            maxLength={200}
            allowClear
            ref={inputRef}
            className="rounded-sm"
            placeholder="Nhập tin nhắn, nhấn Enter để gửi..."
          />
        </Form.Item>
        <Form.Item noStyle dependencies={['message']}>
          {({ getFieldValue }) => {
            const text = getFieldValue('message')?.trim()
            return (
              <Button disabled={!text} className="px-1" htmlType="submit" type="link">
                <SendOutlined className="text-xl" />
              </Button>
            )
          }}
        </Form.Item>
        <Upload
          fileList={fileList}
          listType="picture"
          maxCount={1}
          showUploadList={false}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          <Button disabled={fileList.length > 0} className="px-1" type="link">
            <PaperClipOutlined className="text-xl" />
          </Button>
        </Upload>
        {previewImage && (
          <AntdImage
            wrapperStyle={{ display: 'none' }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(''),
            }}
            src={previewImage}
          />
        )}
      </Form>
    </>
  )

  return (
    <>
      <Popover
        title={title}
        content={quickChat ? quickChatContent : content}
        open={open}
        onOpenChange={() => setCount(0)}
        trigger="click"
        overlayInnerStyle={{
          marginRight: '0.5rem',
          width: '26rem',
          maxWidth: '96vw',
          height: '26rem',
          maxHeight: '102vh',
        }}
      >
        <FloatButton
          onClick={() => setOpen(!open)}
          className="h-12 w-12"
          icon={<CommentOutlined className="text-xl text-sky-500" />}
          badge={{ count }}
        />
      </Popover>
    </>
  )
}
