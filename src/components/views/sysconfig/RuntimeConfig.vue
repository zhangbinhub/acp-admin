<template>
  <Card>
    <Form ref="searchForm" :model="searchForm" :label-width="60" :inline="true" class="search-form">
      <Form-item :label="$t('forms.name')" prop="name">
        <i-input v-model="searchForm.name" :disabled="modal_loading" size="small"
                 :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"
                 @on-enter="handleSearch"></i-input>
      </Form-item>
      <Form-item :label="$t('forms.value')" prop="value">
        <i-input v-model="searchForm.value" :disabled="modal_loading" size="small"
                 :placeholder="$t('forms.pleaseEnter') + $t('forms.value')"
                 @on-enter="handleSearch"></i-input>
      </Form-item>
      <Form-item :label="$t('forms.status')" prop="enabled">
        <i-select v-model="searchForm.enabled" clearable size="small" :disabled="modal_loading"
                  @keyup.enter.native="handleSearchKeyUp($event)" style="width:200px">
          <Option v-for="item in enabledList" :value="item.value" :key="'search_select_'+item.value">
            {{ item.label }}
          </Option>
        </i-select>
      </Form-item>
      <Form-item style="float: right">
        <ButtonGroup>
          <Button :loading="modal_loading" @click="handleSearch()" type="info" size="small">
            {{$t('forms.buttons.search')}}
          </Button>
          <Button :loading="modal_loading" @click="handleSearchReset('searchForm')" type="info" size="small">
            {{$t('forms.buttons.reset')}}
          </Button>
          <Button :loading="modal_loading" @click="handleAdd()" type="info" size="small">
            {{$t('forms.buttons.add')}}
          </Button>
          <Button :loading="modal_loading" @click="handleDeleteMore()" type="info" size="small">
            {{$t('forms.buttons.delete')}}
          </Button>
        </ButtonGroup>
      </Form-item>
    </Form>
    <Table border="" height="433" size="small" :columns="columns" :data="searchData" class="search-table"
           :loading="modal_loading" :no-data-text="$t('messages.tableNoData')" @on-row-dblclick="handleEdit"
           @on-selection-change="handleSelect" @on-sort-change="handleSortChange">
      <template slot-scope="{ row }" slot="name">
        <span>{{ row.name }}</span>
      </template>
      <template slot-scope="{ row, index }" slot="value">
        <i-input type="text" v-model="editValue" v-if="editIndex === index" @on-enter="handleSave(index)"
                 @on-keyup="handleCancel($event)"/>
        <span v-else>{{ row.value }}</span>
      </template>
      <template slot-scope="{ row, index }" slot="configDes">
        <i-input type="text" v-model="editDes" v-if="editIndex === index" @on-enter="handleSave(index)"
                 @on-keyup="handleCancel($event)"/>
        <span v-else>{{ row.configDes }}</span>
      </template>
      <template slot-scope="{ row, index }" slot="enabled">
        <i-switch v-if="editIndex === index" v-model="editEnabled" @keyup.native="handleKeyUp($event, index)">
          <Icon type="md-checkmark" slot="open"></Icon>
          <Icon type="md-close" slot="close"></Icon>
        </i-switch>
        <span v-else :style="row.enabled ? 'color:green':'color:red'">{{enabledText(row.enabled)}}</span>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <div v-if="editIndex === index">
          <Tooltip :content="$t('forms.buttons.save')" placement="top-start">
            <Icon @click="handleSave(index)" type="md-checkmark" color="green" size="18"
                  style="cursor: pointer;"></Icon>
          </Tooltip>
          <Tooltip :content="$t('forms.buttons.cancel')" placement="top-start">
            <Icon @click="editIndex = -1" type="md-close" color="red" size="18"
                  style="cursor: pointer;margin-left: 10px;"></Icon>
          </Tooltip>
        </div>
        <div v-else>
          <Tooltip :content="$t('forms.buttons.edit')" placement="top-start">
            <Icon @click="handleEdit(row, index)" type="md-create" size="18" style="cursor: pointer;"></Icon>
          </Tooltip>
          <Tooltip :content="$t('forms.buttons.delete')" placement="top-start" v-show="row.covert">
            <Icon @click="handleDeleteRow(row)" type="md-trash" size="18"
                  style="cursor: pointer;margin-left: 10px;"></Icon>
          </Tooltip>
        </div>
      </template>
    </Table>
    <div style="margin-top: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :current="searchForm.currPage" :total="searchForm.totalRows" :page-size="searchForm.pageSize"
              :page-size-opts="searchForm.pageSizeArray" show-total show-elevator show-sizer size="small"
              @on-change="handlePageSearch" @on-page-size-change="handlePageSizeSearch"/>
      </div>
    </div>
    <Modal v-model="addModal" :title="$t('forms.buttons.add')" :loading="modal_loading" :mask-closable="false">
      <Form ref="addForm" :model="addForm" :rules="ruleAddForm" :label-width="60" style="padding-right: 25px;">
        <Form-item :label="$t('forms.name')" prop="name">
          <i-input v-model="addForm.name" :disabled="modal_loading" ref="name"
                   :placeholder="$t('forms.pleaseEnter') + $t('forms.name')"
                   @on-enter="doAdd('addForm')"></i-input>
        </Form-item>
        <Form-item :label="$t('forms.value')" prop="value">
          <i-input v-model="addForm.value" :disabled="modal_loading"
                   :placeholder="$t('forms.pleaseEnter') + $t('forms.value')"
                   @on-enter="doAdd('addForm')"></i-input>
        </Form-item>
        <Form-item :label="$t('forms.describe')" prop="describe">
          <i-input v-model="addForm.describe" :disabled="modal_loading"
                   :placeholder="$t('forms.pleaseEnter') + $t('forms.describe')"
                   @on-enter="doAdd('addForm')"></i-input>
        </Form-item>
        <Form-item :label="$t('forms.enabled')" prop="enabled">
          <i-switch v-model="addForm.enabled" :disabled="modal_loading"
                    @keyup.native="handleAddKeyUp($event, 'addForm')">
            <Icon type="md-checkmark" slot="open"></Icon>
            <Icon type="md-close" slot="close"></Icon>
          </i-switch>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="default" :loading="modal_loading" @click="doCancel()">
          {{$t('forms.buttons.cancel')}}
        </Button>
        <Button type="primary" :loading="modal_loading" @click="doAdd('addForm')">
          {{$t('forms.buttons.submit')}}
        </Button>
      </div>
    </Modal>
  </Card>
</template>
<script>
  export default {
    name: 'runtimeConfig',
    data () {
      return {
        searchForm: {
          name: '',
          value: '',
          enabled: '',
          orderParam: {
            key: 'name',
            order: 'asc'
          },
          currPage: 1,
          totalRows: 0,
          pageSize: 10,
          pageSizeArray: [10, 20, 30, 40]
        },
        addForm: {
          name: '',
          value: '',
          describe: '',
          enabled: true
        },
        addModal: false,
        modal_loading: false,
        searchData: [],
        editIndex: -1,
        editName: '',
        editValue: '',
        editDes: '',
        editEnabled: true,
        selectedData: []
      }
    },
    watch: {
      addModal (value) {
        if (value) {
          this.$nextTick(() => {
            this.$refs['name'].focus()
          })
        }
      }
    },
    computed: {
      enabledList () {
        return [
          { value: 'true', label: this.$i18n.t('forms.enabled') },
          { value: 'false', label: this.$i18n.t('forms.disabled') }
        ]
      },
      columns () {
        const columns = [
          {
            type: 'selection',
            width: 50,
            align: 'center'
          },
          {
            key: 'name',
            title: this.$i18n.t('forms.name'),
            slot: 'name'
          },
          {
            key: 'value',
            title: this.$i18n.t('forms.value'),
            slot: 'value'
          },
          {
            key: 'configDes',
            title: this.$i18n.t('forms.describe'),
            slot: 'configDes'
          },
          {
            key: 'enabled',
            title: this.$i18n.t('forms.enabled'),
            slot: 'enabled',
            sortable: 'custom'
          },
          {
            title: this.$i18n.t('forms.action'),
            width: 90,
            align: 'center',
            slot: 'action'
          }
        ]
        columns.forEach((item) => {
          if (item.key === this.searchForm.orderParam.key) {
            item.sortType = this.searchForm.orderParam.order
            item.sortable = 'custom'
          }
        })
        return columns
      },
      ruleAddForm () {
        return {
          name: [
            { required: true, message: this.$i18n.t('forms.name') + this.$i18n.t('forms.notEmpty'), trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      enabledText (enabled) {
        return enabled ? this.$i18n.t('forms.enabled') : this.$i18n.t('forms.disabled')
      },
      handleAdd () {
        this.$refs['addForm'].resetFields()
        this.addModal = true
      },
      handleAddKeyUp (event, name) {
        if (event.which === 13) {
          this.doAdd(name)
        }
      },
      doCancel () {
        this.addModal = false
      },
      doAdd (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.modal_loading = true
            this.$api.request.runtime.create({
              name: this.addForm.name,
              value: this.addForm.value,
              configDes: this.addForm.describe,
              enabled: this.addForm.enabled
            }).then((res) => {
              this.modal_loading = false
              if (res) {
                this.$Message.success(this.$i18n.t('messages.saveSuccess'))
                this.addModal = false
                this.handleSearch()
              }
            }).catch(() => {
              this.modal_loading = false
            })
          }
        })
      },
      handleDelete (rowIds) {
        this.modal_loading = true
        this.$api.request.runtime.delete(rowIds).then((res) => {
          this.modal_loading = false
          if (res) {
            this.$Message.success(this.$i18n.t('messages.deleteSuccess'))
            this.handleSearch()
          }
        }).catch(() => {
          this.modal_loading = false
        })
      },
      handleSave (index) {
        this.modal_loading = true
        this.$api.request.runtime.update({
          id: this.searchData[index].id,
          name: this.editName,
          value: this.editValue,
          configDes: this.editDes,
          enabled: this.editEnabled
        }).then((res) => {
          this.modal_loading = false
          if (res) {
            this.searchData[index].value = this.editValue
            this.searchData[index].configDes = this.editDes
            this.searchData[index].enabled = this.editEnabled
            this.editIndex = -1
            this.$Message.success(this.$i18n.t('messages.updateSuccess'))
          }
        }).catch(() => {
          this.modal_loading = false
        })
      },
      handlePageSearch (page) {
        this.searchForm.currPage = page
        this.handleSearch()
      },
      handlePageSizeSearch (size) {
        this.searchForm.pageSize = size
        this.handleSearch()
      },
      handleSearch () {
        let searchParam = {
          name: this.searchForm.name,
          value: this.searchForm.value,
          queryParam: {
            currPage: this.searchForm.currPage,
            pageSize: this.searchForm.pageSize
          }
        }
        if (this.searchForm.enabled === 'true') {
          searchParam.enabled = true
        } else if (this.searchForm.enabled === 'false') {
          searchParam.enabled = false
        }
        if (this.searchForm.orderParam.order !== 'normal') {
          searchParam.queryParam.orderName = this.searchForm.orderParam.key
          searchParam.queryParam.orderCommond = this.searchForm.orderParam.order
        }
        this.modal_loading = true
        this.$api.request.runtime.query(searchParam).then((res) => {
          this.modal_loading = false
          if (res) {
            this.selectedData = []
            this.searchForm.currPage = res.data.pageable.pageNumber + 1
            this.searchForm.totalRows = res.data.totalElements
            this.searchData = res.data.content.map(item => {
              if (!item.covert) {
                item._disabled = true
              }
              return item
            })
          }
        }).catch(() => {
          this.searchData = []
          this.selectedData = []
          this.modal_loading = false
        })
      },
      handleSearchKeyUp (event) {
        if (event.which === 13) {
          this.handleSearch()
        }
      },
      handleSortChange (param) {
        this.searchForm.orderParam.key = param.key
        this.searchForm.orderParam.order = param.order
        this.handleSearch()
      },
      handleSearchReset (name) {
        this.$refs[name].resetFields()
      },
      handleSelect (selection) {
        this.selectedData = selection
      },
      handleDeleteRow (row) {
        if (!row.covert) {
          this.$Modal.error({
            title: this.$i18n.t('dialog.error') + '',
            content: this.$i18n.t('messages.tableDataCannotDel') + ''
          })
        } else {
          this.$Modal.confirm({
            title: this.$i18n.t('dialog.confirm') + '',
            content: this.$i18n.t('messages.deleteDataConfirm') + '',
            onOk: () => {
              this.handleDelete([row.id])
            }
          })
        }
      },
      handleDeleteMore () {
        if (this.selectedData.length > 0) {
          this.$Modal.confirm({
            title: this.$i18n.t('dialog.confirm') + '',
            content: this.$i18n.t('messages.deleteDataConfirm') + '',
            onOk: () => {
              this.handleDelete(this.selectedData.map(item => item.id))
            }
          })
        } else {
          this.$Modal.info({
            title: this.$i18n.t('dialog.info') + '',
            content: this.$i18n.t('messages.selectDataForDelete') + ''
          })
        }
      },
      handleEdit (row, index) {
        this.editName = row.name
        this.editValue = row.value
        this.editDes = row.configDes
        this.editEnabled = !!row.enabled
        this.editIndex = index
      },
      handleKeyUp (event, index) {
        switch (event.which) {
          case 13:
            this.handleSave(index)
            break
          case 27:
            this.editIndex = -1
            break
        }
      },
      handleCancel (event) {
        if (event.which === 27) {
          this.editIndex = -1
        }
      }
    },
    mounted () {
      this.handleSearch()
    }
  }
</script>
