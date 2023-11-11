<template>
  <div class="items">
    <div class="item other" v-for="item in arr" @click="handleSpawn(item.id)"
      :class="{ large: item.large, huge: item.huge }">
      <div class="image">
        <img :src="item.image" alt="">
      </div>
    </div>
  </div>
</template>

<script setup>
import arr from './others.js'
const emit = defineEmits(["spawn"])
const handleSpawn = (id) => {
  emit("spawn", id)
}
</script>

<style lang="less">
.items .item.other {
  margin-top: .5rem;

  .image {
    width: 100%;

    img {
      width: 100%;
    }
  }

  &.large {
    width: 96px;
    height: 96px;
    margin-right: .25rem;
  }

  &.huge {
    width: 128px;
    height: 128px;
    margin-right: .25rem;
  }
}
</style>