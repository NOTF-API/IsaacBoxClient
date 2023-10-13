<template>
  <div class="cards view-container">
    <div class="view-content card-list no-scrollbar" :class="{ active: props.open }">
      <div class="item card" v-for="item, index in arr" @click="handleSpawn(item.id)">
        <div class="number">#{{ item.id.split(".")[2] }}</div>
        <div class="image">
          <div class="sprite" :style="{ backgroundPosition: `${-item.left * 32}px ${-item.top * 32}px` }"></div>
        </div>
        <div class="name">{{ getCardOrRuneName(item.id.split(".")[2]) }}</div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { emit } from "@/utils/ws"
import arr from './cards.js'
const handleSpawn = (id) => {
  emit("COMMAND", `spawn ${id}`);
}
const props = defineProps(["open"])
import { useItemsStore } from "@/store"
import { storeToRefs } from 'pinia'
const store = useItemsStore();
const { pocketItems } = storeToRefs(store);
const getCardOrRuneName = (id) => {
  return pocketItems.value.find((item) => {
    return (item.type === "rune" || item.type === "card") && item.id === id;
  })?.name.replaceAll("_", " ").replaceAll("NAME", "").replaceAll("#", "")
}
</script>
  
<style lang="less" scoped>
@import url("../list.less");
.card-list {
  .card.item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .number {
      margin-left: .25rem;
      font-size: 2rem;
      height: 1.5rem;
      width: 4rem;
      text-align: center;
      line-height: 1.5rem;
      padding: 0 .25rem;
      border-radius: 4px;
      background-color: #111;
      color: #fff;
      margin-right: 1rem;
    }

    .name {
      color: #352e2c;
      margin-left: 1.5rem;
      font-size: 2rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .image {
      .sprite {
        scale: 3;
        width: 32px;
        height: 32px;
        background-image: url("/assets/cards_sprite.png");
        background-size: 640px 160px;
        background-repeat: no-repeat;
        image-rendering: pixelated;
      }
    }
  }

}
</style>
  