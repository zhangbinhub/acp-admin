export const updateConfig = () => {
  return {
    'id': 'ed0f67a5-3b34-11e9-88b4-d8c49792dd7b',
    'config_application': 'log-server',
    'config_profile': 'prod',
    'config_label': 'master',
    'config_key': 'log-server.max-history-day-number',
    'config_value': '180',
    'config_des': '日志最大保留天数，默认 180 天',
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
      'config_application': 'log-server',
      'config_profile': 'dev',
      'config_label': 'master',
      'config_key': 'log-server.max-history-day-number',
      'config_value': '10',
      'config_des': '日志最大保留天数，默认 180 天',
      'enabled': true
    }, {
      'id': 'ed0f67a5-3b34-11e9-88b4-d8c49792dd7b',
      'config_application': 'log-server',
      'config_profile': 'prod',
      'config_label': 'master',
      'config_key': 'log-server.max-history-day-number',
      'config_value': '180',
      'config_des': '日志最大保留天数，默认 180 天',
      'enabled': true
    }],
    'pageable': {
      'sort': { 'unsorted': false, 'sorted': true, 'empty': false },
      'offset': 0,
      'page_number': 0,
      'page_size': 10,
      'paged': true,
      'unpaged': false
    },
    'total_elements': 2,
    'total_pages': 1,
    'last': true,
    'size': 10,
    'number': 0,
    'sort': { 'unsorted': false, 'sorted': true, 'empty': false },
    'number_of_elements': 2,
    'first': true,
    'empty': false
  }
}
export const refreshConfig = () => {
  return {
    message: 'ok'
  }
}
