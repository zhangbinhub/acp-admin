/**
 * 对象的深拷贝
 * @param srcObj 源对象
 * @returns {any} 拷贝后的对象
 */
export const copy = (srcObj) => {
  return JSON.parse(JSON.stringify(srcObj))
}

/**
 * 判断两个对象是否相等
 * @param x {Object} 对象1
 * @param y {Object} 对象2
 * @return  {Boolean} true 为相等，false 为不等
 */
export const deepEqual = function (x, y) {
  if (x === y) {
    return true
  } else if ((x && typeof x == 'object') && (y && typeof y == 'object')) {
    if (Array.isArray(x) && Array.isArray(y)) {
      // 数组
      if (x.length !== y.length) {
        return false
      }
      for (let item in x) {
        if (y.indexOf(item) === -1) {
          return false
        }
      }
      return true
    } else if (!Array.isArray(x) && !Array.isArray(y)) {
      // 对象
      if (Object.keys(x).length !== Object.keys(y).length) {
        return false
      }
      for (let prop in x) {
        if (y.hasOwnProperty(prop)) {
          if (!deepEqual(x[prop], y[prop])) {
            return false
          }
        } else {
          return false
        }
      }
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

/**
 * 根据 path 获取菜单全路径
 * @param path
 * @param menuList
 * @returns {Array}
 */
export const findFullMenuByPath = (path, menuList) => {
  let result = []
  for (let menu of menuList) {
    if (menu.path === path) {
      result.push(menu)
      break
    } else {
      if (menu.children && menu.children.length > 0) {
        const children = findFullMenuByPath(path, menu.children)
        if (children.length > 0) {
          result.push(menu)
          result = result.concat(children)
          break
        }
      }
    }
  }
  return result
}

/**
 * 根据 path 获取菜单
 * @param path
 * @param menuList
 * @param isFullPath = true
 * @returns Object
 */
export const findMenuByPath = (path, menuList, isFullPath = true) => {
  let result
  for (let menu of menuList) {
    let matched = false
    if (menu.path) {
      const index = menu.path.indexOf('?')
      if (isFullPath || (!isFullPath && index < 0)) {
        if (menu.path === path) {
          matched = true
        }
      } else if (!isFullPath && index > -1) {
        if (menu.path.substring(0, index) === path) {
          matched = true
        }
      }
    }
    if (matched) {
      result = menu
      break
    } else {
      if (menu.children && menu.children.length > 0) {
        result = findMenuByPath(path, menu.children)
        if (result) {
          break
        }
      }
    }
  }
  return result
}

/**
 * 根据菜单名称，获取全路径名称数组
 * @param name
 * @param vm
 * @returns {Array}
 */
export const getOpenedNamesByActiveName = (name, vm) => {
  const fullMenus = findFullMenuByPath(name, vm.$store.state.app.user.menuList)
  if (fullMenus.length > 0) {
    return fullMenus.map(item => (item.children && item.children.length > 0) ? item.id : item.path)
  } else {
    return []
  }
}

export const findNodeUpperByClasses = (ele, classes) => {
  let parentNode = ele.parentNode
  if (parentNode) {
    let classList = parentNode.classList
    if (classList && classes.every(className => classList.contains(className))) {
      return parentNode
    } else {
      return findNodeUpperByClasses(parentNode, classes)
    }
  }
}

export const updateTagNavList = (tagNavList, menuList, route) => {
  const fullPath = route.fullPath
  if (!tagNavList.find(tagNav => tagNav.path === fullPath)) {
    const menu = findMenuByPath(fullPath, menuList)
    tagNavList.push({
      name: menu ? menu.name : undefined,
      path: fullPath,
      meta: route.meta,
      routeName: route.name,
      routeQuery: route.query || {},
      routeParams: route.params || {}
    })
    return tagNavList
  }
}

/**
 * 将后台返回数据转换为tree组件数据
 * @param nodeList Array
 * @param showCode label中是否显示code信息，默认true
 */
export const processTreeNode = (nodeList, showCode = true) => {
  for (let item of nodeList) {
    if (!item.children) {
      item.children = []
    }
    if (!item.label || item.label === '') {
      item.label = item.name
      if (showCode && item.code) {
        item.label += '(' + item.code + ')'
      }
    }
    if (item.children.length > 0) {
      processTreeNode(item.children)
    }
  }
}

/**
 * 区分全选和半选节点ID
 * @param nodeList Array
 * @param idList Array
 * @return findResult = { checkedIdList: [], halfCheckedIdList: [] } 筛选后的结果对象
 */
export const findCheckedTreeNode = (nodeList, idList) => {
  const findResult = {
    checkedIdList: [],
    halfCheckedIdList: []
  }
  for (let item of nodeList) {
    if (item.children && item.children.length > 0) {
      const childrenFindResult = findCheckedTreeNode(item.children, idList)
      if (arrayIsFullContainOtherArray(childrenFindResult.checkedIdList, item.children.map(child => child.id))) {
        findResult.checkedIdList.push(item.id)
      } else {
        if (arrayIsContainOtherArray(childrenFindResult.checkedIdList, item.children.map(child => child.id)) ||
          arrayIsContainOtherArray(childrenFindResult.halfCheckedIdList, item.children.map(child => child.id))) {
          findResult.halfCheckedIdList.push(item.id)
        }
      }
      findResult.checkedIdList = findResult.checkedIdList.concat(childrenFindResult.checkedIdList)
      findResult.halfCheckedIdList = findResult.halfCheckedIdList.concat(childrenFindResult.halfCheckedIdList)
    } else {
      if (idList.includes(item.id)) {
        findResult.checkedIdList.push(item.id)
      }
    }
  }
  return findResult
}

/**
 * 判断数组是否完全包含另一个数组的所有元素
 * @param srcArray 原数组
 * @param searchArray 目标查询数组
 * @returns {boolean}
 */
export const arrayIsFullContainOtherArray = (srcArray, searchArray) => {
  let result = true
  for (let item of searchArray) {
    if (!srcArray.includes(item)) {
      result = false
      break
    }
  }
  return result
}

/**
 * 判断数组是否包含另一个数组的至少一个元素
 * @param srcArray 原数组
 * @param searchArray 目标查询数组
 * @returns {boolean}
 */
export const arrayIsContainOtherArray = (srcArray, searchArray) => {
  let result = false
  for (let item of searchArray) {
    if (srcArray.includes(item)) {
      result = true
      break
    }
  }
  return result
}

/**
 * 树节点排序
 * @param nodeList Array
 * @param property 排序字段，默认sort
 */
export const sortTreeNodes = (nodeList, property = 'sort') => {
  nodeList.sort((obj1, obj2) => {
    if (obj1[property] > obj2[property]) {
      return 1
    } else if (obj1[property] === obj2[property]) {
      return 0
    } else {
      return -1
    }
  })
  for (let item of nodeList) {
    if (item.children && item.children.length > 0) {
      sortTreeNodes(item.children, property)
    }
  }
}

/**
 * 获取树中某个节点的全路径 label 字符串
 * @param treeData 树全数据 Array
 * @param targetId 指定节点id
 * @param property 拼接的属性名，default='label'
 * @param separate 分隔字符串，default=' > '
 * @returns String
 */
export const getTreeFullPathTitle = (treeData, targetId, property = 'label', separate = ' > ') => {
  for (let item of treeData) {
    if (item.id === targetId) {
      return item[property]
    } else {
      if (item.children && item.children.length > 0) {
        const childrenPathTitle = getTreeFullPathTitle(item.children, targetId, property, separate)
        if (childrenPathTitle !== '') {
          return item[property] + separate + childrenPathTitle
        }
      }
    }
  }
  return ''
}

/**
 * 获取树中某个节点的全路径节点数组
 * @param treeData 树全数据 Array
 * @param target 指定节点属性值
 * @param property 匹配属性名，默认id
 * @returns Array
 */
export const getTreeFullPathArray = (treeData, target, property = 'id') => {
  for (let item of treeData) {
    if (item[property] === target) {
      return [item]
    } else {
      if (item.children && item.children.length > 0) {
        const childrenArray = getTreeFullPathArray(item.children, target, property)
        if (childrenArray.length > 0) {
          return [item, ...getTreeFullPathArray(item.children, target, property)]
        }
      }
    }
  }
  return []
}

/**
 * 过滤树中指定id的节点
 * @param treeData 树全数据 Array
 * @param targetIds id数组 Array
 * @returns Array
 */
export const filterTreeNode = (treeData, targetIds) => {
  const filterData = treeData.filter(item => {
    return !targetIds.includes(item.id)
  })
  for (let item of filterData) {
    if (item.children && item.children.length > 0) {
      item.children = filterTreeNode(item.children, targetIds)
    }
  }
  return filterData
}

/**
 * 下载文件
 * @param action 文件下载链接
 * @param method 请求方法，默认 get
 * @param params 请求参数，默认 undefined
 */
export const doDownLoadFile = (action, method = 'get', params = undefined) => {
  let form = document.createElement('form')
  form.style.display = 'none'
  form.setAttribute('method', method)
  form.setAttribute('action', action)
  form.setAttribute('target', '')
  if (params) {
    let input = document.createElement('input')
    input.name = 'params'
    input.value = JSON.stringify(params)
    form.appendChild(input)
  }
  document.body.appendChild(form)
  form.submit()
  form.remove()
}

/**
 * 判断浏览器是否为手机
 * @returns {boolean}
 */
export const isMobile = () => {
  const result = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
  return !!(result && result.length > 0)
}
