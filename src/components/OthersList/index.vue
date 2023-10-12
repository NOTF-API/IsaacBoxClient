<template>
  <div class="list no-scrollbar" :class="{ active: props.open }">
    <CoinItems />
    <BoomItems />
    <KeyItems />
    <BatteryItems />
    <ChestItems />
    <GrabBagItems />
    <OtherItems />
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

.list {
  transform: translate(0, 120%);
}
</style>
    