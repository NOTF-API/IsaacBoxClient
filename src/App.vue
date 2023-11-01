<template>
  <MainMenu />
</template>

<script setup>
import MainMenu from '@/components/MainMenu/MainMenu.vue';
import { useItemsStore } from "@/store"
const store = useItemsStore();
store.init();
</script>