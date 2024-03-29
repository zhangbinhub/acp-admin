<template>
  <div class="login">
    <div class="bg">
      <el-dialog v-model="submitModal" :close-on-click-modal="false" :close-on-press-escape="false"
                 :modal="false" :show-close="false" custom-class="login-dialog" width="300px">
        <template #title>
          <div style="text-align: center">
            <h1>
              <span>{{ text.passwordExpire }}</span>
            </h1>
          </div>
        </template>
        <div>
          <el-form ref="passwordForm" :model="formValidate" :rules="ruleValidate" @submit.native.prevent>
            <el-form-item>
              <input style="display: none;" type="password"/>
            </el-form-item>
            <el-form-item prop="oldPassword">
              <el-input v-model="formValidate.oldPassword" :disabled="modal_loading"
                        :placeholder="text.oldPasswordPlaceholder" autocomplete="off"
                        prefix-icon="el-icon-lock" type="text" @focus="passwordFocus"
                        @keyup.native.enter="handleSubmit">
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="formValidate.password" :disabled="modal_loading"
                        :placeholder="text.passwordPlaceholder" autocomplete="off"
                        prefix-icon="el-icon-lock" type="text" @focus="passwordFocus"
                        @keyup.native.enter="handleSubmit">
              </el-input>
            </el-form-item>
            <el-form-item prop="repeatPassword">
              <el-input v-model="formValidate.repeatPassword" :disabled="modal_loading"
                        :placeholder="text.repeatPasswordPlaceholder" autocomplete="off"
                        prefix-icon="el-icon-lock" type="text" @focus="passwordFocus"
                        @keyup.native.enter="handleSubmit">
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <div style="text-align: center">
            <el-button :loading="modal_loading" style="width: 100%" type="primary"
                       @click="handleSubmit">
              {{ text.submitButton }}
            </el-button>
            <small style="text-align: center;display: block;margin-top: 10px;">
              <el-link href="javascript:void(0)" type="info" @click="gotoLogin">重新登录</el-link>
            </small>
            <small style="text-align: center;display: block;margin-top: 10px;">{{ copyright }}</small>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import '@/assets/styles/login.less'
import {ref} from "vue";

export default {
  name: 'passwordExpire',
  data() {
    return {
      title: this.$store.state.app.appInfo.appName,
      copyright: this.$store.state.app.appInfo.copyright,
      userInfo: {},
      passwordComplexityPolicy: 0,
      text: {
        oldPasswordPlaceholder: this.$i18n.t('forms.pleaseEnter') + this.$i18n.t('forms.old') + this.$i18n.t('forms.password'),
        passwordPlaceholder: this.$i18n.t('forms.pleaseEnter') + this.$i18n.t('forms.new') + this.$i18n.t('forms.password'),
        repeatPasswordPlaceholder: this.$i18n.t('forms.pleaseEnter') + this.$i18n.t('forms.confirmPassword'),
        passwordExpire: this.$i18n.t('pageTitle.passwordExpire'),
        submitButton: this.$i18n.t('forms.buttons.submit')
      },
      submitModal: true,
      modal_loading: false,
      formValidate: {
        oldPassword: '',
        password: '',
        repeatPassword: ''
      },
      ruleValidate: {
        oldPassword: [{
          required: true,
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error(this.$i18n.t('forms.old') + this.$i18n.t('forms.password') + this.$i18n.t('forms.notEmpty')))
              return
            }
            callback()
          },
          trigger: 'blur'
        }],
        password: [{
          required: true,
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error(this.$i18n.t('forms.new') + this.$i18n.t('forms.password') + this.$i18n.t('forms.notEmpty')))
              return
            }
            if (value.length < 8) {
              callback(new Error(this.$i18n.t('forms.new') + this.$i18n.t('forms.password') + this.$i18n.t('forms.lengthNotEnough') + ' 8'))
              return
            }
            switch (this.passwordComplexityPolicy) {
              case 1:
                if (!/([a-zA-Z]+[0-9]+)|([0-9]+[a-zA-Z]+)/.test(value)) {
                  callback(new Error(this.$i18n.t('forms.new') + this.$i18n.t('forms.password') + this.$i18n.t('forms.incorrectFormat')))
                  return
                }
                break
              case 2:
                if (!/([a-zA-Z]+[0-9]+)|([0-9]+[a-zA-Z]+)/.test(value)
                  || !/[`~!@#$%^&*()+=|{}':;,\\"\[\].<>]+/.test(value)) {
                  callback(new Error(this.$i18n.t('forms.new') + this.$i18n.t('forms.password') + this.$i18n.t('forms.incorrectFormat')))
                  return
                }
                break
            }
            callback()
          },
          trigger: 'blur'
        }],
        repeatPassword: [{
          required: true,
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error(this.$i18n.t('forms.confirmPassword') + this.$i18n.t('forms.notEmpty')))
              return
            } else if (value !== this.formValidate.password) {
              callback(new Error(this.$i18n.t('forms.passwordNotEqual') + ''))
              return
            }
            callback()
          },
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    passwordFocus(event) {
      event.target.type = 'password'
    },
    handleSubmit() {
      const currObj = this
      currObj.passwordForm.validate((valid) => {
        if (valid) {
          currObj.modal_loading = true
          currObj.$api.request.auth.updateUserInfo(Object.assign({
            oldPassword: this.formValidate.oldPassword,
            password: this.formValidate.password
          }, this.userInfo)).then(res => {
            if (res) {
              this.$alert(this.$i18n.t('messages.changedPassword') + '', this.$i18n.t('dialog.info'), {
                callback: () => {
                  this.modal_loading = false
                  this.gotoLogin()
                }
              })
            }
            currObj.modal_loading = false
          })
        }
      })
    },
    gotoLogin() {
      this.$api.redirectLogin((callBackFunc) => {
        this.$api.request.auth.doLogOut().then(() => {
          callBackFunc()
        })
      })
    }
  },
  mounted() {
    // 获取用户信息
    this.$api.request.auth.getUserInfo().then((res) => {
      if (res && res.data) {
        this.userInfo = res.data
        if (!res.data.passwordExpire) {
          this.$api.redirectHome()
        }
      }
    })
    // 获取运行配置参数
    this.$api.request.runtime.getConfig(this.$store.state.app.appInfo.passwordComplexityPolicy).then((res) => {
      if (res && res.data && res.data.enabled) {
        this.passwordComplexityPolicy = parseInt(res.data.value)
      } else {
        this.passwordComplexityPolicy = 0
      }
    })
  },
  setup() {
    const passwordForm = ref(null)
    return {passwordForm}
  }
}
</script>
