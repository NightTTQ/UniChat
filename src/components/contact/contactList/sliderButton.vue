<template>
  <div class="slider-wrapper">
    <div
      v-for="item in callbackInfo"
      :key="item.labelname"
      class="slider-item"
      :id="item.name"
      @click="item.callback"
    >
      <button>{{ item.labelname }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import router from "@/router";

import type { CallbackInfo } from "./type";

const props = defineProps<{
  callbackInfo: CallbackInfo[];
}>();
// 所有路由名
const names = props.callbackInfo.map((info) => info.name);

// 用于在用户直接输入地址栏时调整样式
const init = () => {
  const name = router.currentRoute.value.name;
  name && changeActive(name as string);
};

const changeActive = (currentRouteName: string) => {
  if (currentRouteName && names.includes(currentRouteName)) {
    document.querySelector(".active")?.classList.remove("active");
    const ele = document.getElementById(currentRouteName as string);
    ele?.classList.add("active");
  }
};
// 路由变换时更改样式
watch(router.currentRoute, (e) => changeActive(e.name as string), {
  immediate: true,
});

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

.active button {
  border-bottom: 2px solid blue;
}
</style>
