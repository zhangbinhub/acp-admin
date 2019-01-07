<template>
  <Card>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
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
      <Form-item>
        <Button type="primary" @click="handleSubmit('formValidate')">{{$t('forms.buttons.submit')}}</Button>
        <Button type="default" @click="handleReset('formValidate')" style="margin-left: 10px">
          {{$t('forms.buttons.reset')}}
        </Button>
      </Form-item>
    </Form>
    <Modal v-model="avatarUpload" :title="$t('forms.avatarUpload')" footer-hide fullscreen>
      <cropper :crop-button-text="$t('i.modal.okText')" @on-crop="handleCroped"></cropper>
    </Modal>
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
          mobile: ''
        },
        avatarUpload: false
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
          ]
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
        console.log(data)
        this.avatarUpload = false
        this.formValidate.avatar = data
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Message.success('提交成功!')
          } else {
            this.$Message.error('表单验证失败!')
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
    }
  }
</script>
