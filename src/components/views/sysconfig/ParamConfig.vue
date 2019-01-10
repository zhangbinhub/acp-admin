<template>
  <Card>
    <Form ref="searchForm" :model="searchForm" :label-width="60" :inline="true" class="search-form">
      <Form-item :label="$t('forms.name')" prop="name">
        <i-input v-model="searchForm.name"></i-input>
      </Form-item>
      <Form-item :label="$t('forms.value')" prop="value">
        <i-input v-model="searchForm.value"></i-input>
      </Form-item>
      <Form-item>
        <Button @click="handleSearch()" type="primary" ghost>
          {{$t('forms.buttons.search')}}
        </Button>
        <Button @click="handleSearchReset('searchForm')" style="margin-left: 20px;">
          {{$t('forms.buttons.reset')}}
        </Button>
        <Button style="margin-left: 20px;" type="success" ghost>
          {{$t('forms.buttons.add')}}
        </Button>
        <Button style="margin-left: 20px;" type="error" ghost>
          {{$t('forms.buttons.delete')}}
        </Button>
      </Form-item>
    </Form>
    <Table border height="433" size="small" :columns="columns" :data="data" class="search-table" highlight-row
           no-data-text="-" no-filtered-data-text="-">
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
          <Tooltip :content="$t('forms.buttons.delete')" placement="top-start">
            <Icon @click="handleDelete(row, index)" type="md-trash" size="18"
                  style="cursor: pointer;margin-left: 10px;"></Icon>
          </Tooltip>
        </div>
      </template>
    </Table>
    <div style="margin-top: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :current="1" :total="50" show-total show-elevator show-sizer size="small"/>
      </div>
    </div>
  </Card>
</template>
<script>
  // TODO
  export default {
    name: 'paramConfig',
    data () {
      return {
        searchForm: {
          name: '',
          value: ''
        },
        data: [
          {
            name: '王小明',
            value: 18,
            des: '北京市朝阳区芍药居'
          },
          {
            name: '张小刚',
            value: 25,
            birthday: '696096000000',
            des: '北京市海淀区西二旗'
          },
          {
            name: '李小红',
            value: 30,
            birthday: '563472000000',
            des: '上海市浦东新区世纪大道'
          },
          {
            name: '周小伟',
            value: 26,
            birthday: '687024000000',
            des: '深圳市南山区深南大道'
          },
          {
            name: '周小伟',
            value: 26,
            birthday: '687024000000',
            des: '深圳市南山区深南大道'
          },
          {
            name: '周小伟',
            value: 26,
            birthday: '687024000000',
            des: '深圳市南山区深南大道'
          },
          {
            name: '周小伟',
            value: 26,
            birthday: '687024000000',
            des: '深圳市南山区深南大道'
          },
          {
            name: '周小伟',
            value: 26,
            birthday: '687024000000',
            des: '深圳市南山区深南大道'
          },
          {
            name: '周小伟',
            value: 26,
            birthday: '687024000000',
            des: '深圳市南山区深南大道'
          },
          {
            name: '周小伟',
            value: 26,
            birthday: '687024000000',
            des: '深圳市南山区深南大道'
          }
        ],
        editIndex: -1,
        editName: '',
        editValue: '',
        editDes: ''
      }
    },
    computed: {
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
            slot: 'name'
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
            title: this.$i18n.t('forms.action'),
            width: 90,
            align: 'center',
            slot: 'action'
          }
        ]
      }
    },
    methods: {
      handleSearch () {

      },
      handleSearchReset (name) {
        this.$refs[name].resetFields()
      },
      handleEdit (row, index) {
        this.editName = row.name
        this.editValue = row.value
        this.editDes = row.des
        this.editIndex = index
      },
      handleSave (index) {
        this.data[index].name = this.editName
        this.data[index].value = this.editValue
        this.data[index].des = this.editDes
        this.editIndex = -1
      },
      handleCancel (event) {
        if (event.which === 27) {
          this.editIndex = -1
        }
      },
      handleDelete (row, index) {
        console.log(row)
        console.log(index)
      }
    }
  }
</script>
