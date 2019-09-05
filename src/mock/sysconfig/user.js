export const getModUserList = () => {
  return [{
    'id': '163c7453-1eef-11e9-8980-d8c49792dd7b',
    'name': 'test',
    'loginNo': 'lll',
    'mobile': '111',
    'levels': 1,
    'enabled': true,
    'sort': 1,
    'organizationSet': [],
    'organizationMngSet': [],
    'roleSet': []
  }]
}
export const getUserList = () => {
  return {
    'content': [{
      'id': 'dbfd58aa-19fb-11e9-894e-d8c49792dd7b',
      'name': 'ZhangBin',
      'loginNo': 'admin',
      'mobile': '13888888888',
      'levels': 0,
      'enabled': true,
      'sort': 0,
      'organizationSet': [],
      'organizationMngSet': [],
      'roleSet': [{
        'id': 'dbe88dbc-19fb-11e9-894e-d8c49792dd7b',
        'appId': '8a80cb816c0a5d4f016c0a5e0c020000',
        'name': '超级管理员',
        'code': 'ADMIN',
        'levels': 0,
        'sort': 0
      }]
    }, {
      'id': '163c7453-1eef-11e9-8980-d8c49792dd7b',
      'name': 'test',
      'loginNo': 'test',
      'mobile': '13888888881',
      'levels': 1,
      'enabled': true,
      'sort': 1,
      'organizationSet': [{
        'id': 'a1f6bef2-1a76-11e9-894e-d8c49792dd7b',
        'name': '新机构1',
        'code': '',
        'parentId': 'root',
        'sort': 1,
        'children': []
      }, {
        'id': 'b1d5d7ca-1a78-11e9-894e-d8c49792dd7b',
        'name': '新机构1-1',
        'code': '',
        'parentId': 'a1f6bef2-1a76-11e9-894e-d8c49792dd7b',
        'sort': 1,
        'children': []
      }],
      'organizationMngSet': [{
        'id': 'a1f6bef2-1a76-11e9-894e-d8c49792dd7b',
        'name': '新机构1',
        'code': '',
        'parentId': 'root',
        'sort': 1,
        'children': []
      }, {
        'id': 'b1d5d7ca-1a78-11e9-894e-d8c49792dd7b',
        'name': '新机构1-1',
        'code': '',
        'parentId': 'a1f6bef2-1a76-11e9-894e-d8c49792dd7b',
        'sort': 1,
        'children': []
      }],
      'roleSet': [{
        'id': 'fd3bb9d8-1bf1-11e9-a49e-d8c49792dd7b',
        'appId': '8a80cb816c0a5d4f016c0a5e0c020000',
        'name': '测试人员',
        'code': 'TEST',
        'levels': 1,
        'sort': 1
      }]
    }],
    'pageable': {
      'sort': { 'sorted': true, 'unsorted': false, 'empty': false },
      'offset': 0,
      'pageSize': 10,
      'pageNumber': 0,
      'paged': true,
      'unpaged': false
    },
    'last': true,
    'totalPages': 1,
    'totalElements': 2,
    'size': 10,
    'number': 0,
    'sort': { 'sorted': true, 'unsorted': false, 'empty': false },
    'numberOfElements': 2,
    'first': true,
    'empty': false
  }
}
export const updateUser = () => {
  return {
    'id': '163c7453-1eef-11e9-8980-d8c49792dd7b',
    'name': 'test',
    'loginNo': 'test',
    'mobile': '13888888881',
    'levels': 1,
    'enabled': true,
    'avatar': '/public/img/avatar.5d5d165b.jpg',
    'sort': 1,
    'organizationSet': [{
      'parentId': 'a1f6bef2-1a76-11e9-894e-d8c49792dd7b',
      'children': [],
      'id': '386d4aae-1afc-11e9-a49e-d8c49792dd7b',
      'name': '新机构112',
      'code': '',
      'sort': 1
    }],
    'organizationMngSet': [{
      'parentId': 'a1f6bef2-1a76-11e9-894e-d8c49792dd7b',
      'children': [],
      'id': '99c30635-1ccb-11e9-a49e-d8c49792dd7b',
      'name': '新机构2',
      'code': '',
      'sort': 0
    }, {
      'parentId': 'root',
      'children': [],
      'id': 'a1f6bef2-1a76-11e9-894e-d8c49792dd7b',
      'name': '新机构1',
      'code': '',
      'sort': 1
    }, {
      'parentId': 'a1f6bef2-1a76-11e9-894e-d8c49792dd7b',
      'children': [],
      'id': '386d4aae-1afc-11e9-a49e-d8c49792dd7b',
      'name': '新机构112',
      'code': '',
      'sort': 1
    }],
    'roleSet': [{
      'id': 'fd3bb9d8-1bf1-11e9-a49e-d8c49792dd7b',
      'appId': 'dbd1458a-19fb-11e9-894e-d8c49792dd7b',
      'name': '测试人员',
      'code': 'TEST',
      'levels': 1,
      'sort': 1
    }]
  }
}
export const deleteUser = () => {
  return {
    message: '删除成功'
  }
}
export const resetSuccess = () => {
  return {
    message: '操作成功'
  }
}
