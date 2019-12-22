import oauth from './oauth/OauthApi'
import runtime from './sysconfig/runtimeConfig'
import app from './sysconfig/appConfig'
import auth from './sysconfig/authConfig'
import org from './sysconfig/orgConfig'
import user from './sysconfig/userConfig'
import role from './sysconfig/roleConfig'
import log from './log/Log'
import route from './route/RouteConfig'
import workFlowDeploy from './sysconfig/workFlowDeploy'

export default {
  auth: Object.assign(oauth, auth),
  runtime: runtime,
  app: app,
  org: org,
  user: user,
  role: role,
  log: log,
  route: route,
  workFlowDeploy: workFlowDeploy
}
