import axios from 'axios'

const getProvince = async () => await axios.get('/api/province')

const getDistrict = async (province_id: string) =>
  await axios.get(`/api/province/district/${province_id}`)

const getWard = async (district_id: string) => await axios.get(`/api/province/ward/${district_id}`)

const ProvinceService = {
  getProvince,
  getDistrict,
  getWard,
}
export default ProvinceService
