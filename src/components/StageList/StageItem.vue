<template>
  <div class="item" :class="{ 'list-styled': props.isListStyled }" @click.left="handleStageJump(item.sid)">
    <div class="image" :style="getSpriteOffsetStyle(props.item.spriteOffset)"></div>
    <div class="id" v-show="props.showId">{{ props.item?.sid }}</div>
    <div class="name">{{ props.item.name }} {{ props.item?.exname }}</div>
  </div>
</template>

<script setup>
import { emit } from "@/utils/ws"

const props = defineProps(['item', 'isListStyled', 'showId'])

const handleStageJump = (sid) => {
  emit("COMMAND", `stage ${sid}`);
}

const getSpriteOffsetStyle = (offset) => {
  if (!offset) {
    return;
  }
  return {
    backgroundPosition: `${-offset[0] * 32}px ${-offset[1] * 32}px`
  }
}
</script>

<style lang="less" scoped>
.item {
  &.list-styled {
    width: 100% !important;
    margin-bottom: .25rem;

    .image {
      width: 32px;
      height: 32px;
      scale: 3;
      transform-origin: left top;
      position: absolute;
      left: -4px;
      top: -16px;
      background-image: url("/assets/gfx/ui/stage/progress.png");
      transform: translateY(-6px);
    }


    .name {
      padding: 0 1rem;
      display: block;
      position: absolute;
      left: 5rem;
      height: 4rem;
      line-height: 4rem;
      top: 0;
      font-size: 2rem;
    }

    .id {
      border-radius: 4px;
      background-color: #ffffffbf;
      position: absolute;
      right: .5rem;
      bottom: .5rem;
      display: block;
      padding: 0 1rem;
      width: fit-content;
      min-width: 3rem;
      height: calc(64px - 1rem);
      line-height: calc(64px - 1rem);
      text-align: center;
      font-size: 2rem;
    }
  }

  >* {
    pointer-events: none;
  }
}
</style>