<template>
  <div class="view-container">
    <div class="options">
      <div class="idea-popover">
        <div class="shadowed idea-text">{{ $t("$idea-debug") }}</div>
      </div>
    </div>
    <div class="view-content">
      <div class="item" @click="handleDebug(dbg.id)" v-for="dbg in debugs">{{
        $t(`$debug${dbg.id}`) }} <div class="did">DEBUG {{ dbg.id }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import debugs from './debug'
import { emit } from "@/utils/ws"

const handleDebug = (id) => {
  emit("COMMAND", `debug ${id}`);
}
</script>
  
<style lang="less" scoped>
@import url("../list.less");

.view-content {
  .item {
    width: 100% !important;
    height: 44px;
    line-height: 44px;
    font-size: 2rem;
    text-align: left;
    padding: 0 1rem;
    justify-content: flex-start;

    .did {
      position: absolute;
      right: .25rem;
      bottom: .25rem;
      height: 2.25rem;
      line-height: 2.25rem;
      padding: 0 .75rem;
      min-width: 9rem;
      font-size: 2rem;
      text-align: center;
      background-color: #fff;
      border-radius: 4px;
    }
  }
}
</style>
  