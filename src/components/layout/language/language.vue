<template>
  <div>
    <el-dropdown trigger="click" @command="selectLang">
      <el-link href="javascript:void(0)" :underline="false" style="font-size: 12px">
        {{ $t('lang') }}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </el-link>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="item in langList" :command="item.value" :key="`lang-${item.value}`">{{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
    export default {
        name: 'Language',
        props: {
            lang: String
        },
        data () {
            return {
                langList: this.$store.state.app.lang.langList
            }
        },
        methods: {
            selectLang (name) {
                this.$store.commit('SET_LANG', name)
            }
        }
    }
</script>
