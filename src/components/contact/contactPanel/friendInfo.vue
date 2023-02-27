<template>
  <n-card title="信息" size="huge">{{ panelInfo }}</n-card>
</template>

<script setup lang="ts">
import { Info } from "./type";

defineProps<{
  panelInfo: Info
}>()

</script>

<style scoped></style>
