import CollectiblesList from "@/components/CollectiblesList/index.vue";
import TrinketsList from "@/components/TrinketsList/index.vue";
import CardsList from "@/components/CardsList/index.vue";
import OthersList from "@/components/OthersList/index.vue";
import PillsList from "@/components/PillsList/index.vue";
import MonstersList from "@/components/MonstersList/index.vue";

import { ref } from "vue";

const styleCache = new Map();

export const getViewStyle = (submenu) => {
  const { layout } = submenu;

  let style = styleCache.get(layout);

  if (!style) {
    style = {};
    styleCache.set(layout, style);
  }
  style.transform = `translate(${100 * layout.x}%,${100 * layout.y}%)`;
  return style;
};

// export const getViewStyle = (submenu) => {
//   const { layout } = submenu;
//   return {
//     transform: `translate(${100 * layout.x}%,${100 * layout.y}%)`,
//   };
// };

export const submenus = [
  {
    name: "Collectibles",
    component: CollectiblesList,
    layout: {
      x: -1,
      y: 0,
    },
    active: ref(false),
  },
  {
    name: "Trinkets",
    component: TrinketsList,
    layout: {
      x: 1,
      y: 0,
    },
    active: ref(false),
  },
  {
    name: "Cards/Runes",
    component: CardsList,
    layout: {
      x: -1,
      y: 1,
    },
    active: ref(false),
  },
  {
    name: "Pills",
    component: PillsList,
    layout: {
      x: 1,
      y: 1,
    },
    active: ref(false),
  },
  {
    name: "Others",
    component: OthersList,
    layout: {
      x: 0,
      y: 1,
    },
    active: ref(false),
  },
  {
    name: "Monsters",
    component: MonstersList,
    layout: {
      x: 0,
      y: 2,
    },
    active: ref(false),
  },
];
