import ApiComm from '../ApiComm'

export default {
  queryInstance: (history, query) => {
    if (history) {
      return ApiComm.$http.post('/workflow/history', query)
    } else {
      return ApiComm.$http.post('/workflow/instance', query)
    }
  },
  getInstance: (processInstanceId) => {
    return ApiComm.$http.get('/workflow/instance/' + processInstanceId)
  },
  getInstanceActivity: (processInstanceId) => {
    return ApiComm.$http.get('/workflow/history/' + processInstanceId)
  },
  diagram: (processInstanceId) => {
    return ApiComm.$http.get('/workflow/diagram/' + processInstanceId + '/gif', {
      responseType: 'blob',
      headers: {
        'Process400': 'false',
        'Process401': 'false',
        'Process403': 'false'
      }
    })
  },
  getTaskList(processInstanceId) {
    return ApiComm.$http.get('/workflow/task-list/' + processInstanceId)
  },
  transferTask(taskId, userId) {
    return ApiComm.$http.patch('/workflow/transfer/' + taskId + '/' + userId)
  },
  distributeTask(taskId, userId) {
    return ApiComm.$http.patch('/workflow/distribute/' + taskId + '/' + userId)
  }
}
