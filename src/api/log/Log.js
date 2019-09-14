import ApiComm from '../ApiComm'
import Qs from 'qs'

export default {
  searchFile: (startDate, endDate) => {
    return ApiComm.$http.post('/log/files', {
      startDate: startDate,
      endDate: endDate
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      transformRequest: [function (data) {
        data = Qs.stringify(data)
        return data
      }]
    })
  },
  downLoadFile: (fileName) => {
    return ApiComm.$http.get('/log/files/' + encodeURIComponent(fileName), {
      headers: {
        'Process400': 'false'
      },
      responseType: 'blob'
    })
  },
  queryRouteLog: (query) => {
    return ApiComm.$http.post('/log/gatewayroutelog', query)
  }
}
