<template>
  <div class="view" :style="getTransformedStyle">
    <div class="menu view-container" :class="{ active: isMainActive }">
      <div class="title i18n-0" v-if="getI18nType() !== '3'">Isaac's Box</div>
      <div class="chn_title" v-else></div>
      <div class="version">{{ $t("$version") }}</div>
      <div class="fly">
        <div class="sprite"></div>
        <div class="shadow"></div>
      </div>
      <div class="idea">
        {{ $t("$idea-search") }}
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

<script setup>
import { ref, reactive, computed } from 'vue'
import { getSubmenus } from './submenus'
import { getI18nType } from '@/utils/i18n'
import GlobalSearch from '@/components/GlobalSearch/GlobalSearch.vue'
const searchInput = ref("")

const submenus = getSubmenus();

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (searchInput.value.length !== 0) {
      searchInput.value = ""
      return;
    }
    submenus.forEach((submenu) => {
      if (submenu.active.value) {
        submenu.active.value === false
      }
    });
    isMainActive.value = true;
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

const isMainActive = ref(true);
const transform = reactive({
  x: 0,
  y: 0
})

const handleActiveSubmenu = (submenu) => {
  isMainActive.value = false;
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

  .title,
  .chn_title {
    position: absolute;
    top: 3rem;
    font-size: 7rem;
    color: #c50500;
    text-shadow: #430000 0px 4px;
    animation: up-and-down 1.25s steps(3) infinite;
    filter: drop-shadow(16px 32px 16px #00000036);
  }

  .chn_title {
    width: 1804px !important;
    height: 514px !important;
    transform-origin: center top;
    scale: .3;
    background-size: 1804px 514px;
    background-image: url("/title_chn_by_baiyutang.png");
  }

  .idea {
    position: absolute;
    right: 0;
    bottom: 0;
    padding: .5rem;
    font-size: 1.5rem;
    color: #f6f6f6;
    text-shadow: #9e0b0b 0 2px;
  }

  .idea-launch-game {
    position: absolute;
    z-index: 1000;
    width: 100%;
    height: 100%;
    inset: 0;
    background-color: #fff;
    color: #000;
    font-size: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .version {
    position: absolute;
    right: 4.875rem;
    top: 10rem;
    font-size: 2rem;
    color: #c50500;
    text-shadow: #430000 0px 2px;
  }

  @keyframes fly-in {
    from {
      transform: translate(240px, -50px);
    }

    to {
      transform: translate(0, 0);
    }
  }

  @keyframes up-and-down {

    0%,
    100% {
      translate: 0 0px;
    }

    50% {
      translate: 0 4px;
    }
  }

  .fly {
    // display: none;
    position: absolute;
    top: 16rem;
    right: 6rem;
    width: 96px;
    height: 80px;
    transform: translate(0, 0);
    will-change: transform;
    animation: none;

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
    }

    .shadow {
      background-position-x: -96px;
    }
  }

  &.active {
    .fly {
      transform: translate(240px, -50px);
      animation: fly-in .375s ease-out .25s forwards, up-and-down 1.25s steps(3) infinite;

      .sprite {
        background-position-x: 0;
        animation: fly-sprite 75ms steps(1) infinite;
      }

      .shadow {
        background-position-x: -96px;
        animation: fly-shadow 75ms steps(1) infinite;
      }
    }
  }
}

.menu-content {
  margin-top: 13.5rem;
  width: 363px;
  padding: 2rem 0;
  background-color: #e9dadf;
  border: 4px solid #726c69;
  box-shadow: 4px 4px #00000013;

  .menu-item {
    display: block;
    height: 1.25rem;
    line-height: 1.25rem;
    margin-bottom: 1rem;
    margin-left: 2rem;
    margin-right: auto;
    padding: 0;
    border: none;
    background: none;
    color: #352e2c;
    font-size: 1.75rem;
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
