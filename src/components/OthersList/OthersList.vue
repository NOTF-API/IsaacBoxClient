<template>
  <div class="view-container">
    <div class="options">
      <div class="idea-popover">
        <div class="shadowed idea-text">{{ $t("$idea-others") }}</div>
      </div>
    </div>
    <div class="view-content">
      <HeartItems @spawn="handleSpawn" />
      <CoinItems @spawn="handleSpawn" />
      <BoomItems @spawn="handleSpawn" />
      <KeyItems @spawn="handleSpawn" />
      <BatteryItems @spawn="handleSpawn" />
      <ChestItems @spawn="handleSpawn" />
      <GrabBagItems @spawn="handleSpawn" />
      <Pills @spawn="handleSpawn" />
      <OtherItems @spawn="handleSpawn" />
    </div>
  </div>
</template>

<script setup>
import HeartItems from './hearts.vue'
import CoinItems from './coins.vue'
import BoomItems from './booms.vue'
import KeyItems from './keys.vue'
import ChestItems from './chests.vue'
import GrabBagItems from './grab-bags.vue'
import BatteryItems from './batteries.vue'
import OtherItems from './others.vue'
import Pills from './pills.vue'

import { emit } from "@/utils/ws"

const handleSpawn = (id) => {
  emit("COMMAND", `spawn ${id}`)
}
</script>
    
<style lang="less">
@import url("../list.less");
</style>
    