<template>
  <div class="view-container">
    <div class="options">
      <span>
        <input id="show-collectible-id" type="checkbox" v-model="isShowId" />
        <label for="show-collectible-id">{{ $t("show id") }}</label>
      </span>
      <span>
        <input id="show-collectible-quality" type="checkbox" v-model="isShowQuality" />
        <label for="show-collectible-quality">{{ $t("show quality") }}</label>
      </span>
      <span>
        <input id="show-collectible-as-list" type="checkbox" v-model="isListStyle" />
        <label for="show-collectible-as-list">{{ $t("list style") }}</label>
      </span>
    </div>
    <div class="view-content no-scrollbar">
      <CollectibleItem v-for="item in data" :is-list-styled="isListStyle" :item="item"
        :show-id="isShowId" :show-quality="isShowQuality" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CollectibleItem from "./CollectibleItem.vue";

const isShowId = ref(false)
const isShowQuality = ref(false)
const isListStyle = ref(false)

const data = Object.values(window._resource.items).filter((value) => {
  return value._type === "item"
})

</script>

<style lang="less" scoped>
@import url("../list.less");
</style>
