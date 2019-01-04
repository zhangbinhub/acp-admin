<template>
  <Card>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <Form-item :label="$t('forms.name')" prop="name">
        <Input v-model="formValidate.name" :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"></Input>
      </Form-item>
      <Form-item :label="$t('forms.mobile')" prop="mobile">
        <Input v-model="formValidate.mobile" :placeholder="$t('forms.pleaseEnter') + $t('forms.mobile')"></Input>
      </Form-item>
    </Form>
  </Card>
</template>
<script>
  export default {
    name: 'personalInformation',
    computed: {
      formValidate () {
        return {
          portrait: this.$store.state.app.user.userInfo.portrait,
          name: this.$store.state.app.user.userInfo.name,
          mobile: this.$store.state.app.user.userInfo.mobile
        }
      },
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
    }
  }
</script>
