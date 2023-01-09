<template>
  <n-card>
    <div class="wrapper">
      <n-el tag="div" class="tabs">
        <div class="tabs-item active">
          <div class="tabs-item-text">账号注册</div>
        </div>
      </n-el>
      <n-form :model="accountForm" ref="formRef" class="form" :rules="rules">
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
            @input="handlePasswordInput"
            show-password-on="mousedown"
            :maxlength="30"
            size="large"
            type="password"
          />
        </n-form-item>
        <n-form-item
          :show-label="false"
          path="reenteredPassword"
          first
          ref="rPasswordFormItemRef"
        >
          <n-input
            v-model:value="accountForm.reenteredPassword"
            placeholder="请再次输入登录密码"
            show-password-on="mousedown"
            :maxlength="30"
            size="large"
            type="password"
          />
        </n-form-item>
        <n-form-item :show-label="false">
          <n-button
            type="primary"
            @click="register"
            :loading="isLoading"
            size="large"
          >
            注册
          </n-button>
        </n-form-item>
      </n-form>
      <div class="more">
        <router-link to="login"><n-a>登录</n-a></router-link>
      </div>
    </div>
  </n-card>
</template>
<script setup lang="ts">
import { ref } from "vue";
import {
  useNotification,
  FormRules,
  FormInst,
  FormItemInst,
  FormItemRule,
} from "naive-ui";
import router from "@/router";
import userService from "@/services/userService";

const formRef = ref<FormInst | null>(null);
const rPasswordFormItemRef = ref<FormItemInst | null>(null);
const isLoading = ref(false);
const accountForm = ref({ account: "", password: "", reenteredPassword: "" });
const notification = useNotification();

const validatePasswordStartWith = (
  rule: FormItemRule,
  value: string
): boolean =>
  !!accountForm.value.password &&
  accountForm.value.password.startsWith(value) &&
  accountForm.value.password.length >= value.length;
const validatePasswordSame = (rule: FormItemRule, value: string): boolean =>
  value === accountForm.value.password;
const rules: FormRules = {
  account: [{ required: true, message: "请输入账号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码" }],
  reenteredPassword: [
    { required: true, message: "请再次输入密码", trigger: ["input", "blur"] },
    {
      validator: validatePasswordStartWith,
      message: "两次密码输入不一致",
      trigger: "input",
    },
    {
      validator: validatePasswordSame,
      message: "两次密码输入不一致",
      trigger: ["blur", "password-input"],
    },
  ],
};
const handlePasswordInput = () => {
  if (accountForm.value.reenteredPassword) {
    rPasswordFormItemRef.value?.validate({ trigger: "password-input" });
  }
};

const register = async () => {
  try {
    await formRef.value?.validate();
  } catch (error) {
    return;
  }
  isLoading.value = true;
  try {
    const data = await userService.register(
      accountForm.value.account,
      accountForm.value.password
    );
    if (data.code === 200) {
      notification.success({
        content: "注册成功",
        duration: 3000,
        keepAliveOnHover: true,
      });
      router.push({ name: "login" });
    }
  } catch (error: any) {
    notification.error({
      content: error.response.data.error.message || "注册失败",
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
