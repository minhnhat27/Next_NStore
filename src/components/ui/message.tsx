import Image from 'next/image'

interface IProps {
  message: string
  isUser?: boolean
}

export default function Message({ message, isUser }: IProps) {
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
      <div
        className={`p-2 overflow-auto rounded ${
          isUser ? 'bg-sky-50 border drop-shadow-sm' : 'bg-gray-200'
        }`}
      >
        {message}
      </div>
    </div>
  )
}
