export const updateConfig = () => {
  return {
    'id': 'ed0f67a5-3b34-11e9-88b4-d8c49792dd7b',
    'configApplication': 'log-server',
    'configProfile': 'prod',
    'configLabel': 'master',
    'configKey': 'log-server.max-history-day-number',
    'configValue': '180',
    'configDes': '日志最大保留天数，默认 180 天',
    'enabled': true
  }
}
export const deleteConfig = () => {
  return {
    message: '删除成功'
  }
}
export const queryConfig = () => {
  return {
    'content': [{
      'id': 'ed0b2065-3b34-11e9-88b4-d8c49792dd7b',
      'configApplication': 'log-server',
      'configProfile': 'dev',
      'configLabel': 'master',
      'configKey': 'log-server.max-history-day-number',
      'configValue': '10',
      'configDes': '日志最大保留天数，默认 180 天',
      'enabled': true
    }, {
      'id': 'ed0f67a5-3b34-11e9-88b4-d8c49792dd7b',
      'configApplication': 'log-server',
      'configProfile': 'prod',
      'configLabel': 'master',
      'configKey': 'log-server.max-history-day-number',
      'configValue': '180',
      'configDes': '日志最大保留天数，默认 180 天',
      'enabled': true
    }],
    'pageable': {
      'sort': { 'unsorted': false, 'sorted': true, 'empty': false },
      'offset': 0,
      'pageNumber': 0,
      'pageSize': 10,
      'paged': true,
      'unpaged': false
    },
    'totalElements': 2,
    'totalPages': 1,
    'last': true,
    'size': 10,
    'number': 0,
    'sort': { 'unsorted': false, 'sorted': true, 'empty': false },
    'numberOfElements': 2,
    'first': true,
    'empty': false
  }
}
export const refreshConfig = () => {
  return {
    message: 'ok'
  }
}
