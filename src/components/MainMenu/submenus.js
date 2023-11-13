import CollectiblesList from '@/components/CollectiblesList/CollectiblesList.vue';
import MyCollectiblesList from '@/components/MyCollectiblesList/MyCollectiblesList.vue';
import TrinketsList from '@/components/TrinketsList/TrinketsList.vue';
import CardsList from '@/components/CardsList/CardsList.vue'
import StageList from '@/components/StageList/StageList.vue'
import PillEffectsList from '@/components/PillEffectsList/PillEffectsList.vue'
// import MonstersList from '@/components/MonstersList/index.vue'
import OthersList from '@/components/OthersList/OthersList.vue'
import DebugList from '@/components/DebugList/DebugList.vue'

import { useI18n } from 'vue-i18n'
import { ref } from 'vue'


const getViewStyle = (submenu) => {
  const { gridOffset } = submenu;
  return {
    transform: `translate(${100 * gridOffset.x}%,${100 * gridOffset.y}%)`
  }
}

const submenusMetaData = [
  {
    name: ("MyCollectibles"),
    component: MyCollectiblesList,
    gridOffset: {
      x: 0,
      y: 1
    },
    active: ref(false),
  },
  {
    name: ("Collectibles"),
    component: CollectiblesList,
    gridOffset: {
      x: -1,
      y: 0
    },
    active: ref(false),
  },
  {
    name: ("Trinkets"),
    component: TrinketsList,
    gridOffset: {
      x: 1,
      y: 0
    },
    active: ref(false),
  },
  {
    name: "Cards",
    component: CardsList,
    gridOffset: {
      x: -1,
      y: 1
    },
    active: ref(false),
  },
  {
    name: "PillEffects",
    component: PillEffectsList,
    gridOffset: {
      x: 1,
      y: 1
    },
    active: ref(false),
  },
  {
    name: "Stage",
    component: StageList,
    gridOffset: {
      x: -1,
      y: -1
    },
    active: ref(false),
  },
  {
    name: "Debug",
    component: DebugList,
    gridOffset: {
      x: 1,
      y: -1
    },
    active: ref(false),
  },
  {
    name: "Others",
    component: OthersList,
    gridOffset: {
      x: 2,
      y: 2
    },
    active: ref(false),
  },
  //   {
  //     name: "Monsters",
  //     component: MonstersList,
  //     gridOffset: {
  //       x: 0,
  //       y: 2
  //     },
  //     active: ref(false),
  //   }
]


export const getSubmenus = () => {
  const { t } = useI18n()
  return submenusMetaData.map((submenu) => {
    return {
      ...submenu,
      name: t(submenu.name),
      style: getViewStyle(submenu)
    }
  })
}