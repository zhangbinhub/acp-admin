import ApiComm from '../ApiComm'
import Qs from 'qs'

export default {
  getLoginInfo: () => {
    return ApiComm.$http.get('/log/logininfo')
  },
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
    let form = document.createElement('form')
    form.style.display = 'none'
    form.setAttribute('method', 'get')
    form.setAttribute('action', ApiComm.$store.state.app.appInfo.baseURL + '/log/files/' + encodeURIComponent(fileName))
    form.setAttribute('target', '')
    document.body.appendChild(form)
    form.submit()
    form.remove()
  },
  queryRouteLog: (query) => {
    return ApiComm.$http.post('/log/gatewayroutelog', query)
  },
  queryOperateLog: (query) => {
    return ApiComm.$http.post('/log/operatelog', query)
  },
  queryLoginLog: (query) => {
    return ApiComm.$http.post('/log/loginlog', query)
  }
}
