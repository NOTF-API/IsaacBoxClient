<template>
  <div class="items">
    <div class="item other" v-for="item in arr" @click="handleSpawn(item.id)" :class="{ large: item.large }">
      <div class="image">
        <img :src="item.image" alt="">
      </div>
    </div>
  </div>
</template>

<script setup>
import arr from './others.js'
import { emit } from "@/utils/ws"

const handleSpawn = (id) => {
  emit("COMMAND", `spawn ${id}`);
}
</script>

<style lang="less">
.items .item.other {
  .image {
    width: 100%;

    img {
      width: 100%;
    }
  }
}
</style>