<template>
  <div class="view" :style="getTransformedStyle">
    <div class="menu view-container" :class="{ active: isActive }">
      <div class="title">Isaac's Box</div>
      <div class="fly">
        <div class="sprite"></div>
        <div class="shadow"></div>
      </div>
      <div class="menu-content">
        <button class="menu-item" v-for="submenu in submenus" v-text="submenu.name"
          @click="handleActiveSubmenu(submenu)"></button>
      </div>
    </div>
    <component v-for="submenu in submenus" :is="submenu.component" :style="submenu.style" />
  </div>
  <GlobalSearch :searchInput="searchInput" />
</template>

<script>
export default {
  name: "MainMenu"
}
</script>

<script setup>
import { ref, reactive, computed } from 'vue'
import { submenus } from './submenus'

import GlobalSearch from '@/components/GlobalSearch/index.vue'
const searchInput = ref("")

window.addEventListener("keydown", (event) => {
  console.log(event.key)
  if (event.key === "Escape") {
    submenus.forEach((submenu) => {
      if (submenu.active.value) {
        submenu.active.value === false
      }
    });
    isActive.value = true;
    transform.x = 0;
    transform.y = 0;
  }
  else if (/^[a-zA-Z0-9\x20\.]{1}$$/.test(event.key)) {
    searchInput.value += event.key;
  } else if (event.key === "Backspace") {
    if (searchInput.value.length === 0) {
      return;
    } else {
      searchInput.value = searchInput.value.substring(0, searchInput.value.length - 1)
    }
  }
});

const isActive = ref(true);
const transform = reactive({
  x: 0,
  y: 0
})

const handleActiveSubmenu = (submenu) => {
  isActive.value = false;
  submenu.active.value = true;
  transform.x = submenu.gridOffset.x
  transform.y = submenu.gridOffset.y
}

const getTransformedStyle = computed(() => {
  return {
    transform: `translate(${-100 * transform.x}%,${-100 * transform.y}%)`
  }
})



</script>

<style scoped lang="less">
.menu {
  width: 100%;
  height: 100%;
  inset: 0;
  position: absolute;
  display: flex;
  column-gap: 4rem;
  justify-content: center;
  align-items: flex-start;

  &.active {
    .fly {
      transform: translate(240px, -50px);
      animation: fly-in .5s ease-out .5s forwards;
    }
  }

  .title {
    position: absolute;
    top: 3rem;
    -webkit-backdrop-filter: drop-shadow(8px 8px 10px blue);
    backdrop-filter: drop-shadow(8px 8px 10px blue);
    font-size: 7rem;
    color: #c50500;
    text-shadow: #430000 0px 4px;
  }

  @keyframes fly-in {
    from {
      transform: translate(240px, -50px);
    }

    to {
      transform: translate(0, 0);
    }
  }

  @keyframes fly-out {
    from {
      transform: translate(0, 0);
    }

    to {
      transform: translate(240px, -50px);
    }
  }

  .fly {
    position: absolute;
    top: 16rem;
    right: 6rem;
    width: 96px;
    height: 80px;
    transform: translate(0, 0);
    // visibility: hidden;

    // animation: fly-out .5s ease-in .5s forwards;

    @keyframes fly-sprite {

      0%,
      100% {
        background-position-y: 0;
      }

      50% {
        background-position-y: -80px;
      }
    }

    @keyframes fly-shadow {

      0%,
      100% {
        background-position-y: 0px;
      }

      50% {
        background-position-y: -80px;
      }
    }

    .sprite,
    .shadow {
      will-change: background-position-y;
      position: absolute;
      background-image: url("/assets/gfx/ui/main menu/fly.png");
      background-size: 192px 160px;
      width: 96px;
      height: 80px;
      scale: 2;
      background-repeat: no-repeat;
      image-rendering: pixelated;
    }

    .sprite {
      background-position-x: 0;
      animation: fly-sprite .1s steps(1) infinite;
    }

    .shadow {
      background-position-x: -96px;
      animation: fly-shadow .1s steps(1) infinite;
    }
  }
}

.menu-content {
  margin-top: 12rem;
  width: 363px;
  padding: 2rem 0;
  background-color: #e9dadf;
  border: 4px solid #726c69;
  box-shadow: 4px 4px #00000013;

  .menu-item {
    display: block;
    height: 1.5rem;
    line-height: 1.5rem;
    margin-bottom: 1rem;
    margin-left: 2.5rem;
    margin-right: auto;
    padding: 0;
    border: none;
    background: none;
    color: #352e2c;
    font-size: 2rem;
    font-weight: bold;
    cursor: pointer;
    outline: none;
    position: relative;

    &:last-of-type {
      margin-bottom: 0;
    }

    &::after {
      visibility: hidden;
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      left: -16px;
      top: 50%;
      transform: translateY(-50%);
      border: 10px solid transparent;
      border-left-color: #352e2c;
    }

    &:hover::after {
      visibility: visible;
    }
  }
}
</style>
