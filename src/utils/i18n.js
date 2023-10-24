
import { createI18n } from 'vue-i18n'

export const getI18nType = () => {
  return localStorage.getItem("i18n") || "0"
}


export const I18N_TYPE = Object.freeze({
  ENGLISH: 0,
//   JAPANESE: 1,
//   KOREAN: 2,
  CHINESE: 3,
//   RUSSIAN: 4,
//   GERMAN: 5,
//   SPANISH: 6,
//   FRENCH: 7
})



const messages = {
  [I18N_TYPE.ENGLISH]: {
    "Isaac's Box": "Isaac's Box",
    "Collectibles": "Collectibles",
    "Trinkets": "Trinkets",
    "Cards/Runes": "Cards/Runes",
    "Pills": "Pills",
    "Language": "Language",
    "Search": "Search",
    "show id": "show id",
    "show quality": "show quality",
    "list style": "list style",
    "show tags": "show tags",
    "$version": "V0.1.0",
    "type some word to begin search": "type some word to begin search"
  },
  [I18N_TYPE.CHINESE]: {
    "Isaac's Box": "以撒的盒子",
    "Collectibles": "道具",
    "Trinkets": "饰品",
    "Cards/Runes": "卡牌与符文",
    "Pills": "胶囊",
    "Language": "选择语言",
    "Search": "搜索",
    "show id": "显示ID",
    "show quality": "显示品级",
    "list style": "以列表显示",
    "show tags": "显示标签",
    "$version": "V0.1.0",
    "type some word to begin search": "输入一些字母/数字即可开始搜索"
  }
}
export const i18n = createI18n({
  legacy: false,
  // globalInjection: true,
  locale: getI18nType(),
  messages
})



export const getI18nLanguageSelectText = (i18nType) => {
  switch (i18nType) {
    case I18N_TYPE.ENGLISH: return "English";
    case I18N_TYPE.JAPANESE: return "日本語";
    case I18N_TYPE.KOREAN: return "한국어";
    case I18N_TYPE.CHINESE: return "简体中文";
    case I18N_TYPE.RUSSIAN: return "Русский язык";
    case I18N_TYPE.GERMAN: return "Deutsch";
    case I18N_TYPE.SPANISH: return "Español";
    case I18N_TYPE.FRENCH: return "Français";
    default: return ""
  }
}


const i18nData = {
  [I18N_TYPE.ENGLISH]: {
    "Isaac's Box": "Isaac's Box",
    "Collectibles": "Collectibles",
    "Trinkets": "Trinkets",
    "Cards/Runes": "Cards/Runes",
    "Pills": "Pills",
    "Language": "Language",
    "Search": "Search",
    "show id": "show id"
  },
  [I18N_TYPE.CHINESE]: {
    "Isaac's Box": "以撒的盒子",
    "Collectibles": "道具",
    "Trinkets": "饰品",
    "Cards/Runes": "卡牌/符文",
    "Pills": "胶囊",
    "Language": "选择语言",
    "Search": "搜索",
    "show id": "显示ID"
  }
}

export const getUITranslatedText = (name) => {
  return i18nData[localStorage.getItem("i18n") || "0"][name]
}