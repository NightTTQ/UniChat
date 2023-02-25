<template>
  <div class="slider-wrapper">
    <div
      v-for="item in callbackInfo"
      :key="item.labelname"
      class="slider-item"
      @click="toggleBottomLine($event, item.callback)"
    >
      <button>{{ item.labelname }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import type { CallbackInfo } from "./type";

defineProps<{
  callbackInfo: CallbackInfo[];
}>();

// 选中首个元素
const init = () => {
  console.log();
  document.querySelectorAll("button")[0].id = "active";
};

// 控制底部栏
const toggleBottomLine = (eve: Event, callback: () => void) => {
  // 被点击的元素
  const ele = eve.target as HTMLDivElement;
  const activeEle = document.querySelector("#active");

  if (activeEle) {
    activeEle.removeAttribute("id");
    ele.setAttribute("id", "active");
    callback();
  } else {
    init();
  }
};

onMounted(init);
</script>

<style scoped>
.slider-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: inherit;
}

.slider-item {
  flex: 1;
  height: 100%;
  background-color: inherit;
  justify-content: center;
  display: flex;
}

.slider-item button {
  border: 0;
  height: 50px;
  color: white;
  background-color: inherit;
  font-size: 15px;
  cursor: pointer;
  box-sizing: border-box;
}

button[id="active"] {
  border-bottom: 2px solid blue;
}

.slider-item[id="active"] button {
  border-bottom: 2px solid blue;
}
</style>
