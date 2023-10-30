
import { createI18n } from 'vue-i18n'

export const getI18nType = () => {
  return localStorage.getItem("i18n") || "0"
}

export const I18N_TYPE = Object.freeze({
  ENGLISH: 0,
  JAPANESE: 1,
  KOREAN: 2,
  CHINESE: 3,
  RUSSIAN: 4,
  GERMAN: 5,
  SPANISH: 6,
  FRENCH: 7
})

const $VERSION_TEXT = "V0.1.1"

const messages = {
  [I18N_TYPE.ENGLISH]: {
    "Isaac's Box": "Isaac's Box",
    "Collectibles": "Collectibles",
    "Trinkets": "Trinkets",
    "Cards/Runes": "Cards Runes",
    "Pills": "Pills",
    "Language": "Language",
    "Search": "Search",
    "Debug": "Debug",
    "show id": "show id",
    "show quality": "show quality",
    "list style": "list style",
    "show tags": "show tags",
    "$version": $VERSION_TEXT,
    "$idea-items": "Click left to spawn,click right to give",
    "$idea-pills": "Click to give",
    "$idea-search": "type some word to begin search",
    "$idea-stage": "click to jump to target stage",
    "$debug1": "Entity Positions",
    "$debug2": "Grid",
    "$debug3": "Infinite HP",
    "$debug4": "High Damage",
    "$debug5": "Show Room Info",
    "$debug6": "Show Hitspheres",
    "$debug7": "Show Damage Values",
    "$debug8": "Infinite Item Charges",
    "$debug9": "High Luck",
    "$debug10": "Quick Kill",
    "$debug11": "Grid Info",
    "$debug12": "Player Item Info",
    "$debug13": "Show Grid Collision Points",
    "$debug14": "Show Lua Memory Usage",
    "Stage": "Stage",
  },
  [I18N_TYPE.JAPANESE]: {
    "Isaac's Box": "イサクの箱",
    "Collectibles": "コレクタブル",
    "Trinkets": "トリンケット",
    "Cards/Runes": "カード ルーン",
    "Pills": "錠剤",
    "Language": "言語",
    "Search": "検索",
    "Debug": "Debug",
    "show id": "IDを表示",
    "show quality": "品質を表示",
    "list style": "リストスタイル",
    "show tags": "タグを表示",
    "$version": $VERSION_TEXT,
    "$idea-items": "左クリックで生成、右クリックで贈る",
    "$idea-pills": "左または右クリックで贈る",
    "$idea-search": "検索を開始するには単語を入力",
    "$debug1": "",
    "$debug2": "",
    "$debug3": "",
    "$debug4": "",
    "$debug5": "",
    "$debug6": "",
    "$debug7": "",
    "$debug8": "",
    "$debug9": "",
    "$debug10": "",
    "$debug11": "",
    "$debug12": "",
    "$debug13": "",
    "$debug14": "",
  },
  [I18N_TYPE.KOREAN]: {
    "Isaac's Box": "이삭의 상자",
    "Collectibles": "수집품",
    "Trinkets": "장신구",
    "Cards/Runes": "카드 룬",
    "Pills": "알약",
    "Language": "언어",
    "Search": "검색",
    "Debug": "Debug",
    "show id": "ID 표시",
    "show quality": "품질 표시",
    "list style": "목록 스타일",
    "show tags": "태그 표시",
    "$version": $VERSION_TEXT,
    "$idea-items": "좌클릭으로 스폰, 우클릭으로 주기",
    "$idea-pills": "좌클릭 또는 우클릭으로 주기",
    "$idea-search": "검색을 시작하려면 단어를 입력",
    "$debug1": "",
    "$debug2": "",
    "$debug3": "",
    "$debug4": "",
    "$debug5": "",
    "$debug6": "",
    "$debug7": "",
    "$debug8": "",
    "$debug9": "",
    "$debug10": "",
    "$debug11": "",
    "$debug12": "",
    "$debug13": "",
    "$debug14": "",
  },
  [I18N_TYPE.CHINESE]: {
    "Isaac's Box": "以撒的盒子",
    "Collectibles": "道具",
    "Trinkets": "饰品",
    "Cards/Runes": "卡牌与符文",
    "Pills": "胶囊",
    "Language": "选择语言",
    "Search": "搜索",
    "Debug": "Debug",
    "show id": "显示ID",
    "show quality": "显示品级",
    "list style": "以列表显示",
    "show tags": "显示标签",
    "$version": $VERSION_TEXT,
    "$idea-items": "点击鼠标左键生成道具 , 点击鼠标右键给予道具",
    "$idea-pills": "点击鼠标左键或者右键给予胶囊",
    "$idea-search": "输入一些字母/数字即可开始搜索",
    "$idea-stage": "点击鼠标即可进入目标楼层",
    "Stage": "楼层",
    "$debug1": "实体位置",
    "$debug2": "单元格",
    "$debug3": "无限血量",
    "$debug4": "高伤害",
    "$debug5": "显示房间信息",
    "$debug6": "显示碰撞体积",
    "$debug7": "显示伤害",
    "$debug8": "无限充能",
    "$debug9": "高幸运",
    "$debug10": "快速消灭",
    "$debug11": "单元格位置",
    "$debug12": "角色道具信息",
    "$debug13": "显示单元格碰撞点",
    "$debug14": "显示Lua内存使用情况",
  },
  [I18N_TYPE.RUSSIAN]: {
    "Isaac's Box": "Коробка Исаака",
    "Collectibles": "Коллекционируемые",
    "Trinkets": "Безделушки",
    "Cards/Runes": "Карты Руны",
    "Pills": "Таблетки",
    "Language": "Язык",
    "Search": "Поиск",
    "Debug": "Debug",
    "show id": "Показать ID",
    "show quality": "Показать качество",
    "list style": "Стиль списка",
    "show tags": "Показать метки",
    "$version": $VERSION_TEXT,
    "$idea-items": "Нажмите левой кнопкой мыши, чтобы создать, нажмите правой кнопкой мыши, чтобы дарить",
    "$idea-pills": "Нажмите левой или правой кнопкой мыши, чтобы дарить",
    "$idea-search": "Введите слово для начала поиска",
    "$debug1": "",
    "$debug2": "",
    "$debug3": "",
    "$debug4": "",
    "$debug5": "",
    "$debug6": "",
    "$debug7": "",
    "$debug8": "",
    "$debug9": "",
    "$debug10": "",
    "$debug11": "",
    "$debug12": "",
    "$debug13": "",
    "$debug14": "",
  },
  [I18N_TYPE.GERMAN]: {
    "Isaac's Box": "Isaacs Kiste",
    "Collectibles": "Sammlerstücke",
    "Trinkets": "Schmuckstücke",
    "Cards/Runes": "Karten Runen",
    "Pills": "Pillen",
    "Language": "Sprache",
    "Search": "Suche",
    "Debug": "Debug",
    "show id": "ID anzeigen",
    "show quality": "Qualität anzeigen",
    "list style": "Listenstil",
    "show tags": "Tags anzeigen",
    "$version": $VERSION_TEXT,
    "$idea-items": "Links klicken, um zu erstellen, rechts klicken, um zu schenken",
    "$idea-pills": "Links oder rechts klicken, um zu schenken",
    "$idea-search": "Geben Sie ein Wort ein, um die Suche zu beginnen",
    "$debug1": "",
    "$debug2": "",
    "$debug3": "",
    "$debug4": "",
    "$debug5": "",
    "$debug6": "",
    "$debug7": "",
    "$debug8": "",
    "$debug9": "",
    "$debug10": "",
    "$debug11": "",
    "$debug12": "",
    "$debug13": "",
    "$debug14": "",
  },
  [I18N_TYPE.SPANISH]: {
    "Isaac's Box": "Caja de Isaac",
    "Collectibles": "Coleccionables",
    "Trinkets": "Trinkets",
    "Cards/Runes": "Cartas Runas",
    "Pills": "Píldoras",
    "Language": "Idioma",
    "Search": "Buscar",
    "Debug": "Debug",
    "show id": "Mostrar ID",
    "show quality": "Mostrar calidad",
    "list style": "Estilo de lista",
    "show tags": "Mostrar etiquetas",
    "$version": $VERSION_TEXT,
    "$idea-items": "Haga clic izquierdo para generar, haga clic derecho para regalar",
    "$idea-pills": "Haga clic izquierdo o derecho para regalar",
    "$idea-search": "Escriba una palabra para comenzar la búsqueda",
    "$debug1": "",
    "$debug2": "",
    "$debug3": "",
    "$debug4": "",
    "$debug5": "",
    "$debug6": "",
    "$debug7": "",
    "$debug8": "",
    "$debug9": "",
    "$debug10": "",
    "$debug11": "",
    "$debug12": "",
    "$debug13": "",
    "$debug14": "",
  },
  [I18N_TYPE.FRENCH]: {
    "Isaac's Box": "Boîte d'Isaac",
    "Collectibles": "Collections",
    "Trinkets": "Bijoux",
    "Cards/Runes": "Cartes Runes",
    "Pills": "Pilules",
    "Language": "Langue",
    "Search": "Rechercher",
    "Debug": "Debug",
    "show id": "Afficher l'ID",
    "show quality": "Afficher la qualité",
    "list style": "Style de liste",
    "show tags": "Afficher les étiquettes",
    "$version": $VERSION_TEXT,
    "$idea-items": "Cliquez à gauche pour créer, cliquez à droite pour offrir",
    "$idea-pills": "Cliquez à gauche ou à droite pour offrir",
    "$idea-search": "Tapez un mot pour commencer la recherche",
    "$debug1": "",
    "$debug2": "",
    "$debug3": "",
    "$debug4": "",
    "$debug5": "",
    "$debug6": "",
    "$debug7": "",
    "$debug8": "",
    "$debug9": "",
    "$debug10": "",
    "$debug11": "",
    "$debug12": "",
    "$debug13": "",
    "$debug14": "",
  }
}
export const i18n = createI18n({
  legacy: false,
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
