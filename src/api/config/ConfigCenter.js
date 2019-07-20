import ApiComm from '../ApiComm'

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
  refreshAll: () => {
    return ApiComm.$http.post('/config/properties/refresh', {}, {
      timeout: 600000
    })
  },
  refreshApp: (applicationName) => {
    return ApiComm.$http.post('/config/properties/refresh/application', {
      applicationName: applicationName
    }, {
      timeout: 600000
    })
  },
  refreshMatcher: (matcher) => {
    return ApiComm.$http.post('/config/properties/refresh/matcher', {
      matcher: matcher
    }, {
      timeout: 600000
    })
  }
}
