<template>
  <div class="item" :class="{ 'list-styled': props.isListStyled }" @click.left="handleStageJump(item.sid)"
    @click.right="handleStageJump(item.sid)">
    <div class="image" :style="getSpriteOffsetStyle(props.item.spriteOffset)"></div>
    <div class="shadowed id" v-show="props.showId">{{ props.item?.sid }}</div>
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
      background-color: #fff;
      position: absolute;
      right: .25rem;
      bottom: .25rem;
      display: block;
      width: auto;
      padding: .5rem;
      height: 16px;
      line-height: 16px;
      text-align: center;
      font-size: 1.5rem;
    }
  }

  >* {
    pointer-events: none;
  }
}
</style>