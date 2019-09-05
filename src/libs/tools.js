/**
 * 对象的深拷贝
 * @param srcObj 源对象
 * @returns {any} 拷贝后的对象
 */
export const copy = (srcObj) => {
  return JSON.parse(JSON.stringify(srcObj))
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

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
  localStorage.AcpAdminTagNaveList = JSON.stringify(list)
}

export const getTagNavListFromLocalstorage = () => {
  const list = localStorage.AcpAdminTagNaveList
  return list ? JSON.parse(list) : []
}

export const updateTagNavList = (tagNavList, menuList, route) => {
  const fullPath = route.fullPath
  if (!tagNavList.find(tagNav => tagNav.path === fullPath)) {
    const menu = findMenuByPath(fullPath, menuList)
    tagNavList.push({
      name: menu ? menu.name : undefined,
      path: fullPath,
      meta: route.meta,
      routeName: route.name
    })
    return tagNavList
  }
}

/**
 * 将后台返回数据转换为tree组件数据
 * @param nodeList Array
 */
export const processTreeNode = (nodeList) => {
  for (let item of nodeList) {
    if (!item.children) {
      item.children = []
    }
    item.label = item.name
    if (item.children.length > 0) {
      processTreeNode(item.children)
    }
  }
}

/**
 * 树节点排序，根据sort属性
 * @param nodeList Array
 * @param property
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
 * @param targetId 指定节点id
 * @returns Array
 */
export const getTreeFullPathArray = (treeData, targetId) => {
  for (let item of treeData) {
    if (item.id === targetId) {
      return [item]
    } else {
      if (item.children && item.children.length > 0) {
        const childrenArray = getTreeFullPathArray(item.children, targetId)
        if (childrenArray.length > 0) {
          return [item, ...getTreeFullPathArray(item.children, targetId)]
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
 * @param data 服务器文件二进制内容
 * @param fileName 文件名
 */
export const doDownLoadFile = (data, fileName) => {
  if (!data) {
    return
  }
  let url = window.URL.createObjectURL(new Blob([data]))
  let link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  link.remove()
}
