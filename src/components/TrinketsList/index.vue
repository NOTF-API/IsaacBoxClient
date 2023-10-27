<template>
  <div class="trinkets view-container">
    <div class="options">
      <span>
        <input id="show-trinket-id" type="checkbox" v-model="isShowId" />
        <label for="show-trinket-id">{{ $t('show id') }}</label>
      </span>
      <span>
        <input id="show-trinket-as-list" type="checkbox" v-model="isListStyle" />
        <label for="show-trinket-as-list">{{ $t('list style') }}</label>
      </span>
      <div class="idea-popover">
        <div class="shadowed idea-text">{{ $t("$items-idea") }}</div>
      </div>
    </div>
    <div class="view-content no-scrollbar">
      <div class="items">
        <TrinketItem v-for="item in data" :show-id="isShowId" :item="item" :is-list-styled="isListStyle" />
      </div>
      <div class="items">
        <TrinketItem v-for="item in data" :show-id="isShowId" :item="item" :is-golden="true"
          :is-list-styled="isListStyle" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Trinkets"
}
</script>
  
<script setup>
import TrinketItem from './TrinketItem.vue';
import { ref } from 'vue'

const isShowId = ref(false)
const isListStyle = ref(false)

const data = Object.values(window._resource.items).filter((value) => {
  return value._type === "trinket"
})
</script>
  
<style lang="less" scoped>
@import url("../list.less");
</style>
  