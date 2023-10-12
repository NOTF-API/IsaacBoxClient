<template>
  <div class="items">
    <div class="item chest" v-for="item in arr" @click="handleSpawn(item.id)" :class="{ large: item.large }">
      <div class="image">
        <img :src="item.image" alt="">
      </div>
    </div>
  </div>
</template>

<script setup>
import { emit } from "@/utils/ws"

import arr from './chests.js'
const handleSpawn = (id) => {
  emit("COMMAND", `spawn ${id}`);
}
</script>

<style lang="less">
.items .item.chest {
  .image img {
    scale: 2;
  }
}
</style>