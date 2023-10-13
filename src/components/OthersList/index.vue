<template>
  <div class="view-container">
    <div class="view-content no-scrollbar">
      <CoinItems />
      <BoomItems />
      <KeyItems />
      <BatteryItems />
      <ChestItems />
      <GrabBagItems />
      <OtherItems />
    </div>
  </div>
</template>
    
<script setup>
import CoinItems from './coins.vue'
import BoomItems from './booms.vue'
import KeyItems from './keys.vue'
import ChestItems from './chests.vue'
import GrabBagItems from './grab-bags.vue'
import BatteryItems from './batteries.vue'
import OtherItems from './others.vue'
const props = defineProps(["open"])

</script>
    
<style lang="less">
@import url("../list.less");
</style>
    