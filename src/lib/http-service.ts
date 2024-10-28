import axios from 'axios'

const get = (url: string) => axios.get(url).then((res) => res.data)

const getWithSession = (url: string, session: any) =>
  axios.get(`${url}?session=${session}`).then((res) => res.data)

const getWithParams = (url: string, params: any) =>
  axios.get(url, { params: params, paramsSerializer: { indexes: true } }).then((res) => res.data)

const getWithSessionParams = (url: string, session: any, params: any) =>
  axios
    .get(`${url}?session=${session}`, { params: params, paramsSerializer: { indexes: true } })
    .then((res) => res.data)

const post = (url: string, data?: any) => axios.post(url, data).then((res) => res.data)

const put = (url: string, data?: any) => axios.put(url, data).then((res) => res.data)

const del = (url: string) => axios.delete(url)

const httpService = {
  get,
  getWithSession,
  getWithParams,
  getWithSessionParams,
  post,
  put,
  del,
}
export default httpService
