<template>
  <div class="item" :class="{ 'list-styled': props.isListStyled }" @click.left="handleSpawn(item.id)"
    @click.right="handleGive(item._gid)">
    <div class="quality" v-show="props.showQuality" :class="'level' + item.quality"></div>
    <div class="image" :style="getImageSource(item.gfx)"></div>
    <div class="shadowed id" v-show="props.showId">{{ item._gid }}</div>
    <div class="name" v-text="item.name"></div>
    <div class="description ellipsis" v-text="item.description"></div>
    <!-- <div class="remove" v-show="collectibles[i - 1]" @click.self.stop="handleRemove(i)">x</div> -->
    <!-- <div class="count" v-if="collectibles[i - 1]">{{ collectibles[i - 1] }}</div> -->
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

const handleRemove = (id) => {
  emit("COMMAND", `r c${id}`);
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

    .quality {
      position: absolute;
      left: -4px;
      z-index: 10000000;
    }

    .image {
      transform-origin: left top;
      position: absolute;
      left: 0;
      top: 0;
      //   background-color: #64585b;
      border-radius: 4px;
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

    .tags {
      display: flex;
      top: 40px;
      left: 64px;
      margin-left: .75rem;
      line-height: 20px;
      height: 20px;
      column-gap: .5rem;
      position: absolute;

      .tag {
        padding: 0 .5rem;
        border-radius: 4px;
        background-color: rgb(35, 35, 35);
        color: #fff;
      }
    }

    .remove {}

    .count {}


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
    left: 0;
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

  .tags {
    display: none;
  }

  .image {
    width: 32px;
    height: 32px;
    scale: 2;
    background-repeat: no-repeat;
  }

  .remove {
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0;
    width: 1rem;
    height: 1rem;
    background-color: red;
    line-height: 1rem;
    text-align: center;
    color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .25),
      0 0 6px rgba(0, 0, 0, .25);
  }

  .count {
    position: absolute;
    right: .5rem;
    bottom: .5rem;
    height: 1rem;
    line-height: 1rem;
    padding: 0 .125rem;
    border-radius: 4px;
    text-align: center;
    background-color: #fff;
    font-smooth: never;
    font-weight: bold;
    color: #000;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .25),
      0 0 6px rgba(0, 0, 0, .25);
  }


  .description,
  .name {
    display: none;
  }

  .id {
    background-color: #fff;
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