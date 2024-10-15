import { Gender } from '~/types/enum'
import Fashions from '../page'
import { Metadata } from 'next'
import { initFilters } from '~/utils/initType'

export const metadata: Metadata = {
  title: 'Thời trang Unisex',
  description: 'Fashions Store',
}

export default async function UnisexFashions() {
  const filters: FilterType = {
    ...initFilters,
    genders: [Gender.Unisex.toString()],
  }

  return <Fashions filters={filters} />
}
