<template>
  <div v-if="!props.isGolden" class="item" :class="{ 'list-styled': props.isListStyled }"
    @click="handleClick($event, false)">
    <div class="id" v-show="showId">{{ props.item._gid }}</div>
    <div class="name">{{ props.item.name }}</div>
    <div class="description">{{ props.item.description }}</div>
    <div class="image" :style="getImageSource(props.item.gfx)"></div>
  </div>
  <div v-else class="golden item" :class="{ 'list-styled': props.isListStyled }" @click="handleClick($event, true)">
    <div class="id" v-show="showId">{{ 'T' + (parseInt(props.item.id) + 32768) }}</div>
    <div class="name">{{ props.item.name }}</div>
    <div class="description">{{ props.item.description }}</div>
    <div class="image" :style="getImageSource(props.item.gfx)"></div>
  </div>
</template>

<script setup>
import { emit } from "@/utils/ws"

const props = defineProps(['item', 'isGolden', 'showId', 'isListStyled'])

const handleClick = ($event, isLarge) => {
  if ($event.ctrlKey) {
    const gid = props.item._gid
    emit("COMMAND", `g ${isLarge ? gid.toUpperCase() : gid}`);
  } else {
    const id = parseInt(props.item.id);
    emit("COMMAND", `spawn 5.300.${isLarge ? id + 32768 : id}`);
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
  cursor: pointer;
  width: 64px;
  height: 64px;
  position: relative;
  border-radius: 8px;
  margin-top: 0;

  &.list-styled {
    width: 100% !important;
    margin-bottom: .25rem;

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

    .image {
      transform-origin: left top;
      position: absolute;
      left: 0;
      top: 0;
      border-radius: 4px;
    }

    .id {
      position: absolute;
      right: .5rem;
      bottom: .5rem;
      display: block;
      padding: 0 1rem;
      width: fit-content;
      height: calc(64px - 1rem);
      line-height: calc(64px - 1rem);
      text-align: center;
      font-size: 2rem;
    }

    .remove {}

    .count {}


  }

  &:hover {
    background-color: #00000021;
  }

  //   @keyframes golden_blink {

  //     0%,
  //     100% {
  //       filter: sepia(1) saturate(10) brightness(2) hue-rotate(0deg);
  //     }

  //     50% {
  //       filter: sepia(1) saturate(10) brightness(3) hue-rotate(-10deg);
  //     }
  //   }

  &.golden {
    .image {
      //   animation: golden_blink 1s linear infinite;
      filter: sepia(1) saturate(10) brightness(2);
    }
  }

  .image {
    width: 32px;
    height: 32px;
    scale: 2;
    background-repeat: no-repeat;
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
    z-index: 1000;
  }

  .description,
  .name {
    display: none;
  }
}
</style>