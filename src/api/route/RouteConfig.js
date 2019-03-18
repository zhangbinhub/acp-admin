import ApiComm from '../ApiComm'

export default {
  create: (routeInfo) => {
    return ApiComm.$http.put('/oauth/gatewayroute', routeInfo)
  },
  delete: (routeIds) => {
    return ApiComm.$http.delete('/oauth/gatewayroute', {
      data: routeIds
    })
  },
  update: (routeInfo) => {
    return ApiComm.$http.patch('/oauth/gatewayroute', routeInfo)
  },
  query: (query) => {
    return ApiComm.$http.post('/oauth/gatewayroute', query)
  },
  refreshRoute: () => {
    return ApiComm.$http.post('/oauth/gatewayroute/refresh', {}, {
      timeout: 600000
    })
  }
}
