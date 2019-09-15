<template>
  <el-card style="min-height: 350px;">
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="120px" :inline="true"
             size="mini" onsubmit="return false;">
      <el-form-item :label="$t('forms.startDate')" prop="startDate">
        <el-date-picker type="date" :disabled="form_loading" :picker-options="datePickerOptions"
                        v-model="formValidate.startDate"
                        :placeholder="$t('forms.pleaseEnter') + $t('forms.startDate')"
                        style="width: 162px"></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('forms.endDate')" prop="endDate">
        <el-date-picker type="date" :disabled="form_loading" :picker-options="datePickerOptions"
                        v-model="formValidate.endDate"
                        :placeholder="$t('forms.pleaseEnter') + $t('forms.endDate')"
                        style="width: 162px"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button-group>
          <el-button :loading="form_loading" @click="handleSearch()" type="primary">
            {{$t('forms.buttons.search')}}
          </el-button>
          <el-button :loading="form_loading" @click="handleSearchReset()" type="primary">
            {{$t('forms.buttons.reset')}}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>
    <el-divider/>
    <el-row>
      <el-col :span="3" v-for="(file,index) in logFileList" :key="index"
              style="text-align: center;min-width: 150px;margin-bottom: 15px;">
        <el-tooltip :content="file" placement="bottom">
          <el-button type="text" :loading="form_loading" @click="downLoadFile(file)">
            <i class="el-icon-document" style="font-size: 50px"></i>
          </el-button>
        </el-tooltip>
        <p>{{file}}</p>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
    import { doDownLoadFile } from '@/libs/tools'

    export default {
        name: 'logFile',
        data () {
            return {
                form_loading: false,
                datePickerOptions: {
                    disabledDate: (date) => {
                        const now = new Date()
                        now.setHours(0, 0, 0, 0)
                        return date.getTime() >= now.getTime()
                    }
                },
                formValidate: {
                    startDate: '',
                    endDate: ''
                },
                logFiles: []
            }
        },
        computed: {
            ruleValidate () {
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
            logFileList () {
                return this.logFiles
            }
        },
        methods: {
            handleSearch () {
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
            handleSearchReset () {
                this.$refs['formValidate'].resetFields()
            },
            downLoadFile (file) {
                this.form_loading = true
                this.$api.request.log.downLoadFile(file).then((res) => {
                    this.form_loading = false
                    if (res) {
                        doDownLoadFile(res.data, file)
                    }
                }).catch((error) => {
                    const currObj = this
                    currObj.form_loading = false
                    const blob = new Blob([error.response.data])
                    const reader = new FileReader()
                    reader.onload = function (event) {
                        const errorObj = JSON.parse(event.target.result)
                        currObj.$api.errorProcess(errorObj.errorDescription, currObj.$i18n.t('messages.requestFailed'))
                    }
                    reader.readAsText(blob, 'UTF-8')
                })
            }
        }
    }
</script>
