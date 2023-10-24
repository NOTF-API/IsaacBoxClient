import CollectiblesList from '@/components/CollectiblesList/index.vue';
import TrinketsList from '@/components/TrinketsList/index.vue';
import CardsList from '@/components/CardsList/index.vue'
import OthersList from '@/components/OthersList/index.vue'
import PillsList from '@/components/PillsList/index.vue'
import MonstersList from '@/components/MonstersList/index.vue'
import LanguageSelect from '@/components/LanguageSelect/index.vue'
import { getUITranslatedText } from '@/utils/i18n'

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
    name: "Language",
    component: LanguageSelect,
    gridOffset: {
      x: 0,
      y: -1
    },
    active: ref(false),
  },
  //   {
  //     name: "Others",
  //     component: OthersList,
  //     gridOffset: {
  //       x: 0,
  //       y: 1
  //     },
  //     active: ref(false),
  //   },
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

export const getSubmenus = ()=>{
  return submenusMetaData.map((submenu) => {
    const { t } = useI18n()
    return {
      ...submenu,
      name: t(submenu.name),
      style: getViewStyle(submenu)
    }
  })
}