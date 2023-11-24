<template>
  <div class="item" :class="{ 'list-styled': props.isListStyled }" @click="handleClick($event, item)">
    <div class="quality" v-show="props.showQuality" :class="'level' + item.quality"></div>
    <div class="image" :style="getImageSource(item.gfx)"></div>
    <div class="id" v-show="props.showId">{{ item._gid }}</div>
    <div class="name" v-text="item.name"></div>
    <div class="description ellipsis" v-text="item.description"></div>
  </div>
</template>

<script setup>
import { emit } from "@/utils/ws"

const props = defineProps(['item', 'isListStyled', 'showQuality', 'showId'])


/**
 * Handles the click event.
 *
 * @param {MouseEvent} $event - The click event object.
 * @param {Object} item - The item object.
 */
const handleClick = ($event, item) => {
  const { id, _gid } = item
  if ($event.ctrlKey) {
    emit("COMMAND", `g ${_gid}`);
  } else {
    emit("COMMAND", `spawn 5.100.${id}`);
  }
}

const getImageSource = (gfx) => {
  return {
    backgroundImage: `url('${gfx}')`
  }
}
</script>

<style lang="less" scoped>
@import url("./CollectibleItem.less");
</style>