<template>
  <div class="view-container">
    <div class="options">
      <span>
        <input id="show-my-collectible-count" type="checkbox" v-model="isShowCount" />
        <label for="show-my-collectible-count">{{ $t("show count") }}</label>
      </span>
      <span>
        <input id="show-my-collectible-quality" type="checkbox" v-model="isShowQuality" />
        <label for="show-my-collectible-quality">{{ $t("show quality") }}</label>
      </span>
      <span>
        <input id="show-my-collectible-as-list" type="checkbox" v-model="isListStyle" />
        <label for="show-my-collectible-as-list">{{ $t("list style") }}</label>
      </span>
      <div class="idea-popover">
        <div class="shadowed idea-text">{{ $t("$idea-remove") }}</div>
      </div>
    </div>
    <div class="view-content no-scrollbar">
      <template v-for="count, index in collectibles">
        <MyCollectibleItem v-if="count > 0" :is-list-styled="isListStyle" :item="data[index + 1]" :show-count="isShowCount"
          :show-quality="isShowQuality" :count="count" />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MyCollectibleItem from "./MyCollectibleItem.vue";
import { collectibles } from '@/utils/ws'

const isShowCount = ref(true)
const isShowQuality = ref(false)
const isListStyle = ref(false)

const data = Object.freeze(
  Object.values(window._resource.items).filter((value) => {
    return value._type === "item"
  }).reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {}));

</script>

<style lang="less">
@import url("../list.less");
</style>
