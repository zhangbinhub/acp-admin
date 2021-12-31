<template>
  <el-card style="min-height: 350px;">
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="auto" :inline="true"
             size="small" @submit.native.prevent>
      <el-form-item :label="$t('forms.startDate')" prop="startDate">
        <el-date-picker type="date" :disabled="form_loading" :disabled-date="disabledDate"
                        v-model="formValidate.startDate"
                        :placeholder="$t('forms.pleaseEnter') + $t('forms.startDate')"
                        style="width: 162px"/>
      </el-form-item>
      <el-form-item :label="$t('forms.endDate')" prop="endDate">
        <el-date-picker type="date" :disabled="form_loading" :disabled-date="disabledDate"
                        v-model="formValidate.endDate"
                        :placeholder="$t('forms.pleaseEnter') + $t('forms.endDate')"
                        style="width: 162px"/>
      </el-form-item>
      <el-form-item>
        <el-button-group>
          <el-button :loading="form_loading" @click="handleSearch()" type="primary">
            {{ $t('forms.buttons.search') }}
          </el-button>
          <el-button :loading="form_loading" @click="handleSearchReset()" type="primary">
            {{ $t('forms.buttons.reset') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>
    <el-divider/>
    <el-row>
      <el-col :span="3" v-for="(file,index) in logFileList" :key="index"
              style="text-align: center;min-width: 150px;margin-bottom: 15px;">
        <el-button type="text" :loading="form_loading" @click="downLoadFile(file)">
          <el-icon size="50">
            <el-icon-document/>
          </el-icon>
        </el-button>
        <p>{{ file }}</p>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
export default {
  name: 'logFile',
  data() {
    return {
      form_loading: false,
      formValidate: {
        startDate: '',
        endDate: ''
      },
      logFiles: []
    }
  },
  computed: {
    ruleValidate() {
      return {
        startDate: [{
          type: 'date',
          required: true,
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error(this.$i18n.t('forms.startDate') + this.$i18n.t('forms.notEmpty')))
              return
            } else if (this.formValidate.endDate !== '') {
              if (this.formValidate.endDate.getTime() < value.getTime()) {
                callback(new Error(this.$i18n.t('forms.startDateCantGreaterThenEndDate') + ''))
                return
              }
            }
            callback()
          },
          trigger: 'blur'
        }],
        endDate: [{
          type: 'date',
          required: true,
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error(this.$i18n.t('forms.endDate') + this.$i18n.t('forms.notEmpty')))
              return
            } else if (this.formValidate.startDate !== '') {
              if (value.getTime() < this.formValidate.startDate.getTime()) {
                callback(new Error(this.$i18n.t('forms.startDateCantGreaterThenEndDate') + ''))
                return
              }
            }
            callback()
          },
          trigger: 'blur'
        }]
      }
    },
    logFileList() {
      return this.logFiles
    }
  },
  methods: {
    disabledDate: (date) => {
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      return date.getTime() >= now.getTime()
    },
    handleSearch() {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          this.form_loading = true
          this.$api.request.log.searchFile(this.formValidate.startDate.getTime(), this.formValidate.endDate.getTime()).then((res) => {
            this.form_loading = false
            if (res) {
              this.logFiles = res.data
            }
          }).catch(() => {
            this.form_loading = false
          })
        }
      })
    },
    handleSearchReset() {
      this.$refs['formValidate'].resetFields()
    },
    downLoadFile(file) {
      this.$api.request.log.downLoadFile(file)
    }
  }
}
</script>
