export const updateRuntime = () => {
  return {
    'id': '58e19099-15c5-11e9-95dd-d8c49792dd7b',
    'name': 'name',
    'value': 'value',
    'configDes': 'dnioa你哦按身份111',
    'enabled': false,
    'covert': true
  }
}
export const deleteRuntime = () => {
  return {
    message: '删除成功'
  }
}
export const queryRuntime = () => {
  return {
    'content': [{
      'id': '58e19099-15c5-11e9-95dd-d8c49792dd7b',
      'name': 'name',
      'value': 'value',
      'configDes': 'dnioa你哦按身份',
      'enabled': true,
      'covert': true
    }],
    'pageable': {
      'sort': {'sorted': true, 'unsorted': false, 'empty': false},
      'offset': 0,
      'pageNumber': 0,
      'pageSize': 10,
      'paged': true,
      'unpaged': false
    },
    'last': true,
    'totalPages': 1,
    'totalElements': 1,
    'size': 10,
    'number': 0,
    'sort': {'sorted': true, 'unsorted': false, 'empty': false},
    'numberOfElements': 1,
    'first': true,
    'empty': false
  }
}
