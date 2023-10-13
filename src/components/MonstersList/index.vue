<template>
  <div class="monsters view-container">
    <div class="view-content no-scrollbar">
      <div class="items" v-for="itemGroup in itemGroups">
        <div class="item monster" v-for="id in itemGroup" @click="handleSpawn(id)">
          <div class="image">
            <img :src="`./assets/entity/Entity_${id}.png`" alt="" :onerror="handleSuffixReplace">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import itemGroups from './monsters.js'
import { emit } from "@/utils/ws"

const handleSpawn = (id) => {
  emit("COMMAND", `spawn ${id}`);
}
function handleSuffixReplace() {
  const originSrc = this.src;
  if (originSrc.endsWith(".gif")) {
    this.src = "./assets/gfx/items/collectibles/questionmark.png"
    return;
  }
  if (originSrc.endsWith("questionmark.png")) {
    return;
  }
  this.src = originSrc.replace(".png", ".gif")
}
</script>

<style lang="less" scoped>
@import url("../list.less");

.item.monster {
  width: auto;
  height: auto;

  &:hover {
    background: none;

    .image {
      filter: drop-shadow(0 0 2px #1414f8);
    }
  }

  .image {
    width: fit-content;
    height: fit-content;

    img {
      //   width: 96px;
      width: auto;
      height: auto;
      object-fit: contain;
    }
  }
}
</style>