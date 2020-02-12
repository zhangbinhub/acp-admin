import ApiComm from '../ApiComm'
import { doDownLoadFile } from '@/libs/tools'

export default {
  downLoadFile: (id) => {
    doDownLoadFile(ApiComm.$store.state.app.appInfo.baseURL + '/workflow/definition/file/' + id)
  },
  delete: (paramIds) => {
    return ApiComm.$http.delete('/workflow/definition', {
      data: paramIds
    })
  },
  update: (paramInfo) => {
    return ApiComm.$http.patch('/workflow/definition', paramInfo)
  },
  query: (query) => {
    return ApiComm.$http.post('/workflow/definition', query)
  },
  deploy: (id) => {
    return ApiComm.$http.put('/workflow/definition/deploy/' + id)
  },
  diagram: (key) => {
    return ApiComm.$http.get('/workflow/definition/diagram/' + key + '/gif', {
      responseType: 'blob'
    })
  },
  uploadUrl: () => {
    return ApiComm.$store.state.app.appInfo.baseURL + '/workflow/definition/file'
  }
}
