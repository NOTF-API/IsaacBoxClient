<template>
  <div class="view-container">
    <div class="lang-select view-content no-scrollbar">
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

</script>
  
<style lang="less" scoped>
@import url("../list.less");

.view-content .item {
  width: 100% !important;
  height: 48px;
  line-height: 48px;
  font-size: 2rem;
  font-weight: bold;
}

.lang-select {
  top: 2rem;
  border-top: 4px solid #726c69;
}
</style>
  