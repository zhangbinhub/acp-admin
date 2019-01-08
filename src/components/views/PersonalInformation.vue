<template>
  <Card>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
      <Form-item prop="avatar">
        <Tooltip :content="$t('forms.avatar')" placement="right">
          <Avatar style="width: 150px; height: 150px; cursor: pointer" :src="formValidate.avatar"
                  @click.native="openAvatarUpload"/>
        </Tooltip>
      </Form-item>
      <Form-item :label="$t('forms.name')" prop="name">
        <Input ref="name" v-model="formValidate.name" :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"></Input>
      </Form-item>
      <Form-item :label="$t('forms.mobile')" prop="mobile">
        <Input v-model="formValidate.mobile" :placeholder="$t('forms.pleaseEnter') + $t('forms.mobile')"></Input>
      </Form-item>
      <Form-item :label="$t('forms.changePassword')">
        <Switch v-model="updatePassword">
          <Icon type="md-checkmark" slot="open"></Icon>
          <Icon type="md-close" slot="close"></Icon>
        </Switch>
      </Form-item>
      <Form-item v-show="updatePassword" :label="$t('forms.old')+$t('forms.password')" prop="oldPassword">
        <Input v-model="formValidate.oldPassword" type="password"
               :placeholder="$t('forms.pleaseEnter') + $t('forms.old')+$t('forms.password')"></Input>
      </Form-item>
      <Form-item v-show="updatePassword" :label="$t('forms.new')+$t('forms.password')" prop="password">
        <Input v-model="formValidate.password" :type="passwordType" :icon="passwordIcon" @on-click="showPassword"
               :placeholder="$t('forms.pleaseEnter') + $t('forms.new')+$t('forms.password')"></Input>
      </Form-item>
      <Form-item v-show="updatePassword" :label="$t('forms.confirmPassword')" prop="repeatPassword">
        <Input v-model="formValidate.repeatPassword" :type="passwordType" :icon="passwordIcon" @on-click="showPassword"
               :placeholder="$t('forms.pleaseEnter') + $t('forms.new')+$t('forms.password')"></Input>
      </Form-item>
      <Form-item>
        <Button type="default" @click="handleReset('formValidate')">
          {{$t('forms.buttons.reset')}}
        </Button>
        <Button type="primary" @click="handleSubmit('formValidate')" style="margin-left: 10px">
          {{$t('forms.buttons.submit')}}
        </Button>
      </Form-item>
    </Form>
    <Modal v-model="avatarUpload" :title="$t('forms.avatarUpload')" footer-hide fullscreen>
      <cropper :crop-button-text="$t('i.modal.okText')" @on-crop="handleCroped"></cropper>
    </Modal>
    <Spin size="large" fix v-if="modal_loading"></Spin>
  </Card>
</template>
<script>
  import avatarImg from '@/assets/images/avatar/avatar.jpg'
  import Cropper from '@/components/cropper'
  import 'cropperjs/dist/cropper.min.css'

  export default {
    name: 'personalInformation',
    components: {
      Cropper
    },
    data () {
      return {
        formValidate: {
          avatar: avatarImg,
          name: '',
          mobile: '',
          oldPassword: '',
          password: '',
          repeatPassword: ''
        },
        updatePassword: false,
        avatarUpload: false,
        modal_loading: false,
        passwordType: 'password',
        passwordIcon: 'ios-eye-outline'
      }
    },
    created () {
      this.resetFieldsValue(this.userInfo)
    },
    watch: {
      userInfo (newUserInfo) {
        this.resetFieldsValue(newUserInfo)
      }
    },
    computed: {
      ruleValidate () {
        return {
          name: [
            { required: true, message: this.$i18n.t('forms.name') + this.$i18n.t('forms.notEmpty'), trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: this.$i18n.t('forms.mobile') + this.$i18n.t('forms.notEmpty'), trigger: 'blur' },
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
      userInfo () {
        return this.$store.state.app.user.userInfo
      }
    },
    methods: {
      openAvatarUpload () {
        this.avatarUpload = true
      },
      handleCroped (data) {
        this.avatarUpload = false
        this.formValidate.avatar = data
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.modal_loading = true
            const userParam = {
              id: this.$store.state.app.user.userInfo.id,
              avatar: this.formValidate.avatar,
              name: this.formValidate.name,
              mobile: this.formValidate.mobile
            }
            if (this.updatePassword) {
              userParam.old_password = this.formValidate.oldPassword
              userParam.password = this.formValidate.password
            }
            this.$api.request.updateUserInfo(userParam).then((res) => {
              this.$store.commit('SET_USER_INFO', res.data)
              this.modal_loading = false
              this.$Message.success(this.$i18n.t('messages.saveSuccess'))
            }).catch(() => {
              this.modal_loading = false
            })
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields()
        this.resetFieldsValue(this.userInfo)
      },
      resetFieldsValue (userInfo) {
        if (userInfo.avatar && userInfo.avatar !== '') {
          this.formValidate.avatar = userInfo.avatar
        } else {
          this.formValidate.avatar = avatarImg
        }
        this.formValidate.name = userInfo.name
        this.formValidate.mobile = userInfo.mobile
      },
      showPassword () {
        if (this.passwordType === 'password') {
          this.passwordType = 'text'
          this.passwordIcon = 'ios-eye'
        } else {
          this.passwordType = 'password'
          this.passwordIcon = 'ios-eye-outline'
        }
      }
    }
  }
</script>
