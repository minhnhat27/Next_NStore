import { Button } from 'antd'

export const dynamic = 'force-static'

type Section = { title: string; description: string; phone: string }

const sections: Section[] = [
  {
    title: 'Bộ phận Bán hàng',
    description:
      'Đội ngũ bán hàng chuyên nghiệp luôn sẵn sàng hỗ trợ và tư vấn tận tình cho khách hàng.',
    phone: '1800 123 4567',
  },
  {
    title: 'Bộ phận Khiếu nại',
    description:
      'Chúng tôi luôn coi trọng sự hài lòng của khách hàng và cam kết xử lý các khiếu nại một cách nhanh chóng và hiệu quả.',
    phone: '1800 123 4567',
  },
  {
    title: 'Bộ phận Đổi trả',
    description:
      'Chúng tôi cung cấp chính sách đổi trả hàng nhanh chóng, dễ dàng để đảm bảo sự hài lòng của bạn.',
    phone: '1800 123 4567',
  },
  {
    title: 'Bộ phận Marketing',
    description:
      'Đội ngũ marketing hợp tác chặt chẽ với các doanh nghiệp để giúp họ phát triển và thành công.',
    phone: '1800 123 4567',
  },
]

export default function Contact() {
  return (
    <>
      <div className="text-4xl text-center text-blue-950 py-8 px-4">
        Chúng tôi luôn sẵn sàng hỗ trợ bạn
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        {sections.map((section, i) => (
          <div
            key={i}
            className="flex flex-col bg-gray-100 rounded-lg border drop-shadow p-6 w-64 text-center"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">{section.title}</h3>
            <p className="flex-1 text-sm text-gray-600 mb-4">{section.description}</p>
            <Button type="link" className="font-medium hover:underline">
              {section.phone}
            </Button>
          </div>
        ))}
      </div>
      <div className="text-center text-xl text-blue-950 py-8 px-4">
        Hoặc liên hệ với chúng tôi qua Chatbox để được hỗ trợ sớm nhất
      </div>
    </>
  )
}
