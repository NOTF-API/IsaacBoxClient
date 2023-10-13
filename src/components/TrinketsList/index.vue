<template>
  <div class="view-container">
    <div class="view-content no-scrollbar">
      <div class="items">
        <template v-for="i in 189">
          <div class="item" @click="handleSpawn(i)" v-if="i !== 47">
            <div class="image" :style="getComputedStyle(i - 1)"></div>
          </div>
        </template>
      </div>
      <div class="items">
        <template v-for="i in 189">
          <div class="golden item" @click="handleSpawn(i + 32768)" v-if="i !== 47">
            <div class="image" :style="getComputedStyle(i - 1)"></div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { emit } from "@/utils/ws"

const handleSpawn = (id) => {
  emit("COMMAND", `spawn 5.350.${id}`);
}

const props = defineProps(["open"])

const getComputedStyle = (i) => {
  const row = parseInt(i / 20);
  const column = i % 20;
  const xOffset = 32 * column;
  const yOffset = 32 * row;
  return {
    backgroundPosition: `-${xOffset}px -${yOffset}px`
  }
}
</script>
  
<style lang="less" scoped>
@import url("../list.less");

.item {
  cursor: pointer;
  width: 64px;
  height: 64px;
  position: relative;
  border-radius: 8px;
  margin-top: 0;

  &:hover {
    background-color: #00000021;
  }

  @keyframes golden_blink {

    0%,
    100% {
      filter: sepia(1) saturate(10) brightness(2) hue-rotate(0deg);
    }

    50% {
      filter: sepia(1) saturate(10) brightness(1.5) hue-rotate(-10deg);
    }
  }

  &.golden {
    // background-color: gold;
    // opacity: 1;
    filter: sepia(1) saturate(10) brightness(1.5) hue-rotate(0deg);
    // animation: golden_blink 2s linear infinite;
  }

  .image {
    width: 32px;
    height: 32px;
    scale: 2;
    transform-origin: left top;
    background-image: url("/assets/trinket_sprite.png");
    background-size: 640px 320px;
    image-rendering: pixelated;
    background-repeat: no-repeat;
  }

  .desc {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    height: 1rem;
    line-height: 1rem;
    padding: 0 .25rem;
    border-radius: 4px;
    background-color: #111;
    color: #fff;
  }
}
</style>
  