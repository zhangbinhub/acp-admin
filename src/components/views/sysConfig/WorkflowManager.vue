<template>
  <el-card>
    <el-form ref="searchForm" :model="searchFormModel" label-width="undefined" :inline="true" size="small"
             @submit.native.prevent>
      <el-form-item :label="$t('forms.processKey')" prop="processDefinitionKey">
        <el-input v-model="searchFormModel.processDefinitionKey" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.processKey')"
                  @keyup.enter.native="handleSearch"/>
      </el-form-item>
      <el-form-item :label="$t('forms.processInstanceId')" prop="processInstanceId">
        <el-input v-model="searchFormModel.processInstanceId" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.processInstanceId')"
                  @keyup.enter.native="handleSearch"/>
      </el-form-item>
      <el-form-item :label="$t('forms.processBusinessKey')" prop="processBusinessKey">
        <el-input v-model="searchFormModel.processBusinessKey" :disabled="modal_loading"
                  :placeholder="$t('forms.pleaseEnter') + $t('forms.processBusinessKey')"
                  @keyup.enter.native="handleSearch"/>
      </el-form-item>
      <el-form-item :label="$t('forms.flowStatus')" prop="history">
        <el-select v-model="searchFormModel.history" :disabled="modal_loading" value="">
          <el-option v-for="item in infoTypeList" :value="item.value" :label="item.label"
                     :key="'search_select_'+item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('forms.startDate')" prop="startTime">
        <el-date-picker v-model="searchFormModel.startTime" :disabled="modal_loading" type="daterange"
                        :disabled-date="disabledDate" :shortcuts="pickerOptions"
                        :class="{mobile:isMobile}"/>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button-group>
          <el-button :loading="modal_loading" @click="handleSearch" type="primary">
            {{ $t('forms.buttons.search') }}
          </el-button>
          <el-button :loading="modal_loading" @click="handleSearchReset" type="primary">
            {{ $t('forms.buttons.reset') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>
    <el-table ref="table" border :height="tableHeight" size="small" :default-sort="searchFormModel.orderParam"
              :data="searchData"
              v-loading="modal_loading" :empty-text="$t('messages.tableNoData')"
              header-cell-class-name="query-table-header">
      <el-table-column
        prop="businessKey"
        :label="$t('forms.processBusinessKey')"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="startTime"
        width="150"
        :label="$t('forms.beginTime')">
        <template #default="scope">
          <span>{{ dateTimeFormat(scope.row.startTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="flowName"
        :label="$t('forms.flowName')"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="title"
        :label="$t('forms.title')"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="description"
        :label="$t('forms.description')"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="endTime"
        width="150"
        :label="$t('forms.finishTime')">
        <template #default="scope">
          <span>{{ scope.row.endTime > 0 ? dateTimeFormat(scope.row.endTime) : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="isFinished"
        width="80"
        :label="$t('forms.flowStatus')">
        <template #default="scope">
          <span>{{ statusText(scope.row.finished) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('forms.currentUser')">
        <template #default="scope">
          <span>{{
              scope.row.activityUser.map((user) => {
                return user.name + '（' + user.loginNo + '）'
              }).join(',')
            }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :fixed="isMobile?false:'right'"
        prop="action"
        :label="$t('forms.action')"
        align="center"
        width="80">
        <template #default="scope">
          <el-button type="text" @click="gotoFlowView(scope.row)">
            <el-icon size="15">
              <el-icon-search/>
            </el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handlePageSizeSearch"
                   v-model:current-page="searchFormModel.currPage"
                   :page-sizes="searchFormModel.pageSizeArray"
                   v-model:page-size="searchFormModel.pageSize"
                   :layout="isMobile?'prev, pager, next':'total, sizes, prev, pager, next, jumper'" :small="isMobile"
                   :total="searchFormModel.totalRows">
    </el-pagination>
    <el-dialog custom-class="process-dialog" v-model="viewModal" :title="$t('forms.info')" :fullscreen="true">
      <div>
        <el-card shadow="hover">
          <template #header>
            <span>{{ $t('forms.basicInfo') }}</span>
            <el-icon color="#409EFF" style="margin-left: 5px">
              <el-icon-info-filled/>
            </el-icon>
          </template>
          <el-form size="small" :model="currObj" label-width="undefined" :inline="true"
                   @submit.native.prevent>
            <el-row :gutter="10">
              <el-col :lg="{span: 8}">
                <el-form-item :label="$t('forms.processInstanceId')+':'" prop="processInstanceId">
                  <span>{{ currObj.processInstanceId }}</span>
                </el-form-item>
              </el-col>
              <el-col :lg="{span: 8}">
                <el-form-item :label="$t('forms.processBusinessKey')+':'" prop="businessKey">
                  <span>{{ currObj.businessKey }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :lg="{span: 8}">
                <el-form-item :label="$t('forms.processKey')+':'" prop="processDefinitionKey">
                  <span>{{ currObj.processDefinitionKey }}</span>
                </el-form-item>
              </el-col>
              <el-col :lg="{span: 8}">
                <el-form-item :label="$t('forms.flowName')+':'" prop="flowName">
                  <span>{{ currObj.flowName }}</span>
                </el-form-item>
              </el-col>
              <el-col :lg="{span: 8}">
                <el-form-item :label="$t('forms.title')+':'" prop="title">
                  <span>{{ currObj.title }}</span>
                </el-form-item>
              </el-col>
              <el-col :lg="{span: 8}">
                <el-form-item :label="$t('forms.isFinished')+':'" prop="finished">
                  <span
                    :style="{color:currObj.finished?'green':'red'}">{{
                      currObj.finished ? $t('forms.yes') : $t('forms.no')
                    }}</span>
                </el-form-item>
              </el-col>
              <el-col :lg="{span: 8}">
                <el-form-item :label="$t('forms.beginTime')+':'" prop="startTime">
                  <span>{{ dateTimeFormat(currObj.startTime) }}</span>
                </el-form-item>
              </el-col>
              <el-col :lg="{span: 8}">
                <el-form-item :label="$t('forms.finishTime')+':'" prop="endTime">
                  <span>{{ dateTimeFormat(currObj.endTime) }}</span>
                </el-form-item>
              </el-col>
              <el-col :lg="{span: 8}">
                <el-form-item :label="$t('forms.startUser')+':'" prop="startUser">
                  <span>{{
                      currObj.startUser && currObj.startUser.name ? currObj.startUser.name + '（' + currObj.startUser.loginNo + '）' : ''
                    }}</span>
                </el-form-item>
              </el-col>
              <el-col :lg="{span: 8}">
                <el-form-item :label="$t('forms.currentUser')+':'" prop="activityUser">
                  <span>{{
                      currObj.activityUser ? currObj.activityUser.map((item) => {
                        return item.name + '（' + item.loginNo + '）'
                      }).join(',') : ''
                    }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form size="small" :model="currObj" label-width="undefined"
                   @submit.native.prevent>
            <el-row :gutter="10">
              <el-col :lg="{span: 24}">
                <el-form-item :label="$t('forms.description')+':'" prop="description">
                  <el-input v-model="currObj.description" type="textarea" :rows="3" readonly/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form size="small" :model="currObj" label-width="undefined"
                   v-if="currObj.deleteReason&&currObj.deleteReason!==''"
                   @submit.native.prevent>
            <el-row :gutter="10">
              <el-col :lg="{span: 24}">
                <el-form-item prop="deleteReason" style="color:red">
                  <template #label>
                    <span style="color: red">{{ $t('forms.deleteReason') + ':' }}</span>
                  </template>
                  <el-input v-model="currObj.deleteReason" type="textarea" :rows="3" readonly/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-row>
            <el-col :lg="{span:24}">
              <el-collapse>
                <el-collapse-item>
                  <template #title>
                    <span>{{ $t('forms.processParams') }}</span>
                    <el-icon color="#409EFF" style="margin-left: 5px">
                      <el-icon-info-filled/>
                    </el-icon>
                  </template>
                  <el-table size="small" :stripe="true" :data="params">
                    <el-table-column
                      type="index"
                      align="center"
                      width="50">
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      :label="$t('forms.name')">
                    </el-table-column>
                    <el-table-column
                      prop="type"
                      :label="$t('forms.type')">
                    </el-table-column>
                    <el-table-column
                      prop="value"
                      :label="$t('forms.value')">
                    </el-table-column>
                  </el-table>
                </el-collapse-item>
              </el-collapse>
            </el-col>
          </el-row>
        </el-card>
        <el-card shadow="hover" style="margin-top: 10px">
          <template #header>
            <span>{{ $t('forms.buttons.image') }}</span>
            <el-icon color="#409EFF" style="margin-left: 5px">
              <el-icon-info-filled/>
            </el-icon>
          </template>
          <el-scrollbar>
            <el-image :src="viewDiagram" style="padding-bottom: 20px"/>
          </el-scrollbar>
        </el-card>
        <el-card shadow="hover" style="margin-top: 10px">
          <template #header>
            <span>{{ $t('forms.processActivityRecords') }}</span>
            <el-icon color="#409EFF" style="margin-left: 5px">
              <el-icon-info-filled/>
            </el-icon>
          </template>
          <el-table size="small" :stripe="true" :data="processActivityList">
            <el-table-column
              prop="activityName"
              :label="$t('forms.name')">
            </el-table-column>
            <el-table-column
              :label="$t('forms.processUser')">
              <template #default="scope">
                <span>{{ scope.row.user.name + '（' + scope.row.user.loginNo + '）' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="pass"
              :label="$t('forms.isPass')">
              <template #default="scope">
                <span :style="{color:scope.row.pass?'green':'red'}">{{ scope.row.pass ? '通过' : '不通过' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="comment"
              :label="$t('forms.comment')"
              :show-overflow-tooltip="true">
              <template #default="scope">
                <span style="white-space: pre-line">{{ scope.row.comment }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="startTime"
              :label="$t('forms.beginTime')">
              <template #default="scope">
                <span>{{ dateTimeFormat(scope.row.startTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="endTime"
              :label="$t('forms.finishTime')">
              <template #default="scope">
                <span>{{ dateTimeFormat(scope.row.endTime) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card shadow="hover" style="margin-top: 10px">
          <template #header>
            <span>流程任务</span>
            <el-icon color="#409EFF" style="margin-left: 5px">
              <el-icon-info-filled/>
            </el-icon>
          </template>
          <el-table size="small" :stripe="true" :data="processTaskList">
            <el-table-column
              prop="name"
              :label="'任务名称'">
            </el-table-column>
            <el-table-column
              prop="unClaimed"
              :label="'是否被认领'">
              <template #default="scope">
                <span>{{ scope.row.unClaimed ? '否' : '是' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="delegated"
              :label="'任务是否已委派'">
              <template #default="scope">
                <span>{{ scope.row.delegated ? '是' : '否' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('forms.processUser')">
              <template #default="scope">
                <span>{{ scope.row.user.name ? scope.row.user.name + '（' + scope.row.user.loginNo + '）' : '' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              :label="'创建时间'">
              <template #default="scope">
                <span>{{ dateTimeFormat(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="claimTime"
              :label="'领取时间'">
              <template #default="scope">
                <span>{{ dateTimeFormat(scope.row.claimTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :fixed="isMobile?false:'right'"
              prop="action"
              :label="$t('forms.action')"
              align="center"
              width="80">
              <template #default="scope">
                <el-button type="text" @click="gotoTaskView(scope.row)">
                  <el-icon size="15">
                    <el-icon-search/>
                  </el-icon>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
      <el-backtop :visibility-height="10" target=".process-dialog"/>
    </el-dialog>
    <el-dialog custom-class="task-dialog" v-model="taskModal" :title="$t('forms.info')" :fullscreen="true">
      <el-form size="small" :model="currTaskObj" label-width="undefined" :inline="true"
               @submit.native.prevent>
        <el-row :gutter="10">
          <el-col :lg="{span: 8}">
            <el-form-item :label="'任务ID:'" prop="taskId">
              <span>{{ currTaskObj.taskId }}</span>
            </el-form-item>
          </el-col>
          <el-col :lg="{span: 8}">
            <el-form-item :label="'任务名称:'" prop="businessKey">
              <span>{{ currTaskObj.name }}</span>
            </el-form-item>
          </el-col>
          <el-col :lg="{span: 8}">
            <el-form-item :label="'任务定义键:'" prop="taskDefinitionKey">
              <span>{{ currTaskObj.taskDefinitionKey }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :lg="{span: 8}">
            <el-form-item :label="'父任务id:'" prop="parentTaskId">
              <span>{{ currTaskObj.parentTaskId }}</span>
            </el-form-item>
          </el-col>
          <el-col :lg="{span: 8}">
            <el-form-item :label="'执行实例id:'" prop="executionId">
              <span>{{ currTaskObj.executionId }}</span>
            </el-form-item>
          </el-col>
          <el-col :lg="{span: 8}">
            <el-form-item :label="'是否被认领:'" prop="unClaimed">
              <span>{{ currTaskObj.unClaimed ? '否' : '是' }}</span>
            </el-form-item>
          </el-col>
          <el-col :lg="{span: 8}">
            <el-form-item :label="'是否已委派:'" prop="delegated">
              <span>{{ currTaskObj.delegated ? '是' : '否' }}</span>
            </el-form-item>
          </el-col>
          <el-col :lg="{span: 8}">
            <el-form-item :label="'任务拥有者:'" prop="taskOwnerUser">
              <span>{{
                  currTaskObj.taskOwnerUser.id ? currTaskObj.taskOwnerUser.name + '（' + currTaskObj.taskOwnerUser.loginNo + '）' : ''
                }}</span>
            </el-form-item>
          </el-col>
          <el-col :lg="{span: 8}">
            <el-form-item :label="$t('forms.currentUser')+':'" prop="user">
              <span>{{
                  currTaskObj.user && currTaskObj.user.id ? currTaskObj.user.name + '（' + currTaskObj.user.loginNo + '）' : ''
                }}</span>
            </el-form-item>
          </el-col>
          <el-col :lg="{span: 8}">
            <el-form-item :label="'创建时间:'" prop="createTime">
              <span>{{ dateTimeFormat(currTaskObj.createTime) }}</span>
            </el-form-item>
          </el-col>
          <el-col :lg="{span: 8}">
            <el-form-item :label="'领取时间:'" prop="claimTime">
              <span>{{ dateTimeFormat(currTaskObj.claimTime) }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
        <el-col :lg="{span:24}">
          <el-collapse>
            <el-collapse-item>
              <template #title>
                <span>待办人列表</span>
                <el-icon color="#409EFF" style="margin-left: 5px">
                  <el-icon-info-filled/>
                </el-icon>
              </template>
              <el-table size="small" :stripe="true"
                        :data="currTaskObj.pendingUserList">
                <el-table-column
                  type="index"
                  align="center"
                  width="50">
                </el-table-column>
                <el-table-column
                  prop="id"
                  :label="'用户ID'">
                </el-table-column>
                <el-table-column
                  prop="name"
                  :label="'用户姓名'">
                </el-table-column>
                <el-table-column
                  prop="loginNo"
                  :label="'登录账号'">
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="{span:24}">
          <el-collapse>
            <el-collapse-item>
              <template #title>
                <span>自定义参数</span>
                <el-icon color="#409EFF" style="margin-left: 5px">
                  <el-icon-info-filled/>
                </el-icon>
              </template>
              <el-table size="small" :stripe="true"
                        :data="taskLocalParams">
                <el-table-column
                  type="index"
                  align="center"
                  width="50">
                </el-table-column>
                <el-table-column
                  prop="name"
                  :label="$t('forms.name')">
                </el-table-column>
                <el-table-column
                  prop="type"
                  :label="$t('forms.type')">
                </el-table-column>
                <el-table-column
                  prop="value"
                  :label="$t('forms.value')">
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="{span:24}">
          <el-collapse>
            <el-collapse-item>
              <template #title>
                <span>自定义属性</span>
                <el-icon color="#409EFF" style="margin-left: 5px">
                  <el-icon-info-filled/>
                </el-icon>
              </template>
              <el-table size="small" :stripe="true"
                        :data="taskProperties">
                <el-table-column
                  type="index"
                  align="center"
                  width="50">
                </el-table-column>
                <el-table-column
                  prop="name"
                  :label="$t('forms.name')">
                </el-table-column>
                <el-table-column
                  prop="type"
                  :label="$t('forms.type')">
                </el-table-column>
                <el-table-column
                  prop="value"
                  :label="$t('forms.value')">
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
      <template #footer>
        <div style="text-align: left">
          <el-button type="primary" :loading="modal_loading" v-if="currTaskObj.unClaimed" @click="processTask(1)">
            分配任务
          </el-button>
          <el-button type="primary" :loading="modal_loading" v-else @click="processTask(2)">
            任务转办
          </el-button>
        </div>
      </template>
      <el-backtop :visibility-height="10" target=".task-dialog"/>
    </el-dialog>
    <el-dialog :fullscreen="isMobile" v-model="selectUserModal" :title="'任务处理'" :close-on-click-modal="false">
      <el-form ref="editForm" v-loading="modal_loading" :model="editFormModel" @submit.native.prevent>
        <el-form-item label="选择用户" required prop="selectUserResult">
          <el-select v-model="editFormModel.selectUserResult" filterable
                     remote clearable value-key="id" placeholder="请输入用户姓名或工号"
                     :loading="modal_loading" :remote-method="remoteSelectUser" style="width: 100%">
            <el-option v-for="item in userOptions"
                       :key="'select_user_'+item.id"
                       :label="item.name+'('+item.loginNo+')'"
                       :value="item"/>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: center">
          <el-button type="info" :loading="modal_loading" @click="doCancel">
            {{ $t('forms.buttons.cancel') }}
          </el-button>
          <el-button type="warning" :loading="modal_loading" @click="doReset">
            {{ $t('forms.buttons.reset') }}
          </el-button>
          <el-button type="primary" :loading="modal_loading" @click="doProcessTask">
            {{ $t('forms.buttons.submit') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>
<script>
import {isMobileDevice} from "@/libs/tools"
import moment from 'moment'
import {nextTick, ref} from "vue";

export default {
  name: 'workflowManager',
  data() {
    return {
      searchFormModel: {
        processDefinitionKey: '',
        processInstanceId: '',
        processBusinessKey: '',
        history: 'false',
        startTime: [],
        orderParam: {
          prop: 'startTime',
          order: 'ascending'
        },
        currPage: 1,
        totalRows: 0,
        pageSize: 10,
        pageSizeArray: [10, 20, 30, 40]
      },
      modal_loading: false,
      viewModal: false,
      taskModal: false,
      selectUserModal: false,
      processType: 1,
      currObj: {},
      currTaskObj: {
        user: {},
        taskOwnerUser: {},
        localParams: {}
      },
      diagramData: '',
      processActivityList: [],
      processTaskList: [],
      searchData: [],
      params: [],
      taskLocalParams: [],
      taskProperties: [],
      userOptions: [],
      editFormModel: {
        selectUserResult: ''
      }
    }
  },
  computed: {
    isMobile() {
      return isMobileDevice()
    },
    tableHeight() {
      const minHeight = 300
      const height = this.$store.state.app.mainHeight - 80 - 92 - 42 - 4
      if (height < minHeight) {
        return minHeight - 2
      } else {
        return height
      }
    },
    infoTypeList() {
      return [
        {value: 'false', label: this.$i18n.t('forms.running')},
        {value: 'true', label: this.$i18n.t('forms.ended')}
      ]
    },
    pickerOptions() {
      return [{
        text: this.$i18n.t('forms.buttons.lastWeek'),
        value: (() => {
          const end = new Date()
          const start = new Date()
          end.setHours(0, 0, 0, 0)
          start.setHours(0, 0, 0, 0)
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          return [start, end]
        })()
      }, {
        text: this.$i18n.t('forms.buttons.lastMonth'),
        value: (() => {
          const end = new Date()
          const start = new Date()
          end.setHours(0, 0, 0, 0)
          start.setHours(0, 0, 0, 0)
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          return [start, end]
        })()
      }, {
        text: this.$i18n.t('forms.buttons.lastThreeMonth'),
        value: (() => {
          const end = new Date()
          const start = new Date()
          end.setHours(0, 0, 0, 0)
          start.setHours(0, 0, 0, 0)
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          return [start, end]
        })()
      }]
    },
    viewDiagram() {
      return this.diagramData
    }
  },
  watch: {
    'searchForm.currPage'() {
      this.handleSearch()
    },
    'currObj.processInstanceId'(processInstanceId) {
      this.doInitData(processInstanceId)
    },
    viewModal(isShow) {
      if (!isShow) {
        this.handleSearch()
      }
    }
  },
  methods: {
    dateTimeFormat(time) {
      return time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    disabledDate(date) {
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      return date.getTime() > now.getTime()
    },
    statusText(isFinished) {
      return this.infoTypeList.filter((item) => {
        return item.value === isFinished.toString()
      })[0].label
    },
    handlePageSizeSearch(size) {
      this.searchFormModel.pageSize = size
      this.handleSearch()
    },
    handleSortChange(param) {
      this.searchFormModel.orderParam.prop = param.prop
      this.searchFormModel.orderParam.order = param.order
      this.handleSearch()
    },
    handleSearchReset() {
      this.searchForm.resetFields()
    },
    handleSearch() {
      let searchParam = {
        processDefinitionKeys: [],
        processInstanceIds: [],
        processBusinessKey: this.searchFormModel.processBusinessKey,
        startTime: this.searchFormModel.startTime && this.searchFormModel.startTime.length === 2 ? this.searchFormModel.startTime[0].getTime() : null,
        endTime: this.searchFormModel.startTime && this.searchFormModel.startTime.length === 2 ? this.searchFormModel.startTime[1].getTime() + (24 * 60 * 60 * 1000) : null,
        queryParam: {
          currPage: this.searchFormModel.currPage,
          pageSize: this.searchFormModel.pageSize
        }
      }
      if (this.searchFormModel.processDefinitionKey && this.searchFormModel.processDefinitionKey !== '') {
        searchParam.processDefinitionKeys.push(this.searchFormModel.processDefinitionKey)
      }
      if (this.searchFormModel.processInstanceId && this.searchFormModel.processInstanceId !== '') {
        searchParam.processInstanceIds.push(this.searchFormModel.processInstanceId)
      }
      if (this.searchFormModel.orderParam.order !== 'normal') {
        searchParam.queryParam.orderName = this.searchFormModel.orderParam.prop
        searchParam.queryParam.orderCommand = this.searchFormModel.orderParam.order
      }
      this.modal_loading = true
      this.$api.request.workFlow.queryInstance(this.searchFormModel.history === 'true', searchParam).then((res) => {
        this.modal_loading = false
        if (res) {
          this.searchFormModel.totalRows = res.data.totalElements
          this.searchData = res.data.content
          nextTick(() => {
            this.table.doLayout()
          })
        }
      }).catch(() => {
        this.searchData = []
        this.modal_loading = false
      })
    },
    gotoFlowView(processInstance) {
      this.viewModal = true
      this.currObj = processInstance
    },
    gotoTaskView(processTask) {
      this.taskModal = true
      this.currTaskObj = processTask
      this.taskLocalParams = []
      Object.keys(this.currTaskObj.localParams).forEach((item) => {
        const value = this.currTaskObj.localParams[item]
        this.taskLocalParams.push({
          name: item,
          type: typeof value,
          value: String(value)
        })
      })
      this.taskProperties = []
      Object.keys(this.currTaskObj.properties).forEach((item) => {
        const value = this.currTaskObj.properties[item]
        this.taskProperties.push({
          name: item,
          type: typeof value,
          value: String(value)
        })
      })
    },
    doInitData(processInstanceId) {
      // 获取流程实例
      this.$api.request.workFlow.getInstance(processInstanceId).then((res) => {
        if (res) {
          this.currObj = res.data
        }
      }).catch(() => {
        this.$api.errorProcess('更新流程实例失败！')
      })
      // 获取流程图
      const currObj = this
      this.$api.request.workFlow.diagram(processInstanceId).then((image) => {
        if (image) {
          const dataInfo = image.data
          const contentType = dataInfo.type
          const reader = new window.FileReader()
          reader.readAsArrayBuffer(dataInfo)
          reader.onload = function (e) {
            const result = e.target.result
            const blob = new Blob([result], {type: contentType})
            currObj.diagramData = window.URL.createObjectURL(blob)
          }
        }
      }).catch(() => {
        this.$api.errorProcess('获取流程图失败！')
      })
      // 获取流程处理记录
      this.$api.request.workFlow.getInstanceActivity(processInstanceId).then((res) => {
        if (res) {
          this.processActivityList = res.data
        }
      }).catch(() => {
        this.processActivityList = []
      })
      this.params = []
      Object.keys(this.currObj.params).forEach((item) => {
        const value = this.currObj.params[item]
        this.params.push({
          name: item,
          type: typeof value,
          value: String(value)
        })
      })
      // 获取流程任务列表
      this.$api.request.workFlow.getTaskList(processInstanceId).then((res) => {
        if (res) {
          this.processTaskList = res.data
        }
      }).catch(() => {
        this.processTaskList = []
      })
    },
    processTask(processType) {
      this.selectUserModal = true
      this.processType = processType
    },
    doProcessTask() {
      if (!this.editFormModel.selectUserResult || !this.editFormModel.selectUserResult.id) {
        this.$alert('请选择用户！', this.$i18n.t('messages.validateFailed'), {
          type: 'error',
          callback: () => {
          }
        })
        return
      }
      switch (this.processType) {
        case 1:
          this.$confirm('确认分配任务？', this.$i18n.t('dialog.confirm') + '', {
            type: 'warning'
          }).then(() => {
            this.modal_loading = true
            this.$api.request.workFlow.distributeTask(this.currTaskObj.taskId, this.editFormModel.selectUserResult.id).then((res) => {
              this.modal_loading = false
              if (res) {
                this.$message.success(this.$i18n.t('messages.requestSuccess') + '')
                this.selectUserModal = false
                this.taskModal = false
                this.doInitData(this.currObj.processInstanceId)
              }
            }).catch(() => {
              this.modal_loading = false
            })
          }).catch(() => {
          })
          break
        case 2:
          this.$confirm('确认转办任务？', this.$i18n.t('dialog.confirm') + '', {
            type: 'warning'
          }).then(() => {
            this.modal_loading = true
            this.$api.request.workFlow.transferTask(this.currTaskObj.taskId, this.editFormModel.selectUserResult.id).then((res) => {
              this.modal_loading = false
              if (res) {
                this.$message.success(this.$i18n.t('messages.requestSuccess') + '')
                this.selectUserModal = false
                this.taskModal = false
                this.doInitData(this.currObj.processInstanceId)
              }
            }).catch(() => {
              this.modal_loading = false
            })
          }).catch(() => {
          })
          break
      }
    },
    remoteSelectUser(query) {
      if (query && query !== '') {
        this.$api.request.user.getUserList(query).then((res) => {
          if (res) {
            this.userOptions = res.data
          }
        })
      }
    },
    doCancel() {
      this.selectUserModal = false
    },
    doReset() {
      this.editForm.resetFields()
    }
  },
  mounted() {
    this.handleSearch()
  },
  activated() {
    nextTick(() => {
      this.table.doLayout()
    })
  },
  setup() {
    const searchForm = ref(null)
    const table = ref(null)
    const editForm = ref(null)
    return {searchForm, table, editForm}
  }
}
</script>
