<template>
  <div class="view-container">
    <div class="options">
      <div class="idea-popover">
        <div class="shadowed idea-text">{{ $t("$idea-debug") }}</div>
      </div>
    </div>
    <div class="view-content">
      <div class="item" @click="handleDebug(dbg.id)" v-for="dbg in debugs">{{
        $t(`$debug${dbg.id}`) }} <div class="shadowed did">DEBUG {{ dbg.id }}</div>
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
  //   border-top: 4px solid #726c69;
  //   top: 2rem;

  .item {
    width: 100% !important;
    height: 44px;
    line-height: 44px;
    font-size: 2rem;
    font-weight: bold;
    text-align: left;
    padding: 0 1rem;
    justify-content: flex-start;

    .did {
      position: absolute;
      right: 0;
      top: 10px;
      height: 1.5rem;
      line-height: 1.5rem;
      margin-right: .75rem;
      width: 7rem;
      font-size: 24px;
      text-align: center;
      background-color: #fff;
      border-radius: 4px;
    }
  }
}
</style>
  