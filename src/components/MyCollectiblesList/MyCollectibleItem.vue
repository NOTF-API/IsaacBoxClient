<template>
  <div class="item" :class="{ 'list-styled': props.isListStyled }" @click.left="handleRemoveOne(item._gid)"
    @click.right="handleRemoveAll(item._gid, props.count)">
    <div class="quality" v-show="props.showQuality" :class="'level' + item.quality"></div>
    <div class="image" :style="getImageSource(item.gfx)"></div>
    <div class="count" v-show="props.showCount">{{ props.count }}</div>
    <div class="name" v-text="item.name"></div>
    <div class="description ellipsis" v-text="item.description"></div>
    <div class="remove">x</div>
    <!-- <div class="remove" v-show="collectibles[i - 1]" @click.self.stop="handleRemove(i)">x</div> -->
  </div>
</template>

<script setup>
import { emit } from "@/utils/ws"

const props = defineProps(['item', 'isListStyled', 'showQuality', 'showCount', 'count'])

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
.item {
  overflow: hidden;

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

    .count {
      position: absolute;
      left: 64px;
      transform: translateX(-100%);
      bottom: 0rem;
      //   width: 2rem;
      width: fit-content;
    }

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
    position: absolute;
    width: 32px;
    height: 32px;
    scale: 2;
    background-repeat: no-repeat;
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


  .description,
  .name {
    display: none;
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