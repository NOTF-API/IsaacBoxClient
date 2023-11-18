/**
 * 
 * @param {string} src 
 * @returns {Array<Object>} children data
 */
const getXMLDataAndParse = async (src) => {
  const res = await fetch(src)
  const data = await res.text()
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, "application/xml");
  const nodes = doc.children[0].children;
  const visitXMLChildren = (result, nodes) => {
    Array.prototype.forEach.call(nodes, (node, index) => {
      const nodeObj = {};
      node.getAttributeNames().forEach((attr) => {
        nodeObj[attr] = node.getAttribute(attr);
      })
      nodeObj._type = node.localName
      if (node?.children?.length === 0 && node.textContent) {
        nodeObj._value = node.textContent
      }
      result.push(nodeObj);
      if (node?.children?.length === 0) {
        return;
      }
      nodeObj._children = [];
      visitXMLChildren(nodeObj._children, node.children);
    });
    return result;
  }
  const result = [];
  visitXMLChildren(result, nodes)
  return result;
}

const getItemsData = async (itemsMeta, i18nData) => {
  const data = await getXMLDataAndParse("./assets/items.xml")
  const items = {};
  const i18nIndex = window._i18n_index
  data.forEach((item) => {
    let gid;
    if (item._type === "active" || item._type === "familiar" || item._type === "passive") {
      gid = `c${item.id}`
      item._gtype = "c"
      item._gid = gid
      item.gfx = `./assets/gfx/items/collectibles/${item.gfx.toLowerCase()}`
    }
    else if (item._type === "trinket") {
      gid = `t${item.id}`
      item._gtype = "t"
      item._gid = gid
      item.gfx = `./assets/gfx/items/trinkets/${item.gfx.toLowerCase()}`
    } else {
      return;
    }
    const descriptionKey = item.description.substring(1, item.description.length);
    const nameKey = item.name.substring(1, item.name.length);
    item.description = i18nData.Items[descriptionKey][i18nIndex]._value || item.description;
    item.name = i18nData.Items[nameKey][i18nIndex]._value || item.name;
    items[gid] = item
    Object.assign(item, itemsMeta[gid])
  })
  return items;
}

const getItemsMetaData = async () => {
  const data = await getXMLDataAndParse("./assets/items_metadata.xml")
  const itemsMeta = {};
  data.forEach((item) => {
    if (item._type === "item") {
      itemsMeta[`c${item.id}`] = item;
    }
    else if (item._type === "trinket") {
      itemsMeta[`t${item.id}`] = item;
    }
  })
  return itemsMeta
}

const getPocketItemsData = async (i18nData) => {
  const data = await getXMLDataAndParse("./assets/pocketitems.xml")
  const pocketItems = {};
  const i18nIndex = window._i18n_index;
  data.forEach((item) => {
    if (item._type === "card" || item._type === "rune") {
      item._gtype = "k"
      item._gid = `k${item.id}`
      pocketItems[item._gid] = item;
    }
    else if (item._type === "pilleffect") {
      item._gtype = "p"
      item._gid = `p${item.id}`
      pocketItems[item._gid] = item;
    } else {
      return
    }
    if ((item.id == 0 && item._gtype === "k") || !item.name) {
      return;
    }
    const nameKey = item.name.substring(1, item.name.length);
    item.name = i18nData.PocketItems[nameKey][i18nIndex]._value;
    if (!item.description) {
      return;
    }
    const descriptionKey = item.description?.substring(1, item.description.length);
    item.description = i18nData.PocketItems[descriptionKey][i18nIndex]._value || item.description;
  })
  return (pocketItems)
}

const getStagesData = async (i18nData) => {
  const data = await getXMLDataAndParse("./assets/stages.xml")
  const stages = {};
  const i18nIndex = window._i18n_index;
  data.forEach((item) => {
    stages[item.id] = item;
    const nameKey = item.name.substring(1, item.name.length);
    item.name = i18nData.Stages[nameKey][i18nIndex]._value;
  })
  delete stages["0"]
  return (stages)
}

const getI18nData = async () => {
  const data = await getXMLDataAndParse("./assets/stringtable.sta")
  const i18n = {};
  data.forEach((item) => {
    if (item.name) {
      const range = {};
      i18n[item.name] = range;
      item._children.forEach((key) => {
        range[key.name] = key._children
      })
    }
  })
  return i18n
}

const getSearchData = async () => {
  const itemsData = (await fetch("./search/items.json")).text();
  const pocketItemsData = (await fetch("./search/pocketitems.json")).text();
  return Object.assign(JSON.parse(await itemsData), JSON.parse(await pocketItemsData))
}

const searchTreeRoot = {};

const buildSearchTree = (searchData, items, pocketItems) => {
  Object.entries(searchData).forEach(([gid, keywords]) => {
    keywords.forEach((keyword) => {
      buildSearchBranch(searchTreeRoot, keyword, items[gid] || pocketItems[gid])
    })
  })
}

const buildSearchBranch = (node, text, leaf) => {
  const firstLetter = text[0];
  let nodeFound;
  if (!node[firstLetter]) {
    nodeFound = {};
    node[firstLetter] = nodeFound;
  } else {
    nodeFound = node[firstLetter];
  }
  if (text.length <= 1) {
    if (!nodeFound.result) {
      nodeFound.result = []
    }
    nodeFound.result.push(leaf);
  } else {
    buildSearchBranch(nodeFound, text.substring(1, text.length), leaf)
  }
}

const pickSearchBranch = (node) => {
  if (node === null) {
    return [];
  }
  const results = [];
  // 如果当前节点有一个结果，将其添加到结果数组中
  if (node.result) {
    results.push(...node.result);
  }
  // 递归遍历子节点，将它们的结果合并到结果数组中
  for (const letter in node) {
    if (letter !== 'result') {
      results.push(...pickSearchBranch(node[letter]));
    }
  }
  return Array.from(new Set(results));
}

const search = (keyword) => {
  const letters = keyword.split("");
  let i = 0;
  let node = searchTreeRoot;
  while (i < letters.length) {
    if (node[letters[i]]) {
      node = node[letters[i]];
    } else {
      node = null;
      break;
    }
    i++
  }
  const picked = pickSearchBranch(node)
  const result = {
    c: [],
    k: [],
    t: [],
    p: []
  }
  picked.forEach((p) => {
    if (!p) {
      return;
    }
    if (p._gtype === "k") {
      result[p._gtype]?.push(p._gid)
    } else {
      result[p._gtype]?.push(p)
    }
  })
  return result
}

const initResources = async () => {
  const i18nData = await getI18nData();
  const metadata = await getItemsMetaData()
  const pocketItems = await getPocketItemsData(i18nData);
  const items = await getItemsData(metadata, i18nData);
  const stages = await getStagesData(i18nData)
  await buildSearchTree(await getSearchData(), items, pocketItems);
  window._resource = {
    pocketItems, items, stages
  }
}

export { initResources, search };