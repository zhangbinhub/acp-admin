import ApiComm from '../ApiComm'

export default {
  createParam: (paramInfo) => {
    return ApiComm.$http.put('/oauth/param', paramInfo)
  },
  deleteParam: (paramIds) => {
    return ApiComm.$http.delete('/oauth/param', {
      data: paramIds
    })
  },
  updateParam: (paramInfo) => {
    return ApiComm.$http.patch('/oauth/param', paramInfo)
  },
  queryParam: (query) => {
    return ApiComm.$http.post('/oauth/param', query)
  }
}
