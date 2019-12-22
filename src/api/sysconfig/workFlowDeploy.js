import ApiComm from '../ApiComm'

export default {
  downLoadFile: (id) => {
    let form = document.createElement('form')
    form.style.display = 'none'
    form.setAttribute('method', 'get')
    form.setAttribute('action', ApiComm.$store.state.app.appInfo.baseURL + '/workflow/definition/file/' + id)
    form.setAttribute('target', '')
    document.body.appendChild(form)
    form.submit()
    form.remove()
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
    return ApiComm.$http.get('/workflow/definition/diagram/' + key + '/png')
  }
}
