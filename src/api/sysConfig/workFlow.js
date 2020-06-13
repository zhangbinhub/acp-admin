import ApiComm from '../ApiComm'

export default {
  queryInstance: (history, query) => {
    if (history) {
      return ApiComm.$http.post('/workflow/history', query)
    } else {
      return ApiComm.$http.post('/workflow/instance', query)
    }
  },
  getInstanceActivity: (processInstanceId) => {
    return ApiComm.$http.get('/workflow/history/' + processInstanceId)
  },
  termination: (processInstanceId, reason) => {
    return ApiComm.$http.delete('/workflow/instance/termination', {
      data: {
        processInstanceId: processInstanceId,
        reason: reason
      }
    })
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
  }
}
