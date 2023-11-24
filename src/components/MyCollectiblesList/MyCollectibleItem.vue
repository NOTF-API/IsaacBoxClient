<template>
  <div class="item" :class="{ 'list-styled': props.isListStyled }" @click="handleRemove($event, item._gid)">
    <div class="quality" v-show="props.showQuality" :class="'level' + item.quality"></div>
    <div class="image" :style="getImageSource(item.gfx)"></div>
    <div class="count" v-show="props.showCount">{{ props.count }}</div>
    <div class="name" v-text="item.name"></div>
    <div class="description ellipsis" v-text="item.description"></div>
    <div class="remove">x</div>
  </div>
</template>

<script setup>
import { emit } from "@/utils/ws"

const props = defineProps(['item', 'isListStyled', 'showQuality', 'showCount', 'count'])

const handleRemove = ($event, gid) => {
  if ($event.ctrlKey) {
    handleRemoveAll(gid, props.count)
  }
  else {
    handleRemoveOne(gid)
  }
}

const handleRemoveOne = (gid) => {
  emit("COMMAND", `r ${gid}`);
}

const handleRemoveAll = (gid, count) => {
  for (let i = 0; i < count; i++) {
    emit("COMMAND", `r ${gid}`);
  }
}

const getImageSource = (gfx) => {
  return {
    backgroundImage: `url('${gfx}')`
  }
}
</script>

<style lang="less" scoped>
@import url("../CollectiblesList/CollectibleItem.less");

.item {
  &.list-styled {
    .count {
      position: absolute;
      left: 64px;
      transform: translateX(-100%);
      bottom: 0rem;
      width: fit-content;
    }
  }

  &:hover .remove {
    visibility: visible;
  }

  .remove {
    visibility: hidden;
    position: absolute;
    right: 0;
    top: 0;
    width: 4rem;
    height: 4rem;
    background-color: rgba(255, 0, 0, 0.5);
    line-height: 4rem;
    font-size: 2rem;
    text-align: center;
    color: #fff;
    border-radius: 8px;
  }

  .count {
    background-color: rgba(255, 255, 255, 0.9);
    position: absolute;
    bottom: 0;
    padding: 0 .25rem;
    border-radius: 4px;
    right: 0;
    display: block;
    height: 16px;
    line-height: 16px;
    text-align: center;
    font-size: 1rem;
    display: block;
  }
}
</style>