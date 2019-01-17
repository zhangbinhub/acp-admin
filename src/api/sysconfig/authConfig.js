import ApiComm from '../ApiComm'

export default {
  getMenus: () => {
    return ApiComm.$http.get('/oauth/menulist')
  }
}
