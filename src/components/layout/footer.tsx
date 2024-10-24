import Image from 'next/image'
import Link from 'next/link'

const storeName = process.env.NEXT_PUBLIC_STORE_NAME

export default async function Footer() {
  return (
    <footer className="bg-black">
      <div className="lg:container lg:mx-auto transition-all h-full text-white">
        <div className="sm:flex sm:items-center sm:justify-between px-4 sm:px-8">
          <Link href="#" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
            <Image
              width={0}
              height={0}
              sizes="20vw"
              priority
              src="/images/Logo-t-1x1.png"
              className="h-28 w-auto"
              alt="Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
              {storeName}
            </span>
          </Link>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <Link href="#" className="hover:underline me-4 md:me-6">
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline me-4 md:me-6">
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline me-4 md:me-6">
                Điều khoản
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>
        <hr className="my-4 sm:mx-auto border-gray-700" />
        <span className="block text-sm text-center text-gray-400 py-2">
          © 2024{' '}
          <Link href="/" className="hover:underline">
            {storeName}™
          </Link>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  )
}
