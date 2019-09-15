import ApiComm from '../ApiComm'

export default {
  create: (routeInfo) => {
    return ApiComm.$http.put('/route/gatewayroute', routeInfo)
  },
  delete: (routeIds) => {
    return ApiComm.$http.delete('/route/gatewayroute', {
      data: routeIds
    })
  },
  update: (routeInfo) => {
    return ApiComm.$http.patch('/route/gatewayroute', routeInfo)
  },
  query: (query) => {
    return ApiComm.$http.post('/route/gatewayroute', query)
  },
  refreshRoute: () => {
    return ApiComm.$http.post('/route/gatewayroute/refresh', {}, {
      timeout: 600000
    })
  }
}
