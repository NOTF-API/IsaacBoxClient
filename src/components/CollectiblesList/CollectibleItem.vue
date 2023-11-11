<template>
  <div class="item" :class="{ 'list-styled': props.isListStyled }" @click.left="handleSpawn(item.id)"
    @click.right="handleGive(item._gid)">
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

const handleSpawn = (id) => {
  emit("COMMAND", `spawn 5.100.${id}`);
}

const handleGive = (gid) => {
  emit("COMMAND", `g ${gid}`);
}

const getImageSource = (gfx) => {
  return {
    backgroundImage: `url('${gfx}')`
  }
}
</script>

<style lang="less" scoped>
.item {
  &.list-styled {
    width: 100% !important;
    margin-bottom: .25rem;

    .image {
      transform-origin: left top;
      position: absolute;
      left: 0;
      top: 0;
    }


    .name {
      padding: 0 .75rem;
      display: block;
      position: absolute;
      left: 64px;
      height: 1.75rem;
      line-height: 1.75rem;
      top: 0.375rem;
      font-size: 1.75rem;
    }

    .description {
      padding: 0 .75rem;
      display: block;
      position: absolute;
      left: 64px;
      line-height: 2rem;
      top: 34px;
      bottom: 0;
      font-size: 1.25rem;
    }

    .id {
      position: absolute;
      right: .5rem;
      bottom: .5rem;
      display: block;
      padding: 0 1rem;
      width: fit-content;
      min-width: 5rem;
      height: calc(64px - 1rem);
      line-height: calc(64px - 1rem);
      text-align: center;
      font-size: 2rem;
    }

  }

  >* {
    pointer-events: none;
  }

  .number {
    font-size: 1.25rem;
    visibility: hidden;
    position: absolute;
    left: 50%;
    top: 100%;
    transform: translateX(-50%);
    width: 100%;
    height: 2rem;
    line-height: 2rem;
    text-align: center;
    border-radius: 4px;
    background-color: #fff;
    color: #000;
    z-index: 1000;
  }

  .quality {
    position: absolute;
    left: -4px;
    top: 0;
    width: 9px;
    height: 9px;
    background-image: url("/assets/eid_inline_icons.png");
    background-size: 140px 204px;
    image-rendering: pixelated;
    transform-origin: left bottom;
    transform: translate(5px, 10px) scale(2);
    z-index: 1000;

    &.level {
      visibility: hidden;

      &0 {
        visibility: visible;
        background-position: -44px -33px;
      }

      &1 {
        visibility: visible;
        background-position: -55px -33px;
      }

      &2 {
        visibility: visible;
        background-position: -66px -33px;
      }

      &3 {
        visibility: visible;
        background-position: -77px -33px;
      }

      &4 {
        visibility: visible;
        background-position: -88px -33px;
      }
    }
  }

  .image {
    width: 32px;
    height: 32px;
    scale: 2;
    background-repeat: no-repeat;
  }

  .description,
  .name {
    display: none;
  }

  .id {
    background-color: #ffffffbf;
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