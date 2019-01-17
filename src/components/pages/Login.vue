<template>
  <div class="login">
    <div class="bg">
      <Modal class="login-modal" v-model="loginModal" width="300" :closable="false" :mask-closable="false">
        <div slot="header" style="text-align: center;">
          <h1 style="margin:10px;">
            <Row type="flex" justify="center" align="middle" style="text-align: center;">
              <i-col span="24">
                <span style="color: #657180;">{{title}}</span>
                <span style="text-align: center;font-size: x-small;color: #c5c8ce;">&nbsp;V{{version}}</span>
              </i-col>
            </Row>
          </h1>
        </div>
        <div>
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
            <FormItem prop="loginNo">
              <i-input v-model="formValidate.loginNo" type="text" prefix="md-person" :disabled="modal_loading"
                       autofocus="true" :placeholder="text.usernamePlaceholder"/>
            </FormItem>
            <FormItem prop="password">
              <i-input v-model="formValidate.password" type="password" prefix="md-lock" :disabled="modal_loading"
                       :placeholder="text.passwordPlaceholder"
                       @keyup.native.enter="handleSubmit('formValidate')"/>
            </FormItem>
            <FormItem style="margin-bottom: 0;">
              <Checkbox v-model="formValidate.remember" :disabled="modal_loading">
                {{text.rememberMe}}
              </Checkbox>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button type="primary" size="large" long :loading="modal_loading" @click="handleSubmit('formValidate')">
            {{$t('forms.buttons.login')}}
          </Button>
          <small style="text-align: center;display: block;margin-top: 10px;">{{copyright}}</small>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data () {
      return {
        title: this.$store.state.app.appInfo.appName,
        version: this.$store.state.app.appInfo.appVersion,
        copyright: this.$store.state.app.appInfo.copyright,
        homePath: this.$store.state.app.appInfo.homePath,
        text: {
          usernamePlaceholder: this.$i18n.t('forms.pleaseEnter') + this.$i18n.t('forms.loginNo'),
          passwordPlaceholder: this.$i18n.t('forms.pleaseEnter') + this.$i18n.t('forms.password'),
          rememberMe: this.$i18n.t('forms.rememberMe')
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
            { required: true, message: this.$i18n.t('forms.loginNo') + this.$i18n.t('forms.notEmpty'), trigger: 'blur' }
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
      handleSubmit (name) {
        const currObj = this
        currObj.$refs[name].validate((valid) => {
          if (valid) {
            currObj.modal_loading = true
            currObj.$api.request.auth.doLogin(currObj.formValidate.loginNo, currObj.formValidate.password).then(res => {
              currObj.modal_loading = false
              if (res) {
                if (res.data.access_token) {
                  currObj.$Message.success(currObj.$i18n.t('messages.loginSuccess'))
                  currObj.$store.commit('SET_TOKEN', res.data.access_token)
                  currObj.$store.commit('SET_TOKEN_TYPE', res.data.token_type)
                  currObj.$store.commit('SET_SCOPE', res.data.scope)
                  if (currObj.formValidate.remember) {
                    currObj.$store.commit('SET_LOGIN_NO', currObj.formValidate.loginNo)
                  } else {
                    currObj.$store.commit('SET_LOGIN_NO', '')
                  }
                  currObj.$store.commit('SET_REMEMBER', currObj.formValidate.remember)
                  let redirectPath = this.homePath
                  if (currObj.$route.params.redirect) {
                    redirectPath = currObj.$route.params.redirect
                  }
                  currObj.$router.replace(redirectPath)
                } else {
                  currObj.$api.errorProcess(currObj.$i18n.t('messages.loginInvalid'), currObj.$i18n.t('messages.loginFailed'))
                }
              }
            }).catch((error) => {
                currObj.modal_loading = false
                if (error.response && error.response.status && error.response.status === 400) {
                  currObj.$api.errorProcess(currObj.$i18n.t('messages.loginInvalid'), currObj.$i18n.t('messages.loginFailed'))
                } else {
                  currObj.$api.errorProcess(currObj.$i18n.t('messages.failed403'), currObj.$i18n.t('messages.loginFailed'))
                }
              }
            )
          }
        })
      }
    }
  }
</script>
