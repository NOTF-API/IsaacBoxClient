import CollectiblesList from '@/components/CollectiblesList/index.vue';
import TrinketsList from '@/components/TrinketsList/index.vue';
import CardsList from '@/components/CardsList/index.vue'
import OthersList from '@/components/OthersList/index.vue'
import PillsList from '@/components/PillsList/index.vue'
import MonstersList from '@/components/MonstersList/index.vue'

import { ref } from 'vue'

const getViewStyle = (submenu) => {
  const { gridOffset } = submenu;
  return {
    transform: `translate(${100 * gridOffset.x}%,${100 * gridOffset.y}%)`
  }
}

const submenusMetaData = [
  {
    name: "Collectibles",
    component: CollectiblesList,
    gridOffset: {
      x: -1,
      y: 0
    },
    active: ref(false),
  },
  {
    name: "Trinkets",
    component: TrinketsList,
    gridOffset: {
      x: 1,
      y: 0
    },
    active: ref(false),
  },
  {
    name: "Cards/Runes",
    component: CardsList,
    gridOffset: {
      x: -1,
      y: 1
    },
    active: ref(false),
  },
  {
    name: "Pills",
    component: PillsList,
    gridOffset: {
      x: 1,
      y: 1
    },
    active: ref(false),
  },
  {
    name: "Others",
    component: OthersList,
    gridOffset: {
      x: 0,
      y: 1
    },
    active: ref(false),
  },
  {
    name: "Monsters",
    component: MonstersList,
    gridOffset: {
      x: 0,
      y: 2
    },
    active: ref(false),
  }
]

export const submenus = submenusMetaData.map((submenu) => {
  return {
    ...submenu,
    style:getViewStyle(submenu)
  }
})