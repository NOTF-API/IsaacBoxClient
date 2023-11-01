import { defineStore } from 'pinia'

export const useItemsStore = defineStore('items', {
  state: () => {
    return {
      collectibles: [],
      trinkets: [],
      pocketItems: [],
    }
  },
  actions: {

  },
})