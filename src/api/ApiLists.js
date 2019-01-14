import oauth from './oauth/OauthApi'
import param from './sysconfig/paramConfig'
import app from './sysconfig/appConfig'

export default Object.assign(
  oauth,
  {
    param: param,
    app: app
  }
)
