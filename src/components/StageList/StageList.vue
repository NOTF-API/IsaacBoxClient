<template>
  <div class="view-container">
    <div class="options">
      <span>
        <input id="show-stage-id" type="checkbox" v-model="isShowId" />
        <label for="show-stage-id">{{ $t("show id") }}</label>
      </span>
      <div class="idea-popover">
        <div class="shadowed idea-text">{{ $t("$idea-stage") }}</div>
      </div>
    </div>
    <div class="view-content">
      <StageItem v-for="stage in stages" 
      :is-list-styled="true" 
      :item="Object.assign(stage,data[stage.id])" 
      :show-id="isShowId"/>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StageItem from "./StageItem.vue";
import stages from './stages'
const isShowId = ref(false)

const data = window._resource.stages

</script>

<style lang="less">
@import url("../list.less");
</style>
