export const queryApp = () => {
  return {
    'content': [{
      'id': 'f6fc9345-1711-11e9-9bf7-d8c49792dd7b',
      'appname': 'Acp-Admin',
      'secret': 'E0D3024D-9A22-41EE-AC0F-FC6B56E367AE',
      'access_token_validity_seconds': 86400,
      'refresh_token_validity_seconds': 2592000,
      'covert': false
    }, {
      'id': 'a0c343b8-1760-11e9-9bf7-d8c49792dd7b',
      'appname': 'fsdafaf',
      'secret': '19033315-30F8-4FDD-896A-F646A5A08847',
      'access_token_validity_seconds': 123,
      'refresh_token_validity_seconds': 123213,
      'covert': true
    }],
    'pageable': {
      'sort': { 'unsorted': false, 'sorted': true, 'empty': false },
      'offset': 0,
      'page_size': 10,
      'page_number': 0,
      'paged': true,
      'unpaged': false
    },
    'total_elements': 3,
    'total_pages': 1,
    'last': true,
    'size': 10,
    'number': 0,
    'sort': { 'unsorted': false, 'sorted': true, 'empty': false },
    'number_of_elements': 3,
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
    'access_token_validity_seconds': 123,
    'refresh_token_validity_seconds': 123213,
    'covert': true
  }
}
