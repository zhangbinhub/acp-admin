import oauth from './oauth/OauthApi'
import runtime from './sysconfig/runtimeConfig'
import app from './sysconfig/appConfig'

export default Object.assign(
  oauth,
  {
    runtime: runtime,
    app: app
  }
)
