<template>
  <div class="cards view-container">
    <div class="options">
      <span>
        <input id="show-cards-id" type="checkbox" v-model="isShowId" />
        <label for="show-cards-id">{{ $t('show id') }}</label>
      </span>
      <span>
        <input id="show-cards-as-list" type="checkbox" v-model="isListStyled" />
        <label for="show-cards-as-list">{{ $t('list style') }}</label>
      </span>
      <div class="idea-popover">
        <div class="
        shadowed idea-text">{{ $t("$idea-items") }}</div>
      </div>
    </div>
    <div class="view-content card-list">
      <CardItem v-bind="item" v-for="item in data" :is-list-styled="isListStyled" :show-id="isShowId" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CardItem from "./CardItem.vue";
import data from './cards.js'

const isShowId = ref(false)
const isListStyled = ref(false)
</script>
  
<style lang="less">
@import url("../list.less");
</style>
  