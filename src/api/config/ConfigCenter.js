import ApiComm from '../ApiComm'
import Qs from 'qs'

export default {
  create: (paramInfo) => {
    return ApiComm.$http.put('/config/properties', paramInfo)
  },
  delete: (paramIds) => {
    return ApiComm.$http.delete('/config/properties', {
      data: paramIds
    })
  },
  update: (paramInfo) => {
    return ApiComm.$http.patch('/config/properties', paramInfo)
  },
  query: (query) => {
    return ApiComm.$http.post('/config/properties', query)
  },
  getServerList: () => {
    return ApiComm.$http.get('/config/properties/services')
  },
  refreshAll: () => {
    return ApiComm.$http.post('/config/properties/refresh', {}, {
      timeout: 600000
    })
  },
  refreshApp: (applicationName) => {
    return ApiComm.$http.post('/config/properties/refresh/application', {
      applicationName: applicationName
    }, {
      timeout: 600000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      transformRequest: [function (data) {
        data = Qs.stringify(data)
        return data
      }]
    })
  },
  refreshMatcher: (matcher) => {
    return ApiComm.$http.post('/config/properties/refresh/matcher', {
      matcher: matcher
    }, {
      timeout: 600000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      transformRequest: [function (data) {
        data = Qs.stringify(data)
        return data
      }]
    })
  }
}
