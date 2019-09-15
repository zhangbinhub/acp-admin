<template>
  <el-card>
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="120px"
             onsubmit="return false;">
      <el-form-item prop="avatar">
        <el-tooltip :content="$t('forms.avatar')" placement="right">
          <el-avatar style="width: 100px; height: 100px; cursor: pointer" :src="formValidate.avatar"
                     @click.native="openAvatarUpload"/>
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="$t('forms.name')" prop="name">
        <el-input ref="name" type="text" v-model="formValidate.name" @keyup.enter.native="handleSubmit('formValidate')"
                  :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('forms.mobile')" prop="mobile">
        <el-input ref="mobile" type="text" v-model="formValidate.mobile"
                  @keyup.enter.native="handleSubmit('formValidate')"
                  :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.mobile')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('forms.changePassword')">
        <el-switch v-model="updatePassword" :disabled="modal_loading"></el-switch>
      </el-form-item>
      <el-form-item v-show="updatePassword" :label="$t('forms.old')+$t('forms.password')" prop="oldPassword">
        <el-input v-model="formValidate.oldPassword" @keyup.enter.native="handleSubmit('formValidate')"
                  autocomplete="off" type="text" @focus.native="this.type='password'" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.old')+$t('forms.password')"></el-input>
      </el-form-item>
      <el-form-item v-show="updatePassword" :label="$t('forms.new')+$t('forms.password')" prop="password">
        <el-input v-model="formValidate.password" :show-password="true"
                  autocomplete="off" type="text" @focus.native="this.type='password'" :disabled="modal_loading"
                  @keyup.enter.native="handleSubmit('formValidate')"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.new')+$t('forms.password')"></el-input>
      </el-form-item>
      <el-form-item v-show="updatePassword" :label="$t('forms.confirmPassword')" prop="repeatPassword">
        <el-input v-model="formValidate.repeatPassword" :show-password="true"
                  autocomplete="off" type="text" @focus.native="this.type='password'"
                  :disabled="modal_loading" @keyup.enter.native="handleSubmit('formValidate')"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.new')+$t('forms.password')"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="default" @click="handleReset('formValidate')" :loading="modal_loading">
          {{$t('forms.buttons.reset')}}
        </el-button>
        <el-button type="primary" @click="handleSubmit('formValidate')" :loading="modal_loading"
                   style="margin-left: 10px">
          {{$t('forms.buttons.submit')}}
        </el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="avatarUpload" :title="$t('forms.avatarUpload')" :fullscreen="true">
      <cropper :crop-button-text="$t('el.messagebox.confirm')" @on-crop="handleCroped"></cropper>
    </el-dialog>
  </el-card>
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
                modal_loading: false
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
                            avatar: this.formValidate.avatar,
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
                                    callback: action => {
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
            }
        },
        activated () {
            this.$nextTick(() => {
                this.$refs['name'].focus()
            })
        }
    }
</script>
