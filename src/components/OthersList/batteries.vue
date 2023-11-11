<template>
  <div class="items">
    <div class="item battery" v-for="item in arr" @click="handleSpawn(item.id)">
      <div class="image">
        <img :src="item.image" alt="">
      </div>
    </div>
  </div>
</template>

<script setup>
import arr from './batteries.js'
const emit = defineEmits(["spawn"])
const handleSpawn = (id) => {
  emit("spawn", id)
}
</script>

<style lang="less">
.item.battery .image img {
  width: 100%;
  scale: 2;
}
</style>