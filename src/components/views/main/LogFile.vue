<template>
  <Card style="min-height: 350px;">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" :inline="true">
      <Form-item :label="$t('forms.startDate')" prop="startDate">
        <i-date-picker type="date" :disabled="form_loading" :options="datePickerOptions"
                       v-model="formValidate.startDate"
                       :placeholder="$t('forms.pleaseEnter') + $t('forms.startDate')"
                       style="width: 170px" @keyup.enter.native="handleSearch"></i-date-picker>
      </Form-item>
      <Form-item :label="$t('forms.endDate')" prop="endDate">
        <i-date-picker type="date" :disabled="form_loading" :options="datePickerOptions" v-model="formValidate.endDate"
                       :placeholder="$t('forms.pleaseEnter') + $t('forms.endDate')"
                       style="width: 170px" @keyup.enter.native="handleSearch"></i-date-picker>
      </Form-item>
      <Form-item>
        <ButtonGroup>
          <Button :loading="form_loading" @click="handleSearch()" type="info">
            {{$t('forms.buttons.search')}}
          </Button>
          <Button :loading="form_loading" @click="handleSearchReset()" type="info">
            {{$t('forms.buttons.reset')}}
          </Button>
        </ButtonGroup>
      </Form-item>
    </Form>
    <Divider/>
    <Row>
      <i-col span="3" v-for="(file,index) in logFileList" :key="index"
             style="text-align: center;min-width: 150px;margin-bottom: 15px;">
        <Tooltip :content="file" placement="bottom">
          <Button type="text" :loading="form_loading" @click="downLoadFile(file)">
            <Icon :size="50" type="md-document"/>
          </Button>
        </Tooltip>
        <p>{{file}}</p>
      </i-col>
    </Row>
  </Card>
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
