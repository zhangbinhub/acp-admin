export const getOrgList = () => {
  return [{
    'id': 'a1f6bef2-1a76-11e9-894e-d8c49792dd7b',
    'name': '新机构1',
    'code': '',
    'parentId': 'root',
    'sort': 1,
    'children': [{
      'id': 'b1d5d7ca-1a78-11e9-894e-d8c49792dd7b',
      'name': '新机构1-1',
      'code': '',
      'parentId': 'a1f6bef2-1a76-11e9-894e-d8c49792dd7b',
      'sort': 1,
      'children': []
    }]
  }, {
    'id': 'f83346f2-1a6a-11e9-894e-d8c49792dd7b',
    'name': '新机构2',
    'code': '',
    'parentId': 'root',
    'sort': 3,
    'children': []
  }]
}
export const getOrgInfo = () => {
  return {
    'id': '78622fc6-1a7b-11e9-894e-d8c49792dd7b',
    'name': '新机构',
    'code': '',
    'parentId': 'root',
    'sort': 3,
    'userIds': ['163c7453-1eef-11e9-8980-d8c49792dd7b']
  }
}
export const deleteOrg = () => {
  return {
    message: '删除成功'
  }
}
