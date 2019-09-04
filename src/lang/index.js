import zhLocale from './lang-zh-CN'
import enLocale from './lang-en-US'
import twLocale from './lang-zh-TW'

let langInfo = {
  defaultLang: 'CN',
  langArrays: [],
  messages: {
    CN: zhLocale,
    TW: twLocale,
    EN: enLocale
  }
}

let langArrays = []
for (let key of Object.keys(langInfo.messages)) {
  langArrays.push(key)
}
langInfo.langArrays = langArrays

export default langInfo
