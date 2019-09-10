export const logFileList = () => {
  return [
    'log_2019-01-01.zip',
    'log_2019-01-02.zip',
    'log_2019-01-03.zip',
    'log_2019-01-04.zip',
    'log_2019-01-05.zip',
    'log_2019-01-06.zip',
    'log_2019-01-07.zip',
    'log_2019-01-08.zip',
    'log_2019-01-09.zip',
    'log_2019-01-10.zip'
  ]
}
export const downLoadLogFile = () => {
  return '下载成功'
}
export const queryRouteLog = () => {
  return {
    'content': [{
      'id': '01da3df6-48d6-11e9-9b2a-d8c49792dd7b',
      'remoteIp': '127.0.0.1',
      'gatewayIp': '127.127.127.127',
      'path': '/api/oauth/userinfo',
      'serverId': 'oauth2-server',
      'targetUri': 'http://127.0.0.1:8999/oauth/userinfo',
      'requestTime': 1558452953758,
      'processTime': 57,
      'responseTime': 1558452953815,
      'responseStatus': 200
    }, {
      'id': '01da3df6-48d6-11e9-9b2a-d8c49792dd7c',
      'remoteIp': '127.0.0.1',
      'gatewayIp': '127.0.0.1',
      'path': '/api/oauth/menulist',
      'serverId': 'oauth2-server',
      'targetUri': 'http://127.0.0.1:8999/oauth/menulist',
      'requestTime': 1558452953763,
      'processTime': 61,
      'responseTime': 1558452953824,
      'responseStatus': 500
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
    'totalElements': 2,
    'last': true,
    'size': 10,
    'number': 0,
    'sort': { 'sorted': true, 'unsorted': false, 'empty': false },
    'numberOfElements': 1,
    'first': true,
    'empty': false
  }
}
