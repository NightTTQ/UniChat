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
      <n-form v-if="loginMethod === 0" :model="accountForm" class="form">
        <n-form-item :show-label="false">
          <n-input
            v-model="accountForm.account"
            placeholder="输入邮箱/账号名"
            :maxlength="30"
            size="large"
            type="account"
          />
        </n-form-item>
        <n-form-item :show-label="false">
          <n-input
            v-model="accountForm.password"
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
            size="large"
            native-type="submit"
          >
            登录
          </n-button>
        </n-form-item>
      </n-form>
      <n-form v-if="loginMethod === 1" :model="phoneForm" class="form">
        <n-form-item :show-label="false">
          <n-input
            v-model="phoneForm.phone"
            placeholder="输入手机号"
            :maxlength="20"
            size="large"
            type="phone"
          />
        </n-form-item>
        <n-form-item :show-label="false">
          <n-input-group>
            <n-input
              v-model="phoneForm.code"
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
            size="large"
            native-type="submit"
          >
            登录
          </n-button>
        </n-form-item>
      </n-form>
      <div class="more">
        <n-a href="">注册</n-a>
        <n-a href="">忘记密码</n-a>
      </div>
    </div>
  </n-card>
</template>
<script setup lang="ts">
import { ref } from "vue";

const loginMethod = ref(0);
const accountForm = ref({ account: "", password: "" });
const phoneForm = ref({ phone: "", code: "" });

const login = () => {
  if (loginMethod.value === 0) console.log("account");
  if (loginMethod.value === 1) console.log("phone");
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
