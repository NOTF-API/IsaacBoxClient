<template>
  <div class="item list-styled" :class="{ large: props.isLarge }" @click.left="handleGive(props.item.id, props.isLarge)"
    @click.right="handleGive(props.item.id, props.isLarge)">
    <div class="gid" v-show="props.isShowId">{{ props.item._gid }}</div>
    <div class="name">{{ props.item.name }}</div>
    <div class="image"></div>
  </div>
</template>

<script setup>
import { emit } from "@/utils/ws"
const props = defineProps(["item", "isLarge", 'isShowId'])

const handleGive = (id, isLarge) => {
  if (!isLarge) {
    emit("COMMAND", `g p${id}`);
  } else {
    emit("COMMAND", `g P${id}`);
  }
}

</script>

<style lang="less" scoped>
.item.list-styled {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  width: 100% !important;
  height: 64px;
  position: relative;
  border-radius: 8px;
  margin-top: 0;
  line-height: 48px;

  &:hover {
    background-color: #00000021;
  }

  .image {
    position: absolute;
    left: 0;
    top: 0;
    flex: none;
    width: 32px;
    height: 32px;
    background-image: url("/assets/gfx/items/pick ups/pickup_007_pill.png");
    background-size: 256px 256px;
    image-rendering: pixelated;
    transform-origin: center center;
    background-repeat: no-repeat;
    background-position: 0 0;
    transform: translate(10px, 9px);
    scale: 2;
    margin-left: auto;
    margin-right: .5rem;
  }

  &.large {
    .image {
      background-position: -192px 0;
    }
  }

  .name {
    padding: 0 .75rem;
    display: block;
    position: absolute;
    left: 64px;
    height: 4rem;
    line-height: 4rem;
    top: 0rem;
    font-size: 1.75rem;
  }

  .gid {
    background-color: #fff;
    position: absolute;
    bottom: 0;
    padding: 0 .25rem;
    border-radius: 4px;
    right: 0;
    display: block;
    height: 16px;
    line-height: 16px;
    text-align: center;
    font-size: 1rem;
    display: block;
    z-index: 1000;
    position: absolute;
    right: .25rem;
    bottom: .25rem;
    display: block;
    width: auto;
    padding: .5rem;
    height: 16px;
    line-height: 16px;
    text-align: center;
    font-size: 1.5rem;
  }
}
</style>