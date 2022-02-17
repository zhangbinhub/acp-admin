<template>
  <div class="login">
    <div class="bg">
      <el-dialog custom-class="login-dialog" v-model="loginModal" width="300px"
                 :modal="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
        <template #title>
          <div style="text-align: center">
            <h1>
              <span>{{ title }}</span>
            </h1>
            <div style="height: 20px">
              <span style="text-align: center;font-size: x-small;">v{{ version }}</span>
            </div>
          </div>
        </template>
        <div>
          <el-form ref="loginForm" :model="formValidate" :rules="ruleValidate" @submit.native.prevent>
            <el-form-item>
              <input type="password" style="display: none;"/>
            </el-form-item>
            <el-form-item prop="loginNo">
              <el-input ref="loginNo" v-model="formValidate.loginNo" type="text" :disabled="modal_loading"
                        :placeholder="text.usernamePlaceholder" prefix-icon="el-icon-user"
                        @keyup.native.enter="handleSubmit">
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input :disabled="modal_loading" :placeholder="text.passwordPlaceholder"
                        @keyup.native.enter="handleSubmit" prefix-icon="el-icon-lock"
                        autocomplete="off" type="text" @focus="passwordFocus"
                        v-model="formValidate.password">
              </el-input>
            </el-form-item>
            <el-form-item style="margin-bottom: 0;">
              <el-checkbox v-model="formValidate.remember" :disabled="modal_loading"
                           @keyup.native.enter="handleSubmit">
                {{ text.rememberMe }}
              </el-checkbox>
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <div style="text-align: center">
            <el-button type="primary" :loading="modal_loading" style="width: 100%"
                       @click="handleSubmit">
              {{ text.loginButton }}
            </el-button>
            <small style="text-align: center;display: block;margin-top: 10px;">{{ copyright }}</small>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import '@/assets/styles/login.less'
import {nextTick, ref} from "vue";
import {getRouteParams} from "@/libs/tools";

export default {
  name: 'login',
  data() {
    return {
      title: this.$store.state.app.appInfo.appName,
      version: this.$store.state.app.appInfo.appVersion,
      copyright: this.$store.state.app.appInfo.copyright,
      homePath: this.$store.state.app.appInfo.homePath,
      text: {
        usernamePlaceholder: this.$i18n.t('forms.pleaseEnter') + this.$i18n.t('forms.loginNo'),
        passwordPlaceholder: this.$i18n.t('forms.pleaseEnter') + this.$i18n.t('forms.password'),
        rememberMe: this.$i18n.t('forms.rememberMe'),
        loginButton: this.$i18n.t('forms.buttons.login')
      },
      loginModal: true,
      modal_loading: false,
      formValidate: {
        loginNo: this.$store.state.app.user.loginNo,
        password: '',
        remember: this.$store.state.app.user.remember
      },
      ruleValidate: {
        loginNo: [
          {
            required: true,
            message: this.$i18n.t('forms.loginNo') + this.$i18n.t('forms.notEmpty'),
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: this.$i18n.t('forms.password') + this.$i18n.t('forms.notEmpty'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    passwordFocus(event) {
      event.target.type = 'password'
    },
    handleSubmit() {
      const currObj = this
      currObj.loginForm.validate((valid) => {
        if (valid) {
          currObj.modal_loading = true
          currObj.$api.request.auth.doLogin(currObj.formValidate.loginNo, currObj.formValidate.password).then(res => {
            if (res) {
              if (res.data.access_token) {
                currObj.$message.success(currObj.$i18n.t('messages.loginSuccess') + '')
                currObj.$store.commit('SET_TOKEN', res.data.access_token)
                currObj.$store.commit('SET_TOKEN_TYPE', res.data.token_type)
                currObj.$store.commit('SET_SCOPE', res.data.scope)
                if (currObj.formValidate.remember) {
                  currObj.$store.commit('SET_LOGIN_NO', currObj.formValidate.loginNo)
                } else {
                  currObj.$store.commit('SET_LOGIN_NO', '')
                }
                currObj.$store.commit('SET_REMEMBER', currObj.formValidate.remember)
                const params = getRouteParams(currObj.$route)
                let redirectPath = currObj.homePath
                if (currObj.$route.query.redirect) {
                  redirectPath = currObj.$route.query.redirect
                } else if (params.redirect) {
                  redirectPath = params.redirect
                }
                currObj.$router.replace(redirectPath)
              } else {
                currObj.$api.errorProcess(currObj.$i18n.t('messages.loginInvalid'), currObj.$i18n.t('messages.loginFailed'))
              }
            }
            currObj.modal_loading = false
          }).catch(() => {
              currObj.modal_loading = false
              currObj.$api.errorProcess(currObj.$i18n.t('messages.failed403'), currObj.$i18n.t('messages.loginFailed'))
            }
          )
        }
      })
    }
  },
  mounted() {
    nextTick(() => {
      this.loginNo.focus()
    })
  },
  setup() {
    const loginForm = ref(null)
    const loginNo = ref(null)
    return {loginForm, loginNo}
  }
}
</script>
