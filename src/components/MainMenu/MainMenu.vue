<template>
  <div class="view" :style="getTransformedStyle">
    <div class="menu view-container" :class="{ active: isMainActive }">
      <button @click="isLanguageSelectVisible = !isLanguageSelectVisible" class="i18n-btn"><img :src="i18nIcon"></button>
      <div class="menu-wrapper">
        <div class="title i18n-en" v-if="getI18nType() !== 'zh'">Isaac's Box</div>
        <div class="title-zh" v-else></div>
        <div class="fly"></div>
        <div class="menu-content">
          <button class="menu-item" v-for="submenu in submenus" v-text="submenu.name"
            @click="handleActiveSubmenu(submenu)"></button>
        </div>
      </div>
    </div>
    <component v-for="submenu in submenus" :is="submenu.component" :style="submenu.style" />
  </div>
  <GlobalSearch :searchInput="searchInput" @clear="handleClear" />
  <LanguageSelect :class="{ active: isLanguageSelectVisible }" @close="isLanguageSelectVisible = false" />
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { getSubmenus } from './submenus'
import { getI18nType, getI18nState } from '@/utils/i18n'
import i18nIcon from '@/assets/icon/i18n.svg'

import GlobalSearch from '@/components/GlobalSearch/GlobalSearch.vue'
import LanguageSelect from '@/components/LanguageSelect/LanguageSelect.vue'
const searchInput = ref("")

const isLanguageSelectVisible = ref(false)

const submenus = getSubmenus();

const handleClear = () => {
  searchInput.value = ""
}

window.addEventListener("mousedown", (event) => {
  if (event.button === 2) {
    handleReturn();
  }
})

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    handleReturn();
  }
  else if (/^[a-zA-Z0-9\x20\.]{1}$$/.test(event.key)) {
    searchInput.value += event.key;
  } else if (event.key === "Backspace" || event.key === "Delete") {
    if (searchInput.value.length === 0) {
      return;
    } else {
      searchInput.value = searchInput.value.substring(0, searchInput.value.length - 1)
    }
  }
});

const handleReturn = () => {
  if (isLanguageSelectVisible.value) {
    isLanguageSelectVisible.value = false;
    return;
  }
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
.i18n-btn {
  cursor: pointer;
  width: 4rem;
  height: 4rem;
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  background: none;
  border: none;
  outline: none;

  &:hover {
    filter: invert(1);
  }

  img {
    width: 100%;
    height: 100%;
  }
}

.menu {
  width: 100%;
  height: 100%;
  inset: 0;
  position: absolute;
  display: flex;
  // column-gap: 4rem;
  justify-content: center;
  align-items: center;
  // align-items: flex-start;

  .menu-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: .5rem;
    position: relative;
  }

  .title,
  .title-zh {
    // position: absolute;
    top: 3rem;
    font-size: 7rem;
    // color: #c50500;
    // text-shadow: #430000 0px 4px;
    animation: up-and-down 1.25s steps(3) infinite;
    filter: drop-shadow(16px 32px 16px #00000036);
  }

  .title-zh {
    width: calc(1804px / 3.5);
    height: calc(514px / 3.5);
    transform-origin: center top;
    // scale: .3;
    background-size: calc(1804px / 3.5) calc(514px / 3.5);
    background-image: url("/title_chn_by_baiyutang.png");
  }

  .fly {
    position: absolute;
    top: 250px;
    right: -40px;
    width: 96px;
    height: 80px;
    transform: translate(0, 0);
    will-change: transform;
    animation: none;

    &::before,
    &::after {
      content: "";
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

    &::before {
      background-position-x: 0;
    }

    &::after {
      background-position-x: -96px;
    }
  }

  &.active {
    .fly {
      transform: translate(240px, -50px);
      animation: fly-in .375s ease-out .25s forwards, up-and-down 1.25s steps(3) infinite;

      &::before {
        background-position-x: 0;
        animation: fly-sprite 75ms steps(1) infinite;
      }

      &::after {
        background-position-x: -96px;
        animation: fly-shadow 75ms steps(1) infinite;
      }
    }
  }
}

.menu-content {
  // margin-top: 13.5rem;
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
</style>
