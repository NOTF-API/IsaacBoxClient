<template>
  <div class="items">
    <div class="item pills" v-for="item, index in arr" @click="handleSpawn(item.id)"
      :class="{ wrap: index === arr.length - 1 }">
      <div class="image">
        <img :src="item.image" alt="">
      </div>
    </div>
  </div>
</template>

<script setup>
import arr from './pills.js'
const emit = defineEmits(["spawn"])
const handleSpawn = (id) => {
  emit("spawn", id)
}
</script>

<style lang="less">
.item.pills {
  .image img {
    scale: 2;
  }
}
</style>