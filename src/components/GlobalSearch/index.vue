<template>
  <transition name="search">
    <div class="search" v-show="searchInput.length !== 0">
      <div class="shadowed search-bar">{{ searchInput }}</div>
      <div class="search-result view-content"></div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "GlobalSearch"
}
</script>

<script setup>
import { ref } from 'vue'

const searchInput = ref("")

window.addEventListener("keydown", (event) => {
  if (/^[a-zA-Z0-9\x20\.]{1}$$/.test(event.key)) {
    searchInput.value += event.key;
  } else if (event.key === "Backspace") {
    if (searchInput.value.length === 0) {
      return;
    } else {
      searchInput.value = searchInput.value.substring(0, searchInput.value.length - 1)
    }
  }else if(event.key==="Escape"){
    searchInput.value = ""
  }
});
</script>

<style scoped lang="less">
.search {
  position: fixed;
  pointer-events: none;
  width: 100%;
  height: 100%;
  inset: 0;
  //   background-color: #fffc;

  .search-bar {
    pointer-events: none;
    font-size: 2rem;
    position: absolute;
    top: 2rem;
    right: 2rem;
    width: 20rem;
    overflow: hidden;
    height: 3rem;
    padding: 0 1rem;
    line-height: 3rem;
    background-color: #fffb;
    border-radius: 4px;
    // box-shadow: 0 0 2px #f1f;
    z-index: 10001;
  }

  .search-result {
    pointer-events: all;
    font-size: 2rem;
    position: absolute;
    bottom: 2rem;
    right: 2rem;
    left: 2rem;
    top: 2rem;
    border-radius: 4px;
    // box-shadow: 0 0 2px #f1f;
    z-index: 10000;
  }
}
</style>

<style>
.search-enter-active,
.search-leave-active {
  transform: translateY(0);
  /* opacity: 1; */
  transition: transform 0.2s ease;
}

.search-enter-from,
.search-leave-to {
  /* opacity: 0; */
  transform: translateY(-120%);
}
</style>
