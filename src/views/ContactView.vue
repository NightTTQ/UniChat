<template>
  <n-layout style="height: 100vh" has-sider>
    <ContactList :contacts="contacts"></ContactList>
    <ContactPanel></ContactPanel>
  </n-layout>
</template>
<script setup lang="ts">
import { ref, Ref } from "vue";
import { storeToRefs } from "pinia";

import { ContactList } from "@/components/contact/contactList";
import { ContactPanel } from "@/components/contact/contactPanel";
import { useContactsStore } from "@/stores";
import { Contact } from "@/types";

const contactStore = useContactsStore();
const contacts = storeToRefs(useContactsStore()).contacts;

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
