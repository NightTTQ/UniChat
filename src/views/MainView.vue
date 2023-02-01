<template>
  <div>
    <n-layout style="height: 100vh" has-sider>
      <UserList></UserList>
      <ChatRoom></ChatRoom>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import ChatRoom from '@/components/chat/chatRoom.vue';
import UserList from '@/components/chat/userList.vue';

</script>

<style scoped></style>
