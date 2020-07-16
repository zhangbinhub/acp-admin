import ApiComm from '@/api'
import { doDownLoadFile } from '@/libs/tools'
import encrypt from 'js-base64'

export default {
  searchFile: () => {
    return ApiComm.$http.get('/deploy/file')
  },
  uploadFileUrl: () => {
    return ApiComm.$store.state.app.appInfo.baseURL + '/deploy/file'
  },
  deleteFile: (fileName) => {
    return ApiComm.$http.delete('/deploy/file?fileName=' + encodeURIComponent(encrypt.Base64.encode(fileName)))
  },
  downLoadFile: (fileName) => {
    doDownLoadFile(ApiComm.$store.state.app.appInfo.baseURL + '/deploy/file-download', 'get', { fileName: encrypt.Base64.encode(fileName) })
  },
  create: (info) => {
    return ApiComm.$http.put('/deploy/task', info)
  },
  delete: (ids) => {
    return ApiComm.$http.delete('/deploy/task', {
      data: ids
    })
  },
  update: (info) => {
    return ApiComm.$http.patch('/deploy/task', info)
  },
  query: (query) => {
    return ApiComm.$http.post('/deploy/task', query)
  },
  execute: (id) => {
    return ApiComm.$http.post('/deploy/task-execute/' + id)
  }
}
