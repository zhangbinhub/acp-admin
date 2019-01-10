<template>
  <Card>
    <Row>
      <i-col span="18">
        <Form ref="searchForm" :model="searchForm" :label-width="60" :inline="true" class="search-form">
          <Form-item :label="$t('forms.name')" prop="name">
            <i-input v-model="searchForm.name" :disabled="modal_loading" size="small"></i-input>
          </Form-item>
          <Form-item :label="$t('forms.value')" prop="value">
            <i-input v-model="searchForm.value" :disabled="modal_loading" size="small"></i-input>
          </Form-item>
        </Form>
      </i-col>
      <i-col span="6" style="text-align: right">
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
      </i-col>
    </Row>
    <Table border height="433" size="small" :columns="columns" :data="searchData" class="search-table"
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
      <template slot-scope="{ row, index }" slot="des">
        <i-input type="text" v-model="editDes" v-if="editIndex === index" @on-enter="handleSave(index)"
                 @on-keyup="handleCancel($event)"/>
        <span v-else>{{ row.des }}</span>
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
            <Icon @click="handleDeleteRow(row, index)" type="md-trash" size="18"
                  style="cursor: pointer;margin-left: 10px;"></Icon>
          </Tooltip>
        </div>
      </template>
    </Table>
    <div style="margin-top: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :current="currPage" :total="totalRows" :page-size="searchForm.pageSize"
              :page-size-opts="searchForm.pageSizeArray" show-total show-elevator show-sizer size="small"/>
      </div>
    </div>
  </Card>
</template>
<script>
  export default {
    name: 'paramConfig',
    data () {
      return {
        searchForm: {
          name: '',
          value: '',
          orderParam: {
            key: 'name',
            order: 'asc'
          },
          currPage: 1,
          totalRows: 0,
          pageSize: 10,
          pageSizeArray: [10, 20, 30, 40]
        },
        modal_loading: false,
        searchData: [
          {
            name: '王小明',
            value: 18,
            des: '北京市朝阳区芍药居',
            enabled: true,
            covert: true,
            _disabled: true
          },
          {
            name: '张小刚',
            value: 25,
            birthday: '696096000000',
            des: '北京市海淀区西二旗',
            enabled: false
          },
          {
            name: '李小红',
            value: 30,
            birthday: '563472000000',
            des: '上海市浦东新区世纪大道',
            enabled: false
          },
          {
            name: '周小伟',
            value: 26,
            birthday: '687024000000',
            des: '深圳市南山区深南大道',
            enabled: false
          },
          {
            name: '周小伟',
            value: 26,
            birthday: '687024000000',
            des: '深圳市南山区深南大道',
            enabled: false
          },
          {
            name: '周小伟',
            value: 26,
            birthday: '687024000000',
            des: '深圳市南山区深南大道',
            enabled: false
          },
          {
            name: '周小伟',
            value: 26,
            birthday: '687024000000',
            des: '深圳市南山区深南大道',
            enabled: false
          },
          {
            name: '周小伟',
            value: 26,
            birthday: '687024000000',
            des: '深圳市南山区深南大道',
            enabled: false
          },
          {
            name: '周小伟',
            value: 26,
            birthday: '687024000000',
            des: '深圳市南山区深南大道',
            enabled: false
          },
          {
            name: '周小伟',
            value: 26,
            birthday: '687024000000',
            des: '深圳市南山区深南大道',
            enabled: false
          }
        ],
        editIndex: -1,
        editName: '',
        editValue: '',
        editDes: '',
        editEnabled: true,
        selectedData: []
      }
    },
    computed: {
      currPage () {
        return this.searchForm.currPage
      },
      totalRows () {
        return this.searchForm.totalRows
      },
      columns () {
        return [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            key: 'name',
            title: this.$i18n.t('forms.name'),
            slot: 'name',
            sortable: 'custom',
            sortType: 'asc'
          },
          {
            key: 'value',
            title: this.$i18n.t('forms.value'),
            slot: 'value'
          },
          {
            key: 'des',
            title: this.$i18n.t('forms.describe'),
            slot: 'des'
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
      }
    },
    methods: {
      enabledText (enabled) {
        return enabled ? this.$i18n.t('forms.enabled') : this.$i18n.t('forms.disabled')
      },
      handleAdd () {
        // TODO
      },
      handleDelete (rows) {
        // TODO
        console.log(rows)
      },
      handleSave (index) {
        // TODO
        this.searchData[index].name = this.editName
        this.searchData[index].value = this.editValue
        this.searchData[index].des = this.editDes
        this.searchData[index].enabled = this.editEnabled
        this.editIndex = -1
      },
      handleSearch () {
        // TODO
        if (this.searchForm.orderParam.order !== 'normal') {
        }
      },
      handleSortChange (param) {
        this.searchForm.orderParam.key = param.key
        this.searchForm.orderParam.order = param.order
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
            title: this.$i18n.t('dialog.error'),
            content: this.$i18n.t('messages.tableDataCannotDel')
          })
        } else {
          this.handleDelete([row])
        }
      },
      handleDeleteMore () {
        this.handleDelete(this.selectedData)
      },
      handleEdit (row, index) {
        this.editName = row.name
        this.editValue = row.value
        this.editDes = row.des
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
    }
  }
</script>
