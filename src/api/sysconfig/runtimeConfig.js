import ApiComm from '../ApiComm'

export default {
  create: (paramInfo) => {
    return ApiComm.$http.put('/oauth/runtime', paramInfo)
  },
  delete: (paramIds) => {
    return ApiComm.$http.delete('/oauth/runtime', {
      data: paramIds
    })
  },
  update: (paramInfo) => {
    return ApiComm.$http.patch('/oauth/runtime', paramInfo)
  },
  query: (query) => {
    return ApiComm.$http.post('/oauth/runtime', query)
  }
}
