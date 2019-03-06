export const queryApp = () => {
  return {
    'content': [{
      'id': 'f6fc9345-1711-11e9-9bf7-d8c49792dd7b',
      'appname': 'Acp-Admin',
      'secret': 'E0D3024D-9A22-41EE-AC0F-FC6B56E367AE',
      'accessTokenValiditySeconds': 86400,
      'refreshTokenValiditySeconds': 2592000,
      'covert': false
    }, {
      'id': 'a0c343b8-1760-11e9-9bf7-d8c49792dd7b',
      'appname': 'fsdafaf',
      'secret': '19033315-30F8-4FDD-896A-F646A5A08847',
      'accessTokenValiditySeconds': 123,
      'refreshTokenValiditySeconds': 123213,
      'covert': true
    }],
    'pageable': {
      'sort': { 'unsorted': false, 'sorted': true, 'empty': false },
      'offset': 0,
      'pageSize': 10,
      'pageNumber': 0,
      'paged': true,
      'unpaged': false
    },
    'totalElements': 3,
    'totalPages': 1,
    'last': true,
    'size': 10,
    'number': 0,
    'sort': { 'unsorted': false, 'sorted': true, 'empty': false },
    'numberOfElements': 3,
    'first': true,
    'empty': false
  }
}
export const deleteApp = () => {
  return {
    message: '删除成功'
  }
}
export const updateApp = () => {
  return {
    'id': 'a0c343b8-1760-11e9-9bf7-d8c49792dd7b',
    'appname': 'fsdafaf',
    'secret': '19033315-30F8-4FDD-896A-F646A5A08847',
    'accessTokenValiditySeconds': 123,
    'refreshTokenValiditySeconds': 123213,
    'covert': true
  }
}
export const getAppList = () => {
  return [{
    'id': 'dbd1458a-19fb-11e9-894e-d8c49792dd7b',
    'appname': 'Acp-Admin',
    'secret': 'E0D3024D-9A22-41EE-AC0F-FC6B56E367AE',
    'accessTokenValiditySeconds': 86400,
    'refreshTokenValiditySeconds': 2592000,
    'covert': false
  }, {
    'id': 'aa4da240-1bf2-11e9-a49e-d8c49792dd7b',
    'appname': 'test',
    'secret': '2DB1B4C6-F6C3-4A3B-9250-74D91AC8F648',
    'accessTokenValiditySeconds': 84600,
    'refreshTokenValiditySeconds': 2592000,
    'covert': true
  }]
}
