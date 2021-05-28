import ApiComm from '@/api'
import {doDownLoadFile} from '@/libs/tools'
import {Base64} from 'js-base64'

export default {
  searchFile: (path) => {
    return ApiComm.$http.get('/deploy/file?path=' + encodeURIComponent(Base64.encode(path)))
  },
  createFold: (path, foldName) => {
    return ApiComm.$http.put('/deploy/file', {
      path: path,
      name: foldName
    })
  },
  uploadFileUrl: () => {
    return ApiComm.$store.state.app.appInfo.baseURL + '/deploy/file'
  },
  deleteFile: (path, fileName) => {
    return ApiComm.$http.delete('/deploy/file', {
      data: {
        path: path,
        name: fileName
      }
    })
  },
  downLoadFile: (path, fileName) => {
    doDownLoadFile(ApiComm.$store.state.app.appInfo.baseURL + '/deploy/file-download', 'get', {
      path: Base64.encode(path),
      name: Base64.encode(fileName)
    })
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
