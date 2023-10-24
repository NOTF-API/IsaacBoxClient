import { defineStore } from 'pinia'

export const useItemsStore = defineStore('items', {
  state: () => {
    return {
      items: [],
      itemsMetaData: [],
      pocketItems: [],
      stringTable: {}
    }
  },
  actions: {
    async init() {
    //   this.initItems()
    //   this.initItemsMetaData();
    //   this.initPocketItems();
    },
    async initItems() {
      const header = await fetch("./assets/items.xml")
      const data = await header.text()
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, "application/xml");
      const itemsXML = doc.querySelector("items").children;
      console.dir(doc.children[0].children);
      [...itemsXML].forEach((xml) => {
        // console.log(xml.getAttributeNames())
        const item = {
          type: xml.localName,
          id: xml.getAttribute("id"),
          cache: xml.getAttribute("cache"),
          description: xml.getAttribute("description"),
          gfx: xml.getAttribute("gfx"),
          name: xml.getAttribute("name"),
        }
        this.items.push(item);
      })
    },
    async initItemsMetaData() {
      const header = await fetch("./assets/items_metadata.xml")
      const data = await header.text()
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, "application/xml");
      const itemsXML = doc.querySelector("items").children;
      [...itemsXML].forEach((xml) => {
        const item = {
          id: xml.getAttribute("id"),
          type:xml.localName,
          tags: xml.getAttribute("tags"),
          quality: xml.getAttribute("quality"),
        }
        this.itemsMetaData.push(item);
      })
    },
    async initPocketItems() {
      const header = await fetch("./assets/pocketitems.xml")
      const data = await header.text()
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, "application/xml");
      const itemsXML = doc.querySelector("pocketitems").children;
      [...itemsXML].forEach((xml) => {
        const item = {
          type: xml.localName,
          originType: xml.getAttribute("type"),
          id: xml.getAttribute("id"),
          description: xml.getAttribute("description"),
          name: xml.getAttribute("name"),
        }
        this.pocketItems.push(item);
      })
    },
    async initStringTable() {
      const header = await fetch("./assets/tablestring.sta")
      const data = await header.text()
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, "application/xml");
      const itemsXML = doc.querySelectorAll("category");
      [...itemsXML].forEach((xml) => {
        const keysItems = [...xml.querySelectorAll("key")];
        keysItems.forEach((key) => {
          //   const  
        })
        this.stringTable[xml.getAttribute("name")] = {

        }
        this.pocketItems.push(item);
      })
    },
  },
})