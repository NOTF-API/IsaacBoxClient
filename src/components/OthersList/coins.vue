<template>
  <div class="items">
    <div class="item coin" v-for="item, index in arr" @click="handleSpawn(item.id)"
      :class="{ wrap: index === arr.length - 1 }">
      <div class="image">
        <img :src="item.image" alt="">
      </div>
    </div>
  </div>
</template>

<script setup>
import arr from './coins.js'
const emit = defineEmits(["spawn"])
const handleSpawn = (id) => {
  emit("spawn", id)
}
</script>

<style lang="less">
.item.coin {
  .image img {
    scale: 2;
  }
}
</style>