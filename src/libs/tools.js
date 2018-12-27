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
 * @param isFullPath = false
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
  const fullMenus = findFullMenuByPath(name, vm.$store.state.app.userInfo.menuList)
  if (fullMenus.length > 0) {
    return fullMenus.map(item => (item.children && item.children.length > 0) ? item.id : item.path)
  } else {
    return []
  }
}

/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function () {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

export const scrollTop = (el, from = 0, to, duration = 500, endCallback) => {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60)
      }
    )
  }
  const difference = Math.abs(from - to)
  const step = Math.ceil(difference / duration * 50)

  const scroll = (start, end, step) => {
    if (start === end) {
      endCallback && endCallback()
      return
    }

    let d = (start + step > end) ? end : start + step
    if (start > end) {
      d = (start - step < end) ? end : start - step
    }

    if (el === window) {
      window.scrollTo(d, d)
    } else {
      el.scrollTop = d
    }
    window.requestAnimationFrame(() => scroll(d, end, step))
  }
  scroll(from, to, step)
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
