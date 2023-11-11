<template>
  <div class="item heart" v-for="item in arr" @click="handleSpawn(item.id)">
    <div class="image">
      <img :src="`${item.image}`" alt="" srcset="">
    </div>
    <div class="id">{{ item.id }}</div>
  </div>
</template>

<script setup>
import arr from './hearts.js'
const emit = defineEmits(["spawn"])
const handleSpawn = (id) => {
  emit("spawn", id)
}
</script>

<style lang="less">
.item.heart .image img {
  width: 100%;
}
</style>