<template>
  <n-card>
    <div class="wrapper">
      <n-el tag="div" class="tabs">
        <div
          class="tabs-item"
          :class="{ active: loginMethod === 0 }"
          @click="loginMethod = 0"
        >
          <div class="tabs-item-text">账号登录</div>
        </div>
        <div
          class="tabs-item"
          :class="{ active: loginMethod === 1 }"
          @click="loginMethod = 1"
        >
          <div class="tabs-item-text">手机登录</div>
        </div>
      </n-el>
      <n-form
        v-show="loginMethod === 0"
        :model="accountForm"
        class="form"
        :rules="accountFormRules"
        ref="accountFormRef"
      >
        <n-form-item :show-label="false" path="account">
          <n-input
            v-model:value="accountForm.account"
            placeholder="输入邮箱/账号名"
            :maxlength="30"
            size="large"
            type="account"
          />
        </n-form-item>
        <n-form-item :show-label="false" path="password">
          <n-input
            v-model:value="accountForm.password"
            placeholder="请输入登录密码"
            show-password-on="mousedown"
            :maxlength="30"
            size="large"
            type="password"
          />
        </n-form-item>
        <n-form-item :show-label="false">
          <n-button
            type="primary"
            @click="login"
            :loading="isLoading"
            size="large"
            attr-type="submit"
          >
            登录
          </n-button>
        </n-form-item>
      </n-form>
      <n-form v-show="loginMethod === 1" :model="phoneForm" class="form">
        <n-form-item :show-label="false">
          <n-input
            v-model:value="phoneForm.phone"
            placeholder="输入手机号"
            :maxlength="20"
            size="large"
            type="phone"
          />
        </n-form-item>
        <n-form-item :show-label="false">
          <n-input-group>
            <n-input
              v-model:value="phoneForm.code"
              placeholder="请输入验证码"
              :maxlength="6"
              size="large"
            />
            <n-button
              type="primary"
              ghost
              size="large"
              :style="{ width: 'auto' }"
            >
              发送验证码
            </n-button>
          </n-input-group>
        </n-form-item>
        <n-form-item :show-label="false">
          <n-button
            type="primary"
            @click="login"
            :loading="isLoading"
            size="large"
            attr-type="submit"
          >
            登录
          </n-button>
        </n-form-item>
      </n-form>
      <div class="more">
        <router-link to="register"><n-a>注册</n-a></router-link>
        <n-a href="">忘记密码</n-a>
      </div>
    </div>
  </n-card>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useNotification, FormInst, FormRules } from "naive-ui";
import router from "@/router";
import userService from "@/services/userService";
import { useUserStore } from "@/stores";

const loginMethod = ref(0);
const isLoading = ref(false);
const accountForm = ref({ account: "", password: "" });
const phoneForm = ref({ phone: "", code: "" });
const notification = useNotification();
const userStore = useUserStore();
const accountFormRef = ref<FormInst | null>(null);

const accountFormRules: FormRules = {
  account: [
    { required: true, message: "请输入账号", trigger: ["blur", "input"] },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: ["blur", "input"] },
  ],
};

const login = async () => {
  try {
    if (loginMethod.value === 0) {
      try {
        await accountFormRef.value?.validate();
      } catch (error) {
        return;
      }
      isLoading.value = true;
      const data = await userService.login(
        accountForm.value.account,
        accountForm.value.password
      );
      if (data.code === 200) {
        userStore.setUserInfo(data.data);
        notification.success({
          content: "登录成功",
          duration: 3000,
          keepAliveOnHover: true,
        });
      } else {
        notification.error({
          content: "登录失败",
          duration: 3000,
          keepAliveOnHover: true,
        });
        router.push({ name: "logout" });
      }
    } else if (loginMethod.value === 1) {
      isLoading.value = true;
      notification.warning({
        content: "手机登录还没写好！",
        duration: 3000,
        keepAliveOnHover: true,
      });
    }
  } catch (error: any) {
    notification.error({
      content: error.response.data.error.message,
      duration: 3000,
      keepAliveOnHover: true,
    });
  }
  isLoading.value = false;
};
</script>
<style scoped lang="scss">
.n-card {
  border-radius: 14px;
}
.wrapper {
  display: flex;
  flex-direction: column;
  .tabs {
    display: flex;
    margin-bottom: 2em;
    .tabs-item {
      margin-right: 1em;
      cursor: pointer;
      .tabs-item-text {
        font-size: large;
      }
    }
    .active {
      border-bottom: 2px solid var(--primary-color);
      color: var(--primary-color);
    }
  }
  .form {
    min-width: 360px;
    .n-button {
      width: 100%;
    }
    .n-input {
      text-align: left;
    }
  }
  .more {
    display: flex;
    justify-content: space-between;
    font-size: small;
  }
}
</style>
