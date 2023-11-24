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
    font-size: 1rem;
    position: absolute;
    left: 0;
    top: 0;
    width: 20px;
    text-align: center;
    height: 20px;
    line-height: 18px;
    background-color: #000;
    box-shadow: 0 0 0 2.5px #000 inset;
    border-radius: 6px;
    image-rendering: pixelated;
    transform-origin: left bottom;
    z-index: 1000;
    color: #000;

    &.level {
      visibility: hidden;
      &0 {
        background-image: linear-gradient(#ffffff,#838383);
        &::after {
          content: "0";
        }
      }

      &1 {
        background-image: linear-gradient(#dbffc3,#4dd300);
        &::after {
          content: "1";
        }
      }

      &2 {
        background-image: linear-gradient(#d5ffff,#00a1dd);
        &::after {
          content: "2";
        }
      }

      &3 {
        background-image: linear-gradient(#e388d8,#c729b5);
        &::after {
          content: "3";
        }
      }

      &4 {
        background-image: linear-gradient(#fff69a,#e6a600);
        &::after {
          content: "4";
        }
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