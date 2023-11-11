<template>
  <div class="items">
    <div class="item boom" v-for="item in arr" @click="handleSpawn(item.id)">
      <div class="image">
        <img :src="item.image" alt="" :style="{ scale: item.imageScale || 2 }">
      </div>
    </div>
  </div>
</template>

<script setup>
import arr from './booms.js'
const emit = defineEmits(["spawn"])
const handleSpawn = (id) => {
  emit("spawn", id)
}
</script>

<style lang="less"></style>