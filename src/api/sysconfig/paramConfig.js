import ApiComm from '../ApiComm'

export default {
  create: (paramInfo) => {
    return ApiComm.$http.put('/oauth/param', paramInfo)
  },
  delete: (paramIds) => {
    return ApiComm.$http.delete('/oauth/param', {
      data: paramIds
    })
  },
  update: (paramInfo) => {
    return ApiComm.$http.patch('/oauth/param', paramInfo)
  },
  query: (query) => {
    return ApiComm.$http.post('/oauth/param', query)
  }
}
