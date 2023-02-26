<template>
  <n-layout style="height: 100vh" has-sider>
    <ContactList></ContactList>
    <ContactPanel></ContactPanel>
  </n-layout>
</template>
<script setup lang="ts">


</script>
<style scoped lang="scss">
.wrapper {
  display: flex;
  height: 100vh;
  .bar {
    width: 5px;
    height: 100%;
    cursor: e-resize;
  }
}
</style>
