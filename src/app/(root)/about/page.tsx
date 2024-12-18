import Image from 'next/image'
import { toExternalNextImage, toNextImageLink } from '~/utils/common'

export const dynamic = 'force-static'

const teamMembers = [
  {
    name: 'John Doe',
    role: 'Lập trình viên',
    image: 'https://partyanimals.com/media/avatars/thumbnails/avatars-5.webp',
  },
  {
    name: 'Alice Brown',
    role: 'Quản lý',
    image: 'https://partyanimals.com/media/avatars/thumbnails/avatars-7.webp',
  },
  {
    name: 'Eva Green',
    role: 'Hỗ trợ',
    image: 'https://partyanimals.com/media/avatars/thumbnails/avatars-21.webp',
  },
  {
    name: 'Bob Johnson',
    role: 'Kiểm thử',
    image: 'https://partyanimals.com/media/avatars/thumbnails/avatars-12.webp',
  },
  {
    name: 'John Doe',
    role: 'Thiết kế',
    image: 'https://partyanimals.com/media/avatars/thumbnails/avatars-5.webp',
  },
  {
    name: 'John Doe',
    role: 'Tạo nội dung',
    image: 'https://partyanimals.com/media/avatars/thumbnails/avatars-5.webp',
  },
]

export default function About() {
  return (
    <>
      <div className="text-center text-4xl text-blue-950 py-8 px-4">Đội Ngũ Của Chúng Tôi</div>
      <div className="text-center text-md px-4">
        Chúng tôi là những chuyên gia giàu kinh nghiệm với niềm đam mê công nghệ và cam kết đối với
        sự hài lòng của khách hàng.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 py-8 gap-8 px-10 sm:px:24 lg:px-40">
        {teamMembers.map((member, i) => (
          <div key={i} className="p-4 drop-shadow bg-gray-100 rounded-md">
            <div className="avatar-container mb-4">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                alt={member.name}
                src={toExternalNextImage(member.image)}
                className="rounded-full w-32 h-32 object-cover mx-auto"
              />
            </div>
            <h3 className="text-center text-xl font-semibold">{member.name}</h3>
            <p className="text-center text-gray-500">{member.role}</p>
          </div>
        ))}
      </div>
    </>
  )
}
