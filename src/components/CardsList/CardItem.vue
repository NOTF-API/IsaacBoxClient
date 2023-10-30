<template>
  <div class="item card" :class="{ 'list-styled': props.isListStyled }"
    @click.left="handleSpawn(pocketItemsData[props.gid].id)" @click.right="handleGive(props.gid)">
    <div class="shadowed gid" v-show="props.showId">{{ props.gid }}</div>
    <div class="image">
      <div class="sprite" :style="{ backgroundPosition: `${-data[gid].left * 32}px ${-data[gid].top * 32}px` }"></div>
    </div>
    <div class="name">{{ pocketItemsData[props.gid].name }}</div>
    <div class="description">{{ pocketItemsData[props.gid].description }}</div>
  </div>
</template>


<script setup>
import { emit } from "@/utils/ws"
import data from './cards.js'

const props = defineProps(['gid', 'isListStyled', 'showId'])
const pocketItemsData = window._resource.pocketItems

// console.log(pocketItemsData[props.gid].id)

const handleSpawn = (id) => {
  emit("COMMAND", `spawn 5.300.${id}`);
}


const handleGive = (gid) => {
  emit("COMMAND", `g ${gid}`);
}
</script>

<style lang="less" scoped>
.card.item {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  &.list-styled {
    width: 100%;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;

    .gid {
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

    .image {
      width: 64px;
      height: 64px;
      position: absolute;
      left: 0;
      top: 0;
      scale: 1.5;

      .sprite {
        scale: 2;
      }
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
  }

  .gid {
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
    z-index: 1000;
  }

  .name,
  .description {
    display: none;
  }

  .image {
    .sprite {
      scale: 3;
      width: 32px;
      height: 32px;
      background-image: url("/assets/cards_sprite.png");
      background-size: 640px 160px;
      background-repeat: no-repeat;
      image-rendering: pixelated;
    }
  }
}
</style>