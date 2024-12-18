'use client'

import {
  CloseCircleOutlined,
  CloseOutlined,
  CommentOutlined,
  PaperClipOutlined,
  SendOutlined,
} from '@ant-design/icons'
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
  Skeleton,
} from 'antd'
import NextImage from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { compressImage, formatDate, getBase64 } from '~/utils/common'
import Message from '../ui/message'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'

type Message = {
  isUser?: boolean
  content: string
  createAt?: string
  image?: string
}

type Conversations = {
  unread: number
  messages: Message[]
  closed: boolean
}

type GroupedMessages = {
  [key: string]: Message[]
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const storeName = process.env.NEXT_PUBLIC_STORE_NAME

export default function ChatBox() {
  const [session, setSession] = useState<string | null>(() => localStorage.getItem('chat'))

  const [form] = Form.useForm()
  const [open, setOpen] = useState<boolean>(false)

  const inputRef = useRef<InputRef>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const { notification, message } = App.useApp()

  const [loading, setLoading] = useState<boolean>(false)
  const [chatLoading, setChatLoading] = useState<boolean>(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [quickChat, setQuickChat] = useState<boolean>(false)

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const [connection, setConnection] = useState<HubConnection>()
  const [online, setOnline] = useState<boolean>(false)

  const [count, setCount] = useState<number>(0)
  const [hasFetched, setHasFetched] = useState<boolean>(false)

  const handleZaloChat = () => (window.location.href = 'zalo://conversation?phone=0358103707')

  const groupMessagesByDate = useMemo(() => {
    if (!messages) {
      return {} as GroupedMessages
    }
    return messages.reduce((pre: GroupedMessages, message) => {
      const dateKey = message.createAt ? formatDate(message.createAt) : 'unknown_date'
      if (!pre[dateKey]) {
        pre[dateKey] = []
      }
      pre[dateKey].push(message)
      return pre
    }, {})
  }, [messages])

  const onStopChat = async (adminClose: boolean = false) => {
    if (connection && !adminClose) {
      if (session) {
        await connection.invoke('CloseChat', session)
      }
      await connection.stop()
    }
    localStorage.removeItem('chat')
    setSession(null)
    setConnection(undefined)
    setCount(0)
    if (messages.length) setMessages([])
    setFileList([])
    form.resetFields()
    setQuickChat(false)
    setOnline(false)
  }

  const beforeUpload = async (file: File) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error('Chỉ được tải lên ảnh!')
      return Upload.LIST_IGNORE
    }

    // const maxSizeInBytes = 3 * 1024 * 1024 // 3MB
    // if (file.size > maxSizeInBytes) {
    //   message.error('Kích thước ảnh không vượt quá 3MB!')
    //   return Upload.LIST_IGNORE
    // }
  }

  const handleSendMessage: FormProps['onFinish'] = async (values) => {
    try {
      if (connection) {
        let newSession = session
        if (!newSession) {
          newSession = await connection.invoke('StartChat')
          if (newSession) {
            setSession(newSession)
            localStorage.setItem('chat', newSession)
          }
        }

        let image = null

        if (fileList.length) {
          image = await compressImage(fileList[0].originFileObj)
          if (!image) message.error('Ảnh quá lớn không thể gửi ảnh')
        }

        const m: Message = {
          ...values,
          isUser: true,
          createAt: new Date().toISOString(),
          image,
        }
        form.resetFields()
        setFileList([])

        setMessages((pre) => [...pre, m])
        await connection.invoke('SendToAdmin', newSession, values.content, image)
      }
    } catch (error) {
      console.log(error)
      message.error('Có lỗi xảy ra. Không thể gửi tin nhắn!')
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
    }
    if (inputRef.current)
      inputRef.current.focus({
        cursor: 'start',
      })
    if (open) setCount(0)
  }, [messages, open])

  const connectChat = async () => {
    try {
      const connect = new HubConnectionBuilder()
        .withUrl(process.env.NEXT_PUBLIC_API_URL + '/hub')
        .withAutomaticReconnect()
        .build()

      connect.on('onUser', (message, image) => {
        const mess: Message = {
          content: message,
          isUser: false,
          createAt: new Date().toISOString(),
          image,
        }
        setMessages((pre) => pre.concat(mess))
        setCount((pre) => pre + 1)
      })

      connect.on('CLOSE_CHAT', () => onStopChat(true))

      await connect.start()
      if (session) await connect.invoke('UpdateConnectionId', session)
      setConnection(connect)

      const online = await connect.invoke('GetAdminOnline')
      setOnline(online)
      return { connect, online }
    } catch (err) {
      console.error('SignalR connection error: ', err)
      throw new Error('SignalR connection error')
    }
  }

  const onClickQuickChat = async () => {
    try {
      setLoading(true)
      let content: Message[] = [
        {
          content: `Xin chào! ${storeName} rất vui được hỗ trợ bạn.`,
          createAt: new Date().toISOString(),
        },
      ]
      if (!connection) {
        const { online: onl } = await connectChat()
        if (!onl) {
          content.push({
            content: `Hiện tại không có nhân viên đang truy cập! Bạn vui lòng để lại thông tin liên hệ để chúng tôi có thể hỗ trợ bạn tốt nhất!`,
            createAt: new Date().toISOString(),
          })
        }
      }
      setQuickChat(true)
      setMessages(content)
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

  const title = (
    <>
      <div className="h-20 ps-2 pb-2 flex justify-between border-b">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <NextImage
              width={0}
              height={0}
              priority
              sizes="20vw"
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
            <Button type="link" onClick={() => onStopChat()}>
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
    <div className="h-80 flex flex-col">
      <div id="content" ref={contentRef} className="overflow-y-auto py-2 flex flex-col flex-1">
        <div className="text-center text-xs text-gray-400">
          <div>Bắt đầu trò chuyện nhanh với {storeName}.</div>
          <div>Thông tin của bạn sẽ được ẩn.</div>
        </div>
        {Object.keys(groupMessagesByDate).map((date, i) => (
          <div key={i}>
            <Divider plain style={{ fontSize: 12 }}>
              {date}
            </Divider>
            {groupMessagesByDate[date]?.map((e, i) => (
              <Message
                key={i}
                content={e.content}
                isUser={e.isUser}
                createAt={e.createAt}
                image={e.image}
              />
            ))}
          </div>
        ))}
        {/* {messages.map((m, i) => (
          <Message key={i} createAt={m.createAt} content={m.content} isUser={m.isUser} />
        ))} */}
      </div>
      <Divider className="my-2" />
      {fileList.map((file, i) => (
        <div key={i} className="relative cursor-pointer select-none w-fit m-1 group">
          <NextImage
            width={0}
            height={0}
            sizes="10vw"
            className="h-12 w-12 rounded object-cover"
            onClick={() => handlePreview(file)}
            src={file.originFileObj ? URL.createObjectURL(file.originFileObj) : ''}
            alt={file.name}
          />
          <CloseCircleOutlined
            onClick={() => setFileList((pre) => pre.filter((e) => e.uid !== file.uid))}
            className="hidden group-hover:block absolute -top-1 -right-1 bg-white rounded-full hover:bg-gray-200"
          />
        </div>
      ))}
      <Form form={form} variant="borderless" className="flex gap-1" onFinish={handleSendMessage}>
        <Form.Item<Message> noStyle name="content" className="flex-1">
          <Input
            showCount
            maxLength={200}
            allowClear
            ref={inputRef}
            className="rounded-sm"
            placeholder="Nhập tin nhắn, nhấn Enter để gửi..."
          />
        </Form.Item>
        <Form.Item noStyle dependencies={['content']}>
          {({ getFieldValue }) => {
            const text = getFieldValue('content')?.trim()
            return (
              <Button disabled={!text} className="px-1" htmlType="submit" type="link">
                <SendOutlined className="text-xl" />
              </Button>
            )
          }}
        </Form.Item>
        <Upload
          beforeUpload={beforeUpload}
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
    </div>
  )

  const onOpenChat = async () => {
    setOpen(!open)
    if (session && !hasFetched) {
      setQuickChat(true)
      setChatLoading(true)
      let newConnect: HubConnection | undefined = connection
      if (!connection) {
        const { connect } = await connectChat()
        newConnect = connect
      }
      if (newConnect) {
        const res: Conversations = await newConnect.invoke('GetConversation', session)
        if (!res) {
          localStorage.removeItem('chat')
          setSession(null)
          setQuickChat(false)
        } else {
          const messages = res.messages ?? []
          setMessages((pre) => pre.concat(messages))
        }
        setHasFetched(true)
      }
      setChatLoading(false)
    } else if (session && !quickChat) setQuickChat(true)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (session) {
          const { connect } = await connectChat()
          const unread: number = await connect.invoke('GetUnread', session)
          setCount(unread)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()

    // eslint-disable-next-line
  }, [session])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (connection && open && session) await connection.invoke('ReadMessage', session)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
    // eslint-disable-next-line
  }, [messages])

  return (
    <>
      <Popover
        title={title}
        content={
          quickChat ? (
            chatLoading ? (
              <>
                <Skeleton avatar active />
                <Skeleton avatar active />
              </>
            ) : (
              quickChatContent
            )
          ) : (
            content
          )
        }
        open={open}
        onOpenChange={() => setCount(0)}
        trigger="click"
        overlayInnerStyle={{
          marginRight: '0.5rem',
          width: '26rem',
          maxWidth: '96vw',
          minHeight: '27rem',
          maxHeight: '102vh',
        }}
      >
        <FloatButton
          onClick={() => onOpenChat()}
          className="h-12 w-12"
          icon={<CommentOutlined className="text-xl text-sky-500" />}
          badge={{ count }}
        />
      </Popover>
    </>
  )
}
