import Axios from 'axios'
import appInfo from '../../store/config/appInfo'

let axiosInstance = Axios.create({
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  baseURL: appInfo.baseURL,
  timeout: appInfo.timeOut
})

export default axiosInstance
