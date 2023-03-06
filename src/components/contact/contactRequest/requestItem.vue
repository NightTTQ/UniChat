<template>
  <div v-if="requests.length">
    <div class="wrapper" v-for="(item, index) in requests" :key="index">
      <div class="time">{{ item.createdAt.toString().substring(0, 10) }}</div>
      <n-card size="huge">
        <div class="content">
          <!-- 头像区域 -->
          <div class="img-area">
            <img
              class="img"
              :src="
                users[item.fromUser].avatar
                  ? users[item.fromUser]?.avatar
                  : 'http://unichat.cdn.cunese.com.cn/avatar.png'
              "
              draggable="false"
              alt="暂无图片"
            />
          </div>
          <!-- 用户名 + ID区域 -->
          <div class="text-area">
            <n-h3 class="name-text">{{ users[item.fromUser].username }}</n-h3>
            <n-h3 class="desc-text">{{ item.fromUser }}</n-h3>
          </div>
          <!-- 请求文字区域 -->
          <div class="request-area">
            <n-h2 class="request-text">
              {{
                message == "好友"
                  ? "该用户申请添加你为好友"
                  : "申请加入群聊 &nbsp;&nbsp;" +
                    groups[(item as GroupRequest).toGroup].groupName
              }}
            </n-h2>
          </div>
          <!-- 操作按钮区域 -->
          <div class="button-area">
            <n-dropdown
              placement="bottom-start"
              trigger="click"
              size="medium"
              :options="options"
              @select="handleSelect"
            >
              <n-button size="large" class="button" @click="handleClick(item)">
                {{ status[item.status] }}
              </n-button>
            </n-dropdown>
          </div>
        </div>
      </n-card>
    </div>
  </div>
  <div v-else>
    <n-card size="huge">
      <div class="other">
        <h2>暂无{{ message }}请求</h2>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useNotification, FormInst, FormRules } from "naive-ui";
import { FriendRequest, GroupRequest } from "@/types";
import { useUserStore, useUsersStore, useGroupsStore } from "@/stores";
import { handleRequest as handleFriendRequest } from "@/services/contactService";
import { handleRequest as handleGroupRequest } from "@/services/groupService";

const options = [
  {
    label: "同意",
    key: "agree",
  },
  {
    label: "忽略",
    key: "ignore",
  },
];
const status: Array<string> = ["未读", "已读", "已忽略", "已同意"];

const sessionID = useUserStore().sessionID;
const usersStore = useUsersStore();
const groupsStore = useGroupsStore();
const users = usersStore.users;
const groups = groupsStore.groups;
const requestItem = ref<FriendRequest | GroupRequest>();
const notification = useNotification();

const props = defineProps<{
  requests: FriendRequest[] | GroupRequest[];
  message: string;
}>();

// 点击页面变成已读
const hasRead = async () => {
  // 进入页面请求变成已读,遍历请求列表
  props.requests.forEach(async (request) => {
    if (request.status === 0) {
      // console.log(request._id);
      const res = await handleFriendRequest(sessionID!, request._id, 1);
      // console.log(res);
    }
  });
};

// 点击按钮获取元素
const handleClick = (item: FriendRequest | GroupRequest) => {
  requestItem.value = item;
};

// 点击下拉菜单处理函数
const handleSelect = async (key: string) => {
  if (requestItem.value?.status === 2 && key === "ignore") {
    notification.warning({
      content: "该请求已忽略，请勿重复操作！",
      duration: 3000,
      keepAliveOnHover: true,
    });
    return;
  } else if (requestItem.value?.status === 3 && key === "agree") {
    notification.warning({
      content: "该请求已同意，请勿重复操作！",
      duration: 3000,
      keepAliveOnHover: true,
    });
    return;
    // 同意之后不能点击忽略
  } else if (requestItem.value?.status === 3 && key === "ignore") {
    notification.error({
      content: "该请求已同意，禁止忽略！",
      duration: 3000,
      keepAliveOnHover: true,
    });
    return;
  } else {
    // 判断是好友请求还是群聊请求
    if (props.message === "好友") {
      // 忽略
      if (key === "ignore") {
        await handleFriendRequest(sessionID!, requestItem.value?._id!, 2);
        (requestItem.value as FriendRequest).status = 2;
        notification.success({
          content: "忽略该好友请求成功",
          duration: 3000,
          keepAliveOnHover: true,
        });
      } else {
        await handleFriendRequest(sessionID!, requestItem.value?._id!, 3);
        (requestItem.value as FriendRequest).status = 3;
        notification.success({
          content: "好友添加成功",
          duration: 3000,
          keepAliveOnHover: true,
        });
      }
    } else {
      if (key === "ignore") {
        await handleGroupRequest(sessionID!, requestItem.value?._id!, 2);
        (requestItem.value as GroupRequest).status = 2;
        notification.success({
          content: "忽略该群聊请求成功",
          duration: 3000,
          keepAliveOnHover: true,
        });
      } else {
        await handleGroupRequest(sessionID!, requestItem.value?._id!, 3);
        (requestItem.value as GroupRequest).status = 3;
        notification.success({
          content: "已同意该用户的进群申请",
          duration: 3000,
          keepAliveOnHover: true,
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.other {
  width: 60em;
  height: 80px;
}
.wrapper {
  margin-bottom: 0.3em;
  .time {
    font-size: 1em;
    text-align: left;
    padding: 0.2em;
  }
  .content {
    width: 60em;
    height: 5em;
    display: flex;
    justify-content: left;
    column-gap: 1em;
    padding: 0;

    .img-area {
      left: 0;
      align-items: center;
      justify-content: center;
      .img {
        height: 70px;
        width: 70px;
        border-radius: 50%;
      }
    }
    .text-area {
      flex: 2.5;
      display: flex;
      flex-direction: column;
      margin-top: 1em;
      .name-text {
        flex: 1;
        text-align: left;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        margin: 0;
      }
      .desc-text {
        flex: 1;
        text-align: left;
        margin: 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        opacity: 0.8;
        font-size: 0.1em;
      }
    }
    .request-area {
      flex: 3.5;
      line-height: 5.5em;
      .request-text {
        float: left;
        margin: 0;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    .button-area {
      display: flex;
      justify-content: center;
      align-items: center;
      .button {
        margin: 0 auto;
      }
    }
  }
}
</style>
