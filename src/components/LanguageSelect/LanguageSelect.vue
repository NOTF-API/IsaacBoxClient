<template>
  <div class="view-container" @click.self="emit('close')">
    <div class="lang-select view-content">
      <div class="item" @click="handleSelectLanguage(value)" v-for="value in Object.values(I18N_TYPE)">{{
        getI18nLanguageSelectText(value) }}</div>
    </div>
  </div>
</template>

<script setup>
import { I18N_TYPE, getI18nLanguageSelectText } from '@/utils/i18n'

const handleSelectLanguage = (value) => {
  localStorage.setItem("i18n", value)
  location.reload();
}

const emit = defineEmits(["close"])

</script>
  
<style lang="less" scoped>
@import url("../list.less");

.view-container {
  z-index: 2000;
  opacity: 0;
  visibility: hidden;
  transition: all .2s ease-in-out;

  &.active {
    opacity: 1;
    visibility: visible;
    background-color: #00000060;
  }
}

.view-content {
  inset: 5rem 10rem !important;
  overflow: hidden;

  .item {
    width: 100% !important;
    height: 40px;
    line-height: 40px;
    font-size: 1.5rem;
  }
}

.lang-select {
  top: 2rem;
  border-top: 4px solid #726c69;
}
</style>
  