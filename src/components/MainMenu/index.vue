<template>
  <div class="main-menu" :class="{ active: subMenuArray.every((s) => !s.value) }">
    <div class="title">Isaac's Box</div>
    <div class="fly">
      <div class="sprite"></div>
      <div class="shadow"></div>
    </div>
    <div class="menu">
      <button class="menu-item" @click="isCollectiblesVisible = true">Collectibles</button>
      <button class="menu-item" @click="isTrinketVisible = true">Trinkets</button>
      <button class="menu-item" @click="isCardsVisible = true">Cards/Runes</button>
      <button class="menu-item" @click="isPillsVisible = true">Pills</button>
      <button class="menu-item" @click="isOthersVisible = true">Others</button>
      <button class="menu-item" @click="isMonstersVisible = true">Monsters</button>
    </div>
  </div>
  <CollectiblesList :open="isCollectiblesVisible" @close="isCollectiblesVisible = false" />
  <TrinketsList :open="isTrinketVisible" @close="isTrinketVisible = false" />
  <CardsList :open="isCardsVisible" @close="isCardsVisible = false" />
  <PillsList :open="isPillsVisible" @close="isPillsVisible = false" />
  <OthersList :open="isOthersVisible" @close="isOthersVisible = false" />
  <MonstersList :open="isMonstersVisible" @close="isMonstersVisible = false" />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import CollectiblesList from '@/components/CollectiblesList/index.vue';
import TrinketsList from '@/components/TrinketsList/index.vue';
import CardsList from '@/components/CardsList/index.vue'
import OthersList from '@/components/OthersList/index.vue'
import PillsList from '@/components/PillsList/index.vue'
import MonstersList from '@/components/MonstersList/index.vue'
const isCollectiblesVisible = ref(false);
const isTrinketVisible = ref(false);
const isCardsVisible = ref(false)
const isOthersVisible = ref(false);
const isPillsVisible = ref(false);
const isMonstersVisible = ref(false);
const subMenuArray = [isCollectiblesVisible, isTrinketVisible, isCardsVisible, isOthersVisible, isPillsVisible, isMonstersVisible];
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    subMenuArray.forEach((submenu) => {
      submenu.value = false;
    })
  }
});

onMounted(() => {
  console.log("mounted")
})

</script>

<style scoped lang="less">
.main-menu {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  display: flex;
  column-gap: 4rem;
  justify-content: center;
  align-items: flex-start;
  transition: transform .5s ease;
  transform: translate(0, -120%);

  &.active {
    transform: translate(0, 0);

    .fly {
      transform: translate(193px, -50px);
      animation: fly-in .5s ease-out forwards;
    }
  }

  .title {
    font-family: upheavtt;
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
      transform: translate(193px, -50px);
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
      transform: translate(193px, -50px);
    }
  }

  .fly {
    position: absolute;
    top: 16rem;
    right: 6rem;
    width: 96px;
    height: 80px;
    transform: translate(0, 0);
    animation: fly-out .5s ease-in forwards;

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

.menu {
  font-family: upheavtt;
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
