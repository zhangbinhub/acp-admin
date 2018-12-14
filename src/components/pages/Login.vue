<template>
  <div class="login">
    <div class="bg">
      <Modal class="login-modal" v-model="loginModal" width="360" :closable="false" :mask-closable="false">
        <div slot="header" style="text-align: center;">
          <h1 style="margin:10px;">
            <Row type="flex" justify="center" align="middle" style="text-align: center;">
              <Col span="24">
                <span style="color: #657180;">{{title}}</span>
                <span style="text-align: center;font-size: x-small;color: #c5c8ce;">&nbsp;V{{version}}</span>
              </Col>
            </Row>
          </h1>
        </div>
        <div>
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-position="right" :label-width="80">
            <FormItem label="用户名" prop="name">
              <Input v-model="formValidate.name" type="text" placeholder="请输入姓名"/>
            </FormItem>
            <FormItem label="密码" prop="password">
              <Input v-model="formValidate.password" type="password" placeholder="请输入密码"
                     @keyup.native.enter="handleSubmit('formValidate')"/>
            </FormItem>
            <FormItem style="margin-bottom: 0;">
              <CheckboxGroup v-model="formValidate.remember">
                <Checkbox label="记住我"></Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button type="primary" size="large" long :loading="modal_loading" @click="handleSubmit('formValidate')">登录
          </Button>
          <small style="text-align: center;display:block">©copyright by ZhangBin</small>
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
        title: this.$store.state.app.appName,
        version: this.$store.state.app.appVersion,
        loginModal: true,
        modal_loading: false,
        formValidate: {
          name: '',
          password: ''
        },
        ruleValidate: {
          name: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码错误', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          this.modal_loading = true
          setTimeout(() => {
            this.modal_loading = false
            if (valid) {
              this.$Message.success('登录成功!')
              this.$store.commit('SET_TOKEN', this.formValidate.password)
              this.$router.push('/index')
            } else {
              this.$Message.error('表单验证失败!')
              this.$Notice.warning({
                title: '登录提示',
                desc: '用户名/密码 随意输入...'
              })
            }
          }, 2000)
        })
      }
    }
  }
</script>
