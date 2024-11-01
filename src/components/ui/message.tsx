import Image from 'next/image'
import { getTimeHHmm } from '~/utils/common'

interface IProps {
  content: string
  isUser?: boolean
  createAt?: Date | string
}

export default function Message({ content, isUser, createAt }: IProps) {
  return (
    <div className={`flex gap-2 m-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {isUser || (
        <Image
          height={0}
          width={0}
          sizes="20vw"
          quality={50}
          priority
          src="/images/Logo-1x1.png"
          className="h-8 w-8 rounded-full"
          alt="logo"
        />
      )}
      <div className={`flex items-end gap-1 ${isUser || 'flex-row-reverse'}`}>
        {createAt && <span className="text-[0.6rem]">{getTimeHHmm(createAt)}</span>}
        <div
          className={`p-2 overflow-auto rounded ${
            isUser ? 'bg-sky-50 border drop-shadow-sm' : 'bg-gray-200'
          }`}
        >
          {content}
        </div>
      </div>
    </div>
  )
}
