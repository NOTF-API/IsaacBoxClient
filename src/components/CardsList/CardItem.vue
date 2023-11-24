<template>
  <div class="item" :class="getItemClass()"
    @click="handleClick($event)">
    <div class="gid" v-show="props.showId">{{ props.gid }}</div>
    <div class="image">
      <div class="sprite" :style="getSpriteStyle()"></div>
    </div>
    <div class="name">{{ getCardName() }}</div>
    <div class="description">{{ getCardDescription() }}</div>
  </div>
</template>


<script setup>
import { emit } from '@/utils/ws'
const props = defineProps(['gid', 'id', "type", "x", "y", 'isListStyled', 'showId'])
const pocketItemsData = window._resource.pocketItems

const getItemClass = () => {
  return {
    'list-styled': props.isListStyled,
    [props.type]: true
  };
}

const getCardName = () => {
  return pocketItemsData[props.gid].name
}

const getCardDescription = () => {
  return pocketItemsData[props.gid].description
}

const getSpriteStyle = () => {
  const { x = 0, y = 0 } = props
  switch (props.type) {
    case "card": return `background-position: ${-x * 16}px ${-y * 24}px;`;
    default: return `background-position: ${-x * 32}px ${-y * 32}px;`;
  }

}

const handleClick = ($event) => {
  const { gid, id } = props
  if ($event.ctrlKey) {
    emit("COMMAND", `g ${gid}`);
  } else {
    emit("COMMAND", `spawn ${id}`);
  }
}

</script>

<style lang="less" scoped>
@import url("./CardList.less");

.card.item .image .sprite {
  scale: 2;
  width: 16px;
  height: 24px;
  background-image: url("/assets/gfx/ui/ui_cardfronts.png");
  background-size: 256px 144px;
  background-repeat: no-repeat;
  transform: translateY(2px);
  image-rendering: pixelated;
}

.drop.item .image .sprite {
  scale: 2;
  width: 32px;
  height: 32px;
  background-image: url("/assets/gfx/items/pick ups/pickup_017_card.png");
  background-size: 128px 128px;
  background-repeat: no-repeat;
  image-rendering: pixelated;
}

.rune.item .image .sprite {
  scale: 2;
  width: 32px;
  height: 32px;
  background-image: url("/assets/gfx/items/pick ups/pickup_007_pill.png");
  background-size: 256px 256px;
  background-repeat: no-repeat;
  image-rendering: pixelated;
}

.soulstone.item .image .sprite {
  scale: 2;
  width: 32px;
  height: 32px;
  background-image: url("/assets/gfx/items/pick ups/pickup_soulstones.png");
  background-size: 256px 192px;
  background-repeat: no-repeat;
  image-rendering: pixelated;
}
</style>