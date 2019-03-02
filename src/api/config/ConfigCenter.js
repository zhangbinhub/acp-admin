import ApiComm from '../ApiComm'

export default {
  create: (paramInfo) => {
    return ApiComm.$http.put('/oauth/properties', paramInfo)
  },
  delete: (paramIds) => {
    return ApiComm.$http.delete('/oauth/properties', {
      data: paramIds
    })
  },
  update: (paramInfo) => {
    return ApiComm.$http.patch('/oauth/properties', paramInfo)
  },
  query: (query) => {
    return ApiComm.$http.post('/oauth/properties', query)
  },
  refreshAll: () => {
    return ApiComm.$http.post('/oauth/properties/refresh', {}, {
      timeout: 600000
    })
  }
}
