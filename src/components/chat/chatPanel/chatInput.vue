<template>
  <div class="input-wrapper">
    <n-input
      v-model:value="text"
      type="textarea"
      :autosize="{
        minRows: 1,
        maxRows: 12,
      }"
      placeholder=""
    />
    <div class="action" v-if="text !== ''">
      <n-button
        @click="sendMessage"
        class="button"
        text
        style="font-size: 26px"
      >
        <n-icon><Send /> </n-icon>
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Send } from "@vicons/ionicons5";

const props = defineProps<{
  draft?: string;
}>();
const emit = defineEmits<{ (event: "send", message: string): void }>();

const text = ref("");

const sendMessage = () => {
  emit("send", text.value);
  text.value = "";
};
</script>

<style lang="scss" scoped>
.input-wrapper {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  column-gap: 1em;
  background-color: var(--n-color);
  padding: 1em;
  .action {
    .button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
