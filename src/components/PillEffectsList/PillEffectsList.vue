<template>
  <div class="pills view-container">
    <div class="options">
      <input id="show-pills-id" type="checkbox" v-model="isShowId" />
      <label for="show-pills-id">{{ $t("show id") }}</label>
      <div class="idea-popover">
        <div class="shadowed idea-text">{{ $t("$idea-pills") }}</div>
      </div>
    </div>
    <div class="view-content pills-list">
      <PillEffectItem v-for="item in data" :item="item"  :is-show-id="isShowId" />
      <PillEffectItem v-for="item in data" :item="item" :is-large="true" :is-show-id="isShowId"/>
    </div>
  </div>
</template>
    
<script setup>
import {ref} from 'vue'
import PillEffectItem from "./PillEffectItem.vue";

const data = Object.values(window._resource.pocketItems).filter((value) => {
  return value._type === "pilleffect"
})

const isShowId = ref(false)
</script>
    
<style lang="less" scoped>
@import url("../list.less");
</style>
    