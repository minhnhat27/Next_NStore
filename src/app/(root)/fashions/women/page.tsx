import { Gender } from '~/types/enum'
import Fashions from '../page'
import { Metadata } from 'next'
import { initFilters } from '~/utils/initType'

export const metadata: Metadata = {
  title: 'Thời trang nữ',
  description: 'Fashions Store',
}

export default async function WomenFashions() {
  const filters: FilterType = {
    ...initFilters,
    genders: [Gender.Nữ.toString()],
  }

  return <Fashions filters={filters} />
}
