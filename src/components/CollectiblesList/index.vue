<template>
  <div class="collectibles view-container">
    <div class="view-content no-scrollbar">
      <div class="item" :id="i" :class="collectibles[i - 1] ? 'active' : null" v-for="i, index in   indexArr  "
        @click="handleSpawn(i)">
        <!-- <div class="number">#{{ i }}</div> -->
        <div class="quality" :class="getItemQualityClass(i)"></div>
        <div class="image" :style="getComputedStyle(index + 1)"></div>
        <div class="remove" v-show="collectibles[i - 1]" @click.self.stop="handleRemove(i)">x</div>
        <div class="count" v-if="collectibles[i - 1]">{{ collectibles[i - 1] }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { collectibles, emit } from "@/utils/ws"
import { useItemsStore } from "@/store"
import { storeToRefs } from 'pinia'
import { computed } from "vue";
const store = useItemsStore();
const { itemsMetaData, items } = storeToRefs(store);

const getItemQualityClass = computed(() => {
  return (id) => {
    return "level" + itemsMetaData.value.find((item) => {
      return (item.type === "item") && (item.id === String(id));
    })?.quality
  }
})

const handleSpawn = (id) => {
  emit("COMMAND", `spawn 5.100.${id}`);
}

const handleRemove = (id) => {
  emit("COMMAND", `r c${id}`);
}

const indexArr = [];
const excludeIndex = [43, 61, 235, 587, 613, 620, 630, 648, 662, 666, 718]
for (let i = 1; i <= 732; i++) {
  if (excludeIndex.includes(i)) {
    continue;
  }
  indexArr.push(i);
}

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

.view-content {
  .item {
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
      bottom: 0;
      width: 9px;
      height: 9px;
      background-image: url("/assets/eid_inline_icons.png");
      background-size: 140px 204px;
      image-rendering: pixelated;
      scale: 2;
      transform-origin: left bottom;
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
      background-image: url("/assets/collectibles_sprite.png");
      background-size: 640px 1280px;
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
  }
}
</style>
