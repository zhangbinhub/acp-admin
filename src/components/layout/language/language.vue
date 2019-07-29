<template>
  <div>
    <Dropdown trigger="click" @on-click="selectLang">
      <a href="javascript:void(0)">
        {{ $t('lang') }}
        <Icon :size="18" type="md-arrow-dropdown"/>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem v-for="item in langList" :name="item.value" :key="`lang-${item.value}`">{{ item.label }}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
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
