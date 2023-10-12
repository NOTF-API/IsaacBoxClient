<template>
  <div class="items">
    <div class="item key" v-for="item in arr" @click="handleSpawn(item.id)">
      <div class="image">
        <img :src="item.image" alt="">
      </div>
    </div>
  </div>
</template>

<script setup>
import arr from './keys.js'
import { emit } from "@/utils/ws"

const handleSpawn = (id) => {
  emit("COMMAND", `spawn ${id}`);
}
</script>

<style lang="less">
.item.key .image {
  width: 100%;
  scale: 2;
}
</style>