import { Gender } from '~/types/enum'
import Fashions from '../page'
import { Metadata } from 'next'
import { initFilters } from '~/utils/initType'

export const metadata: Metadata = {
  title: 'Thời trang nam',
  description: 'Fashions Store',
}

export default async function MenFashions() {
  const filters: FilterType = {
    ...initFilters,
    genders: [Gender.Nam.toString()],
  }

  return <Fashions filters={filters} />
}
