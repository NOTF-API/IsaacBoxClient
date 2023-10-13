<template>
  <div class="view-container">
    <div class="view-content pills-list no-scrollbar">
      <div class="item" v-for="item, index in arr" @click="handleGive(item.id)">
        <div class="number">#{{ item.id }}</div>
        <div class="effect" :class="getPillEffectClass(item.type)"></div>
        <div class="name">{{ item.name }}</div>
        <div class="image"></div>
      </div>
      <div class="large item" v-for="item, index in arr" @click="handleGiveBig(item.id)">
        <div class="number">#{{ item.id }}</div>
        <div class="effect" :class="getPillEffectClass(item.type)"></div>
        <div class="name">{{ item.name }}</div>
        <div class="image"></div>
      </div>
    </div>
  </div>
</template>
    
<script setup>
import { emit } from "@/utils/ws"

import arr from './pills.js'
const props = defineProps(["open"])
const handleGive = (id) => {
  emit("COMMAND", `g p${id}`);
}
const handleGiveBig = (id) => {
  emit("COMMAND", `g P${id}`);
}
const getPillEffectClass = (effect) => {
  if (effect === "负面") {
    return "bad"
  }
  if (effect === "正面") {
    return "good"
  }
  return "normal"
}
</script>
    
<style lang="less">
.pills-list {
  position: absolute;
  padding: 2rem;
  background-color: #dfd1d5;
  box-shadow: 6px 6px 0px -2px #00000013;
  border: 4px solid #726c69;
  inset: 2rem;
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  overflow-y: scroll;
  align-content: flex-start;
  transition: transform .5s ease;

  &.active {
    transform: translate(0, 0);
  }

  .item {

    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    width: 100%;
    height: 32px;
    position: relative;
    border-radius: 8px;
    margin: 2px;
    margin-top: 0;
    line-height: 32px;

    &>* {
      flex-shrink: 0;
    }

    &:hover {
      background-color: #00000021;
    }

    .image {
      flex: none;
      width: 32px;
      height: 32px;
      background-image: url("/assets/gfx/items/pick ups/pickup_007_pill.png");
      background-size: 256px 256px;
      image-rendering: pixelated;
      transform-origin: center center;
      background-position: 0 0;
      transform: translate(3px, 2px);
      scale: 1.5;
      margin-left: auto;
      margin-right: .5rem;
    }

    &.large {
      width: 100%;
      height: auto;

      .image {
        background-position: -192px 0;
      }
    }

    .name {
      color: #352e2c;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      //   font-size: 1.5rem;
      padding-left: .5rem;
      font-size: 2rem;
      //   font-weight: bold;
      //   text-shadow: 1px 1px 0 #000, -1px -1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000;
    }

    .number {
      margin-left: .25rem;
      margin-right: .25rem;
      font-size: 2rem;
      height: 1.5rem;
      width: 4rem;
      text-align: center;
      line-height: 1.5rem;
      padding: 0 .25rem;
      border-radius: 4px;
      background-color: #111;
      color: #fff;
    }

    .effect {
      margin: 0 4px;
      width: 1rem;
      height: 1rem;
      border-radius: 50%;

      &.bad {
        background-color: red;
      }

      &.good {
        background-color: green;
      }

      &.normal {
        background-color: gray;
      }
    }
  }
}
</style>
    