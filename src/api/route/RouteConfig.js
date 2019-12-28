import ApiComm from '../ApiComm'

export default {
  create: (routeInfo) => {
    return ApiComm.$http.put('/route/gateway-route', routeInfo)
  },
  delete: (routeIds) => {
    return ApiComm.$http.delete('/route/gateway-route', {
      data: routeIds
    })
  },
  update: (routeInfo) => {
    return ApiComm.$http.patch('/route/gateway-route', routeInfo)
  },
  query: (query) => {
    return ApiComm.$http.post('/route/gateway-route', query)
  },
  refreshRoute: () => {
    return ApiComm.$http.post('/route/gateway-route/refresh', {}, {
      timeout: 600000
    })
  }
}
