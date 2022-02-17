<template>
  <el-card>
    <el-form ref="infoForm" :model="formValidate" :rules="ruleValidate" label-width="undefined"
             @submit.native.prevent>
      <el-form-item prop="avatar">
        <el-avatar style="cursor: pointer" :src="formValidate.avatar" :size="100"
                   @click.native="openAvatarUpload"/>
      </el-form-item>
      <el-form-item :label="$t('forms.loginNo')" prop="loginNo">
        <span>{{ userInfo.loginNo }}</span>
      </el-form-item>
      <el-form-item :label="$t('lang')" prop="lang">
        <el-select-v2 v-model="currLang" :options="langList" @change="selectLang"/>
      </el-form-item>
      <el-form-item :label="$t('forms.name')" prop="name">
        <el-input ref="name" type="text" v-model="formValidate.name" @keyup.enter.native="handleSubmit"
                  :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"/>
      </el-form-item>
      <el-form-item :label="$t('forms.mobile')" prop="mobile">
        <el-input type="text" v-model="formValidate.mobile"
                  @keyup.enter.native="handleSubmit"
                  :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.mobile')"/>
      </el-form-item>
      <el-form-item :label="$t('forms.changePassword')">
        <el-switch v-model="updatePassword" :disabled="modal_loading"/>
      </el-form-item>
      <el-form-item v-show="updatePassword" :label="$t('forms.old')+$t('forms.password')" prop="oldPassword">
        <el-input v-model="formValidate.oldPassword" @keyup.enter.native="handleSubmit"
                  autocomplete="off" type="text" @focus.native="this.type='password'" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.old')+$t('forms.password')"/>
      </el-form-item>
      <el-form-item v-show="updatePassword" :label="$t('forms.new')+$t('forms.password')" prop="password">
        <el-input v-model="formValidate.password" :show-password="true"
                  autocomplete="off" type="text" @focus.native="this.type='password'" :disabled="modal_loading"
                  @keyup.enter.native="handleSubmit"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.new')+$t('forms.password')"/>
      </el-form-item>
      <el-form-item v-show="updatePassword" :label="$t('forms.confirmPassword')" prop="repeatPassword">
        <el-input v-model="formValidate.repeatPassword" :show-password="true"
                  autocomplete="off" type="text" @focus.native="this.type='password'"
                  :disabled="modal_loading" @keyup.enter.native="handleSubmit"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.new')+$t('forms.password')"/>
      </el-form-item>
      <el-form-item>
        <el-button type="default" @click="handleReset" :loading="modal_loading">
          {{ $t('forms.buttons.reset') }}
        </el-button>
        <el-button type="primary" @click="handleSubmit" :loading="modal_loading"
                   style="margin-left: 10px">
          {{ $t('forms.buttons.submit') }}
        </el-button>
      </el-form-item>
    </el-form>
    <el-dialog v-model="avatarUpload" :title="$t('forms.avatarUpload')" :fullscreen="true">
      <cropper :crop-button-text="$t('el.messagebox.confirm')" @on-crop="handleCroped"/>
      <el-backtop :visibility-height="10" target=".el-dialog"/>
    </el-dialog>
  </el-card>
</template>
<script>
import avatarImg from '@/assets/images/avatar/avatar.jpg'
import Cropper from '@/components/cropper'
import 'cropperjs/dist/cropper.min.css'
import {nextTick, ref} from "vue";

export default {
  name: 'personalInformation',
  components: {
    Cropper
  },
  data() {
    return {
      currLang: this.$store.state.app.lang.lang,
      formValidate: {
        avatar: avatarImg,
        name: '',
        mobile: '',
        oldPassword: '',
        password: '',
        repeatPassword: ''
      },
      passwordComplexityPolicy: 0,
      updatePassword: false,
      avatarUpload: false,
      modal_loading: false
    }
  },
  created() {
    this.resetFieldsValue(this.userInfo)
  },
  watch: {
    userInfo(newUserInfo) {
      this.resetFieldsValue(newUserInfo)
    }
  },
  computed: {
    langList() {
      return this.$store.state.app.lang.langList
    },
    ruleValidate() {
      return {
        name: [
          {
            required: true,
            message: this.$i18n.t('forms.name') + this.$i18n.t('forms.notEmpty'),
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: this.$i18n.t('forms.mobile') + this.$i18n.t('forms.notEmpty'),
            trigger: 'blur'
          },
          {
            type: 'string',
            pattern: /^1[0-9]{10}$/,
            message: this.$i18n.t('forms.mobile') + this.$i18n.t('forms.invalid'),
            trigger: 'blur'
          }
        ],
        oldPassword: [{
          required: true,
          validator: (rule, value, callback) => {
            if (this.updatePassword) {
              if (value === '') {
                callback(new Error(this.$i18n.t('forms.old') + this.$i18n.t('forms.password') + this.$i18n.t('forms.notEmpty')))
                return
              }
            }
            callback()
          },
          trigger: 'blur'
        }],
        password: [{
          required: true,
          validator: (rule, value, callback) => {
            if (this.updatePassword) {
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
            }
            callback()
          },
          trigger: 'blur'
        }],
        repeatPassword: [{
          required: true,
          validator: (rule, value, callback) => {
            if (this.updatePassword) {
              if (value === '') {
                callback(new Error(this.$i18n.t('forms.confirmPassword') + this.$i18n.t('forms.notEmpty')))
                return
              } else if (value !== this.formValidate.password) {
                callback(new Error(this.$i18n.t('forms.passwordNotEqual') + ''))
                return
              }
            }
            callback()
          },
          trigger: 'blur'
        }]
      }
    },
    userInfo() {
      return this.$store.state.app.user.userInfo
    }
  },
  methods: {
    selectLang(name) {
      this.$store.commit('SET_LANG', name)
    },
    openAvatarUpload() {
      this.avatarUpload = true
    },
    handleCroped(data) {
      this.avatarUpload = false
      this.formValidate.avatar = data
    },
    handleSubmit() {
      this.infoForm.validate((valid) => {
        if (valid) {
          this.modal_loading = true
          const userParam = {
            avatar: this.formValidate.avatar !== avatarImg ? this.formValidate.avatar : '',
            name: this.formValidate.name,
            mobile: this.formValidate.mobile
          }
          if (this.updatePassword) {
            userParam.oldPassword = this.formValidate.oldPassword
            userParam.password = this.formValidate.password
          }
          this.$api.request.auth.updateUserInfo(userParam).then((res) => {
            this.$store.commit('SET_USER_INFO', res.data)
            this.$message.success(this.$i18n.t('messages.saveSuccess') + '')
            if (this.updatePassword) {
              this.$alert(this.$i18n.t('messages.changedPassword') + '', this.$i18n.t('dialog.info'), {
                callback: () => {
                  this.modal_loading = false
                  this.$api.redirectLogin((callBackFunc) => {
                    this.$api.request.auth.doLogOut().then(() => {
                      callBackFunc()
                    })
                  })
                }
              })
            } else {
              this.modal_loading = false
            }
          }).catch(() => {
            this.modal_loading = false
          })
        }
      })
    },
    handleReset(name) {
      this.infoForm.resetFields()
      this.resetFieldsValue(this.userInfo)
    },
    resetFieldsValue(userInfo) {
      if (userInfo.avatar && userInfo.avatar !== '') {
        this.formValidate.avatar = userInfo.avatar
      } else {
        this.formValidate.avatar = avatarImg
      }
      this.formValidate.name = userInfo.name
      this.formValidate.mobile = userInfo.mobile
    }
  },
  activated() {
    nextTick(() => {
      this.name.focus()
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
    const infoForm = ref(null)
    const name = ref(null)
    return {infoForm, name}
  }
}
</script>
