
import { createI18n } from 'vue-i18n'

const I18N_TYPE_KEY = "i18n"

export const getI18nState = () => {
  return localStorage.getItem(I18N_TYPE_KEY) !== null
}

export const getI18nType = () => {
  let t = localStorage.getItem(I18N_TYPE_KEY)
  if (!t) {
    t = I18N_TYPE.CHINESE
    localStorage.setItem(I18N_TYPE_KEY, t)
  }
  return t;
}

export const I18N_TYPE = Object.freeze({
  // ENGLISH: "en",
  CHINESE: "zh",
  //   JAPANESE: "ja",
  //   KOREAN: "ko",
  //   RUSSIAN: "ru",
  //   GERMAN: "de",
  //   SPANISH: "es",
  //   FRENCH: "fr",
})

export const getIndexByI18nType = (i18nType) => {
  switch (i18nType) {
    // case I18N_TYPE.ENGLISH: return 0
    case I18N_TYPE.CHINESE: return 3
    // case I18N_TYPE.JAPANESE: return 1
    // case I18N_TYPE.KOREAN: return 2
    // case I18N_TYPE.RUSSIAN: return 4
    // case I18N_TYPE.GERMAN: return 5
    // case I18N_TYPE.SPANISH: return 6
    // case I18N_TYPE.FRENCH: return 7
    default: return 0
  }
}

const messages = {
  // [I18N_TYPE.ENGLISH]: {
  //   "Isaac's Box": "Isaac's Box",
  //   "Collectibles": "Collectibles",
  //   "MyCollectibles": "My Collectibles",
  //   "Trinkets": "Trinkets",
  //   "Cards": "Cards",
  //   "PillEffects": "PillEffects",
  //   "Language": "Language",
  //   "Search": "Search",
  //   "Debug": "Debug",
  //   "Stage": "Stage",
  //   "Others": "Others",
  //   "show id": "show id",
  //   "show quality": "show quality",
  //   "show count": "show count",
  //   "list style": "list style",
  //   "$version": $VERSION_TEXT,
  //   "$idea-others": "Click left to spawn,click right to go back",
  //   "$idea-items": "Click left to spawn,click Ctrl+left to give,click right to go back",
  //   "$idea-pills": "Click left to give,click right to go back,click right to go back",
  //   "$idea-stage": "Click left to jump to target stage,click right to go back",
  //   "$idea-debug": "Click left to open,click again to close,click right to go back",
  //   "$idea-remove": "Click left to remove one,click Ctrl+left to remove all,click right to go back",
  //   "$debug1": "Entity Positions",
  //   "$debug2": "Grid",
  //   "$debug3": "Infinite HP",
  //   "$debug4": "High Damage",
  //   "$debug5": "Show Room Info",
  //   "$debug6": "Show Hitspheres",
  //   "$debug7": "Show Damage Values",
  //   "$debug8": "Infinite Item Charges",
  //   "$debug9": "High Luck",
  //   "$debug10": "Quick Kill",
  //   "$debug11": "Grid Info",
  //   "$debug12": "Player Item Info",
  //   "$debug13": "Show Grid Collision Points",
  //   "$debug14": "Show Lua Memory Usage",
  // },
  //   [I18N_TYPE.JAPANESE]: {
  //     "Isaac's Box": "アイザックの箱",
  //     "Collectibles": "コレクタブル",
  //     "MyCollectibles": "私の",
  //     "Trinkets": "装飾品",
  //     "Cards": "カード",
  //     "PillEffects": "錠剤",
  //     "Language": "言語",
  //     "Search": "検索",
  //     "Debug": "デバッグ",
  //     "Stage": "ステージ",
  //     "Others": "その他",
  //     "show id": "IDを表示",
  //     "show quality": "品質を表示",
  //     "show count": "表示数",
  //     "list style": "リスト形式",
  //     "$version": $VERSION_TEXT,
  //     "$idea-others": "マウスをクリックしてエンティティを生成",
  //     "$idea-items": "左クリックで生成、左クリックで+Ctrl与える",
  //     "$idea-pills": "クリックして与える",
  //     "$idea-search": "検索を開始するには単語を入力",
  //     "$idea-stage": "目標ステージにジャンプ",
  //     "$idea-debug": "開くためにクリック、再度クリックして閉じる",
  //     "$idea-remove": "左クリックして1つを削除、右クリックしてすべてを削除",
  //     "$debug1": "エンティティ位置",
  //     "$debug2": "グリッド",
  //     "$debug3": "無限HP",
  //     "$debug4": "高ダメージ",
  //     "$debug5": "部屋情報を表示",
  //     "$debug6": "ヒットスフィアを表示",
  //     "$debug7": "ダメージ値を表示",
  //     "$debug8": "アイテム充電の無限化",
  //     "$debug9": "高い幸運",
  //     "$debug10": "クイックキル",
  //     "$debug11": "グリッド情報",
  //     "$debug12": "プレイヤーアイテム情報",
  //     "$debug13": "グリッド衝突ポイントを表示",
  //     "$debug14": "Luaメモリ使用状況を表示",
  //   },
  //   [I18N_TYPE.KOREAN]: {
  //     "Isaac's Box": "이삭의 상자",
  //     "Collectibles": "수집품",
  //     "MyCollectibles": "나의",
  //     "Trinkets": "장신구",
  //     "Cards": "카드",
  //     "PillEffects": "알약",
  //     "Language": "언어",
  //     "Search": "검색",
  //     "Debug": "디버그",
  //     "Stage": "스테이지",
  //     "Others": "기타",
  //     "show id": "ID 표시",
  //     "show quality": "품질 표시",
  //     "show count": "수량 보이기",
  //     "list style": "목록 스타일",
  //     "$version": $VERSION_TEXT,
  //     "$idea-others": "마우스를 클릭하여 엔티티 생성",
  //     "$idea-items": "왼쪽 클릭으로 생성, 오른쪽 클릭으로 제공",
  //     "$idea-pills": "클릭하여 제공",
  //     "$idea-search": "검색을 시작하려면 단어 입력",
  //     "$idea-stage": "목표 스테이지로 이동",
  //     "$idea-debug": "열려면 클릭, 다시 클릭하여 닫기",
  //     "$idea-remove": "왼쪽 클릭하여 하나 제거, 오른쪽 클릭하여 모두 제거",
  //     "$debug1": "엔티티 위치",
  //     "$debug2": "그리드",
  //     "$debug3": "무한 HP",
  //     "$debug4": "높은 데미지",
  //     "$debug5": "방 정보 표시",
  //     "$debug6": "히트스피어 표시",
  //     "$debug7": "데미지 값 표시",
  //     "$debug8": "아이템 충전 무한화",
  //     "$debug9": "높은 행운",
  //     "$debug10": "빠른 처치",
  //     "$debug11": "그리드 정보",
  //     "$debug12": "플레이어 아이템 정보",
  //     "$debug13": "그리드 충돌 지점 표시",
  //     "$debug14": "Lua 메모리 사용량 표시",
  //   },
  [I18N_TYPE.CHINESE]: {
    "Isaac's Box": "以撒的盒子",
    "Collectibles": "道具",
    "MyCollectibles": "我的道具",
    "Trinkets": "饰品",
    "Cards": "卡牌",
    "PillEffects": "胶囊效果",
    "Language": "选择语言",
    "Search": "搜索",
    "Debug": "Debug",
    "Stage": "楼层",
    "Others": "其它",
    "show id": "显示ID",
    "show quality": "显示品级",
    "show count": "显示数量",
    "list style": "以列表显示",
    "$idea-others": "点击鼠标左键生成实体,点击右键返回上一级菜单",
    "$idea-items": "点击鼠标左键生成道具,点击Ctrl+鼠标左键给予道具,点击右键返回上一级菜单",
    "$idea-pills": "点击鼠标左键给予胶囊,点击右键返回上一级菜单",
    "$idea-stage": "点击鼠标左键即可进入目标楼层,点击右键返回上一级菜单",
    "$idea-debug": "点击左键后开启,再次点击关闭,点击右键返回上一级菜单",
    "$idea-remove": "点击鼠标左键移除一个,点击Ctrl+鼠标左键移除全部,点击右键返回上一级菜单",
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
  //   [I18N_TYPE.RUSSIAN]: {
  //     "Isaac's Box": "Ящик Исаака",
  //     "Collectibles": "Коллекционные предметы",
  //     "MyCollectibles": "Мои",
  //     "Trinkets": "Брелоки",
  //     "Cards": "Карты",
  //     "PillEffects": "Таблетки",
  //     "Language": "Язык",
  //     "Search": "Поиск",
  //     "Debug": "Отладка",
  //     "Stage": "Этаж",
  //     "Others": "Другие",
  //     "show id": "Показать ID",
  //     "show quality": "Показать качество",
  //     "show count": "показать количество",
  //     "list style": "Список стилей",
  //     "$version": $VERSION_TEXT,
  //     "$idea-others": "Нажмите мышь, чтобы сгенерировать сущность",
  //     "$idea-items": "Нажмите левой кнопкой мыши, чтобы создать, нажмите правой кнопкой мыши, чтобы выдать",
  //     "$idea-pills": "Нажмите, чтобы выдать",
  //     "$idea-search": "Введите слово для начала поиска",
  //     "$idea-stage": "Нажмите, чтобы перейти на целевой этаж",
  //     "$idea-debug": "Нажмите, чтобы открыть, нажмите еще раз, чтобы закрыть",
  //     "$idea-remove": "нажмите левую кнопку мыши, чтобы удалить один, нажмите правую кнопку мыши, чтобы удалить все",
  //     "$debug1": "Позиции объектов",
  //     "$debug2": "Сетка",
  //     "$debug3": "Бесконечное здоровье",
  //     "$debug4": "Высокий урон",
  //     "$debug5": "Показать информацию о комнате",
  //     "$debug6": "Показать области поражения",
  //     "$debug7": "Показать значения урона",
  //     "$debug8": "Бесконечное зарядка предметов",
  //     "$debug9": "Высокая удача",
  //     "$debug10": "Быстрое уничтожение",
  //     "$debug11": "Информация о сетке",
  //     "$debug12": "Информация об объектах игрока",
  //     "$debug13": "Показать точки столкновения сетки",
  //     "$debug14": "Показать использование памяти Lua",
  //   },
  //   [I18N_TYPE.GERMAN]: {
  //     "Isaac's Box": "Isaacs Schachtel",
  //     "Collectibles": "Sammlerstücke",
  //     "MyCollectibles": "Meine",
  //     "Trinkets": "Schmuckstücke",
  //     "Cards": "Karten",
  //     "PillEffects": "Pillen",
  //     "Language": "Sprache",
  //     "Search": "Suche",
  //     "Debug": "Debuggen",
  //     "Stage": "Etage",
  //     "Others": "Andere",
  //     "show id": "ID anzeigen",
  //     "show quality": "Qualität anzeigen",
  //     "show count": "Anzahl anzeigen",
  //     "list style": "Liste anzeigen",
  //     "$version": $VERSION_TEXT,
  //     "$idea-others": "Klicken Sie mit der Maus, um eine Entität zu generieren",
  //     "$idea-items": "Linksklick zum Erzeugen, Rechtsklick zum Geben",
  //     "$idea-pills": "Klicken zum Geben",
  //     "$idea-search": "Geben Sie ein Wort ein, um die Suche zu starten",
  //     "$idea-stage": "Klicken zum Wechseln der Etage",
  //     "$idea-debug": "Klicken zum Öffnen, erneut klicken zum Schließen",
  //     "$idea-remove": "Klicken Sie links, um einen zu entfernen, klicken Sie mit der rechten Maustaste, um alle zu entfernen",
  //     "$debug1": "Objektpositionen",
  //     "$debug2": "Raster",
  //     "$debug3": "Unendliche HP",
  //     "$debug4": "Hoher Schaden",
  //     "$debug5": "Rauminformationen anzeigen",
  //     "$debug6": "Treffersphären anzeigen",
  //     "$debug7": "Schadenswerte anzeigen",
  //     "$debug8": "Unendliche Gegenstandsladungen",
  //     "$debug9": "Hohe Glückszahl",
  //     "$debug10": "Schnelles Töten",
  //     "$debug11": "Rasterinformationen",
  //     "$debug12": "Spieler-Item-Informationen",
  //     "$debug13": "Kollisionspunkte des Rasters anzeigen",
  //     "$debug14": "Lua-Speichernutzung anzeigen",
  //   },
  //   [I18N_TYPE.SPANISH]: {
  //     "Isaac's Box": "Caja de Isaac",
  //     "Collectibles": "Coleccionables",
  //     "MyCollectibles": "Mis",
  //     "Trinkets": "Amuletos",
  //     "Cards": "Cartas",
  //     "PillEffects": "Pastillas",
  //     "Language": "Idioma",
  //     "Search": "Buscar",
  //     "Debug": "Depuración",
  //     "Stage": "Nivel",
  //     "Others": "Otros",
  //     "show id": "Mostrar ID",
  //     "show quality": "Mostrar calidad",
  //     "show count": "mostrar cantidad",
  //     "list style": "Estilo de lista",
  //     "$version": $VERSION_TEXT,
  //     "$idea-others": "Haz clic con el ratón para generar una entidad",
  //     "$idea-items": "Clic izquierdo para generar, clic derecho para dar",
  //     "$idea-pills": "Clic para dar",
  //     "$idea-search": "Escriba una palabra para comenzar la búsqueda",
  //     "$idea-stage": "Clic para saltar al nivel objetivo",
  //     "$idea-debug": "Clic para abrir, clic de nuevo para cerrar",
  //     "$idea-remove": "haga clic izquierdo para eliminar uno, haga clic derecho para eliminar todos",
  //     "$debug1": "Posiciones de entidades",
  //     "$debug2": "Cuadrícula",
  //     "$debug3": "Vida infinita",
  //     "$debug4": "Daño alto",
  //     "$debug5": "Mostrar información de la habitación",
  //     "$debug6": "Mostrar esferas de impacto",
  //     "$debug7": "Mostrar valores de daño",
  //     "$debug8": "Cargas infinitas de objetos",
  //     "$debug9": "Suerte alta",
  //     "$debug10": "Muerte rápida",
  //     "$debug11": "Información de la cuadrícula",
  //     "$debug12": "Información de objetos del jugador",
  //     "$debug13": "Mostrar puntos de colisión de la cuadrícula",
  //     "$debug14": "Mostrar uso de memoria Lua",
  //   },
  //   [I18N_TYPE.FRENCH]: {
  //     "Isaac's Box": "Boîte d'Isaac",
  //     "Collectibles": "Objets de collection",
  //     "MyCollectibles": "Mes",
  //     "Trinkets": "Bijoux",
  //     "Cards": "Cartes",
  //     "PillEffects": "Pilules",
  //     "Language": "Langue",
  //     "Search": "Rechercher",
  //     "Debug": "Débogage",
  //     "Stage": "Étage",
  //     "Others": "Autres",
  //     "show id": "Afficher l'ID",
  //     "show quality": "Afficher la qualité",
  //     "show count": "afficher le nombre",
  //     "list style": "Afficher sous forme de liste",
  //     "$version": $VERSION_TEXT,
  //     "$idea-others": "Cliquez avec la souris pour générer une entité",
  //     "$idea-items": "Cliquez à gauche pour générer, cliquez à droite pour donner",
  //     "$idea-pills": "Cliquez pour donner",
  //     "$idea-search": "Tapez un mot pour commencer la recherche",
  //     "$idea-stage": "Cliquez pour accéder à l'étage cible",
  //     "$idea-debug": "Cliquez pour ouvrir, cliquez à nouveau pour fermer",
  //     "$idea-remove": "cliquez gauche pour supprimer un, cliquez droit pour supprimer tous",
  //     "$debug1": "Positions des entités",
  //     "$debug2": "Grille",
  //     "$debug3": "Points de vie infinis",
  //     "$debug4": "Dommages élevés",
  //     "$debug5": "Afficher les informations de la pièce",
  //     "$debug6": "Afficher les sphères de collision",
  //     "$debug7": "Afficher les valeurs de dommages",
  //     "$debug8": "Recharges d'objets infinies",
  //     "$debug9": "Chance élevée",
  //     "$debug10": "Tuer rapidement",
  //     "$debug11": "Informations sur la grille",
  //     "$debug12": "Informations sur les objets du joueur",
  //     "$debug13": "Afficher les points de collision de la grille",
  //     "$debug14": "Afficher l'utilisation de la mémoire Lua",
  //   }
}


export const initI18n = () => {
  console.log(`i18n type: ${getI18nType()}`);
  document.body.classList.add(`i18n-${getI18nType()}`);
  window._i18n = getI18nType();
  window._i18n_index = getIndexByI18nType(window._i18n)
  return createI18n({
    legacy: false,
    locale: window._i18n,
    messages
  })
}

export const getI18nLanguageSelectText = (i18nType) => {
  switch (i18nType) {
    // case I18N_TYPE.ENGLISH: return "English";
    // case I18N_TYPE.JAPANESE: return "日本語";
    // case I18N_TYPE.KOREAN: return "한국어";
    case I18N_TYPE.CHINESE: return "简体中文";
    // case I18N_TYPE.RUSSIAN: return "Русский язык";
    // case I18N_TYPE.GERMAN: return "Deutsch";
    // case I18N_TYPE.SPANISH: return "Español";
    // case I18N_TYPE.FRENCH: return "Français";
    default: return ""
  }
}
