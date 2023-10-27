<template>
  <transition name="search">
    <div class="search view-container" v-show="props.searchInput.length !== 0">
      <div class="shadowed search-bar">{{ props.searchInput }}<span class="cursor"></span></div>
      <div class="search-title">{{ $t("Search") }}</div>
      <div class="search-result view-content">
        <CollectibleItem :is-list-styled="true" v-for="c in collectibles" :item="c" :show-quality="true"
          :show-id="true" />
        <TrinketItem :is-list-styled="true" v-for="t in trinkets" :item="t" :show-id="true" />
        <TrinketItem :is-list-styled="true" v-for="t in trinkets" :item="t" :show-id="true" :is-golden="true" />
        <CardItem :is-list-styled="true" v-for="k in cards" :gid="k" :show-id="true" />
        <PillItem v-for="p in pills" :item="p" :is-list-styled="true" :is-show-id="true" />
        <PillItem v-for="p in pills" :item="p" :is-list-styled="true" :is-large="true" :is-show-id="true" />
        <div class="empty"
          v-show="collectibles.length === 0 && trinkets.length === 0 && cards.length === 0 && pills.length === 0">NOT
          FOUND</div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "GlobalSearch"
}
</script>

<script setup>
import CollectibleItem from '@/components/CollectiblesList/CollectibleItem.vue';
import TrinketItem from '@/components/TrinketsList/TrinketItem.vue';
import CardItem from '../CardsList/CardItem.vue';
import PillItem from '../PillsList/PillItem.vue';

import { search } from '@/utils/resources'
import { ref, watch } from 'vue'

const props = defineProps(["searchInput"])

const collectibles = ref([])
const trinkets = ref([])
const cards = ref([])
const pills = ref([])

watch(() => props.searchInput, (newValue) => {
  if (!newValue) {
    collectibles.value = [];
    trinkets.value = [];
    return;
  }
  const keyword = newValue.toLowerCase().replaceAll(/\s/g, "");
  if (keyword.length === 0) {
    return;
  }
  const { c, t, k, p } = search(keyword);
  collectibles.value = c;
  trinkets.value = t;
  cards.value = k
  pills.value = p;
})

</script>

<style scoped lang="less">
@import url("../list.less");

@keyframes cursor-blink {

  0%,
  100% {
    visibility: visible;
  }

  50% {
    visibility: hidden;
  }
}

.search {
  background-color: #605a59;

  .search-bar {
    z-index: 10000000;
    display: flex;
    align-items: center;
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
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 4px;
    z-index: 10001;

    .cursor {
      display: inline-block;
      width: 5px;
      margin: 0 .25rem;
      height: 2rem;
      background-color: #444;
      animation: cursor-blink 1s steps(1) infinite;
    }
  }

  .search-title {
    position: absolute;
    left: 3rem;
    top: 2rem;
    height: 3rem;
    line-height: 3rem;
    font-size: 3rem;
    z-index: 12000000;
    color: #fff;
  }

  .search-result {
    border: none !important;
    box-shadow: none;
    pointer-events: all;
    font-size: 2rem;
    position: absolute;
    inset: 2rem;
    top: 6rem;
    bottom: 2rem;
    border-radius: 8px;

    z-index: 10000;

    .empty {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
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
