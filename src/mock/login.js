export const login = () => {
  return {
    'access_token': '91c37cb7-1868-45c3-9edd-475a236f0c28',
    'token_type': 'bearer',
    'expires_in': 119,
    'scope': 'ALL',
    'refresh_token': '3748bdd7-198c-4902-8322-0172954e0631'
  }
}

export const userInfo = () => {
  return {
    'id': '0048dfe5-0355-11e9-a67b-d8c49792dd7b',
    'name': '超级管理员',
    'loginno': 'admin',
    'mobile': '13888888888',
    'levels': 0,
    'enabled': true,
    'sort': 0,
    'organization_set': [],
    'role_set': [
      {
        'id': '003cf0c0-0355-11e9-a67b-d8c49792dd7b',
        'appid': '0036ef2d-0355-11e9-a67b-d8c49792dd7b',
        'name': '超级管理员',
        'code': 'ADMIN',
        'levels': 0,
        'sort': 0,
        'menu_set': [
          {
            'id': '003b45ad-0355-11e9-a67b-d8c49792dd7b',
            'appid': '0036ef2d-0355-11e9-a67b-d8c49792dd7b',
            'name': '系统配置',
            'icon_class': 'fa-cogs',
            'icon_color': '#1b992f',
            'path': '',
            'parentid': '0036ef2d-0355-11e9-a67b-d8c49792dd7b',
            'enabled': true,
            'covert': false,
            'opentype': 0,
            'dialog_w': 0,
            'dialog_h': 0,
            'sort': 0
          },
          {
            'id': '003b82f7-0355-11e9-a67b-d8c49792dd7b',
            'appid': '0036ef2d-0355-11e9-a67b-d8c49792dd7b',
            'name': '用户配置',
            'icon_class': 'fa-users',
            'icon_color': '#354ab8',
            'path': '/view/page/user/user',
            'parentid': '003b45ad-0355-11e9-a67b-d8c49792dd7b',
            'enabled': true,
            'covert': false,
            'opentype': 0,
            'dialog_w': 0,
            'dialog_h': 0,
            'sort': 1
          },
          {
            'id': '003bb880-0355-11e9-a67b-d8c49792dd7b',
            'appid': '0036ef2d-0355-11e9-a67b-d8c49792dd7b',
            'name': '机构配置',
            'icon_class': 'fa-deviantart',
            'icon_color': '#354ab8',
            'path': '/view/page/department/department',
            'parentid': '003b45ad-0355-11e9-a67b-d8c49792dd7b',
            'enabled': true,
            'covert': false,
            'opentype': 0,
            'dialog_w': 0,
            'dialog_h': 0,
            'sort': 2
          },
          {
            'id': '003bee73-0355-11e9-a67b-d8c49792dd7b',
            'appid': '0036ef2d-0355-11e9-a67b-d8c49792dd7b',
            'name': 'demo',
            'icon_class': 'fa-cogs',
            'icon_color': '#1b992f',
            'path': '',
            'parentid': '0036ef2d-0355-11e9-a67b-d8c49792dd7b',
            'enabled': true,
            'covert': false,
            'opentype': 0,
            'dialog_w': 0,
            'dialog_h': 0,
            'sort': 0
          },
          {
            'id': '003c227f-0355-11e9-a67b-d8c49792dd7b',
            'appid': '0036ef2d-0355-11e9-a67b-d8c49792dd7b',
            'name': '上传',
            'icon_class': 'fa-users',
            'icon_color': '#354ab8',
            'path': '/view/page/demo/upload?_type=0',
            'parentid': '003bee73-0355-11e9-a67b-d8c49792dd7b',
            'enabled': true,
            'covert': true,
            'opentype': 0,
            'dialog_w': 0,
            'dialog_h': 0,
            'sort': 1
          }
        ],
        'module_set': [],
        'module_func_set': []
      }
    ]
  }
}
