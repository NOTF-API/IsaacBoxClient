<template>
  <div class="pill item list-styled" :class="{ large: props.isLarge }"
    @click.left="handleGive(props.item.id, props.isLarge)" @click.right="handleGive(props.item.id, props.isLarge)">
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
.pill.item.list-styled {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  width: 100% !important;
  height: 44px;
  position: relative;
  border-radius: 8px;
  margin-top: 0;
  line-height: 44px;

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
    transform: translate(4px, 4px);
    scale: 2;
    margin-left: auto;
    margin-right: .5rem;
  }

  &.large {
    .image {
      background-position: -192px 0;
      transform: translate(4px, 4px);
    }
  }

  .name {
    padding: 0 .75rem;
    display: block;
    position: absolute;
    left: 44px;
    height: 44px;
    line-height: 44px;
    top: 0rem;
    font-size: 1.75rem;
  }

  .gid {
    background-color: #ffffffbf;
    border-radius: 4px;
    z-index: 1000;
    position: absolute;
    right: .25rem;
    bottom: .25rem;
    height: calc(44px - .5rem);
    padding: 0 .5rem;
    line-height: calc(44px - .5rem);
    width: fit-content;
    min-width: 4rem;
    text-align: center;
    font-size: 2rem;
  }
}
</style>