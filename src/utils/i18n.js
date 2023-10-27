
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
    "show id": "show id",
    "show quality": "show quality",
    "list style": "list style",
    "show tags": "show tags",
    "$version": $VERSION_TEXT,
    "$items-idea": "Click left to spawn,click right to give",
    "$pills-idea": "Click left or right to give",
    "$search-idea": "type some word to begin search"
  },
  [I18N_TYPE.JAPANESE]: {
    "Isaac's Box": "イサクの箱",
    "Collectibles": "コレクタブル",
    "Trinkets": "トリンケット",
    "Cards/Runes": "カード ルーン",
    "Pills": "錠剤",
    "Language": "言語",
    "Search": "検索",
    "show id": "IDを表示",
    "show quality": "品質を表示",
    "list style": "リストスタイル",
    "show tags": "タグを表示",
    "$version": $VERSION_TEXT,
    "$items-idea": "左クリックで生成、右クリックで贈る",
    "$pills-idea": "左または右クリックで贈る",
    "$search-idea": "検索を開始するには単語を入力"
  },
  [I18N_TYPE.KOREAN]: {
    "Isaac's Box": "이삭의 상자",
    "Collectibles": "수집품",
    "Trinkets": "장신구",
    "Cards/Runes": "카드 룬",
    "Pills": "알약",
    "Language": "언어",
    "Search": "검색",
    "show id": "ID 표시",
    "show quality": "품질 표시",
    "list style": "목록 스타일",
    "show tags": "태그 표시",
    "$version": $VERSION_TEXT,
    "$items-idea": "좌클릭으로 스폰, 우클릭으로 주기",
    "$pills-idea": "좌클릭 또는 우클릭으로 주기",
    "$search-idea": "검색을 시작하려면 단어를 입력"
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
    "$version": $VERSION_TEXT,
    "$items-idea": "点击鼠标左键生成道具 , 点击鼠标右键给予道具",
    "$pills-idea": "点击鼠标左键或者右键给予胶囊",
    "$search-idea": "输入一些字母/数字即可开始搜索"
  },
  [I18N_TYPE.RUSSIAN]: {
    "Isaac's Box": "Коробка Исаака",
    "Collectibles": "Коллекционируемые",
    "Trinkets": "Безделушки",
    "Cards/Runes": "Карты Руны",
    "Pills": "Таблетки",
    "Language": "Язык",
    "Search": "Поиск",
    "show id": "Показать ID",
    "show quality": "Показать качество",
    "list style": "Стиль списка",
    "show tags": "Показать метки",
    "$version": $VERSION_TEXT,
    "$items-idea": "Нажмите левой кнопкой мыши, чтобы создать, нажмите правой кнопкой мыши, чтобы дарить",
    "$pills-idea": "Нажмите левой или правой кнопкой мыши, чтобы дарить",
    "$search-idea": "Введите слово для начала поиска"
  },
  [I18N_TYPE.GERMAN]: {
    "Isaac's Box": "Isaacs Kiste",
    "Collectibles": "Sammlerstücke",
    "Trinkets": "Schmuckstücke",
    "Cards/Runes": "Karten Runen",
    "Pills": "Pillen",
    "Language": "Sprache",
    "Search": "Suche",
    "show id": "ID anzeigen",
    "show quality": "Qualität anzeigen",
    "list style": "Listenstil",
    "show tags": "Tags anzeigen",
    "$version": $VERSION_TEXT,
    "$items-idea": "Links klicken, um zu erstellen, rechts klicken, um zu schenken",
    "$pills-idea": "Links oder rechts klicken, um zu schenken",
    "$search-idea": "Geben Sie ein Wort ein, um die Suche zu beginnen"
  },
  [I18N_TYPE.SPANISH]: {
    "Isaac's Box": "Caja de Isaac",
    "Collectibles": "Coleccionables",
    "Trinkets": "Trinkets",
    "Cards/Runes": "Cartas Runas",
    "Pills": "Píldoras",
    "Language": "Idioma",
    "Search": "Buscar",
    "show id": "Mostrar ID",
    "show quality": "Mostrar calidad",
    "list style": "Estilo de lista",
    "show tags": "Mostrar etiquetas",
    "$version": $VERSION_TEXT,
    "$items-idea": "Haga clic izquierdo para generar, haga clic derecho para regalar",
    "$pills-idea": "Haga clic izquierdo o derecho para regalar",
    "$search-idea": "Escriba una palabra para comenzar la búsqueda"
  },
  [I18N_TYPE.FRENCH]: {
    "Isaac's Box": "Boîte d'Isaac",
    "Collectibles": "Objets de collection",
    "Trinkets": "Bijoux",
    "Cards/Runes": "Cartes Runes",
    "Pills": "Pilules",
    "Language": "Langue",
    "Search": "Rechercher",
    "show id": "Afficher l'ID",
    "show quality": "Afficher la qualité",
    "list style": "Style de liste",
    "show tags": "Afficher les étiquettes",
    "$version": $VERSION_TEXT,
    "$items-idea": "Cliquez à gauche pour créer, cliquez à droite pour offrir",
    "$pills-idea": "Cliquez à gauche ou à droite pour offrir",
    "$search-idea": "Tapez un mot pour commencer la recherche"
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
