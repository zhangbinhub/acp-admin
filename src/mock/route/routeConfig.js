export const updateRoute = () => {
  return {
    'id': '01da3df6-48d6-11e9-9b2a-d8c49792dd7b',
    'routeId': 'log-server-api',
    'uri': 'lb://log-server',
    'predicates': '["Path=/api/log/**"]',
    'filters': '["StripPrefix=1",{"name":"Hystrix","args":{"name":"GateWayHystrix","fallbackUri":"forward:/hystrixhandle"}}]',
    'orderNum': 0,
    'enabled': true,
    'remarks': '日志服务接口'
  }
}
export const deleteRoute = () => {
  return {
    message: '删除成功'
  }
}
export const queryRoute = () => {
  return {
    'content': [{
      'id': '01da3df6-48d6-11e9-9b2a-d8c49792dd7b',
      'routeId': 'log-server-api',
      'uri': 'lb://log-server',
      'predicates': '["Path=/api/log/**"]',
      'filters': '["StripPrefix=1",{"name":"Hystrix","args":{"name":"GateWayHystrix","fallbackUri":"forward:/hystrixhandle"}}]',
      'orderNum': 0,
      'enabled': true,
      'remarks': '日志服务接口'
    }],
    'pageable': {
      'sort': { 'sorted': true, 'unsorted': false, 'empty': false },
      'offset': 0,
      'pageNumber': 0,
      'pageSize': 10,
      'unpaged': false,
      'paged': true
    },
    'totalPages': 1,
    'totalElements': 1,
    'last': true,
    'size': 10,
    'number': 0,
    'sort': { 'sorted': true, 'unsorted': false, 'empty': false },
    'numberOfElements': 1,
    'first': true,
    'empty': false
  }
}
export const refreshRoute = () => {
  return {
    message: '刷新路由缓存成功，稍后网关将刷新路由配置信息'
  }
}
