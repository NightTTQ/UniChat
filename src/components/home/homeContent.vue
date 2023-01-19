<template>
  <div class="wrapper">
    <div class="background">
      <div class="contanier">
        <div class="text">
          <h1>We Are Interact</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed
            dapibus leo nec ornare diam sed commodo nibh ante facilisis
            bibendum.
          </p>
          <n-button
            size="large"
            color="#5ca9fb"
            round
            type="info"
            @click="goLogin"
            class="button"
          >
            To Login &nbsp;
            <n-icon class="icon" size="18"><ArrowForward /> </n-icon>
          </n-button>
        </div>
      </div>
    </div>
    <div class="features" id="features">
      <div class="title">
        <h1>Features</h1>
        <p>即时在线聊天，团队合作办公，直播交流互动，信息快速分享等</p>
      </div>
      <div class="row">
        <div class="item">
          <i class="fa"
            ><n-icon class="icon" size="48"><ChatbubblesOutline /> </n-icon
          ></i>
          <h3>Live Chat</h3>
          <p>
            Lorem ipsum dolor sit amet placerat facilisis felis mi in tempus
            eleifend pellentesque natoque etiam.
          </p>
        </div>
        <div class="item">
          <i class="fa"
            ><n-icon class="icon" size="48"><People /> </n-icon
          ></i>
          <h3>Team Work</h3>
          <p>
            Lorem ipsum dolor sit amet placerat facilisis felis mi in tempus
            eleifend pellentesque natoque etiam.
          </p>
        </div>
        <div class="item">
          <i class="fa"
            ><n-icon class="icon" size="48"><VideocamOutline /> </n-icon
          ></i>
          <h3>Live Interact</h3>
          <p>
            Lorem ipsum dolor sit amet placerat facilisis felis mi in tempus
            eleifend pellentesque natoque etiam.
          </p>
        </div>
        <div class="item">
          <i class="fa"
            ><n-icon class="icon" size="48"><ShareSocialOutline /> </n-icon
          ></i>
          <h3>Information Share</h3>
          <p>
            Lorem ipsum dolor sit amet placerat facilisis felis mi in tempus
            eleifend pellentesque natoque etiam.
          </p>
        </div>
      </div>
    </div>
    <div class="about" id="about">
      <div class="title">
        <h1>About</h1>
        <p>
          即时在线聊天，优化用户体验，直播交流互动，实现搭建专属私域聊天直播平台
        </p>
      </div>
      <div class="tab">
        <n-tabs default-value="1">
          <n-tab-pane name="1">
            <template #tab>
              <div class="tab-title">
                <n-icon class="icon" size="40"><ChatbubblesOutline /> </n-icon>
                <span>即时聊天</span>
              </div>
            </template>
            <div class="tab-content">
              <div class="tab-content-text">
                <h2><span>01</span>&nbsp;即时聊天</h2>
                <p></p>
                <n-divider />
                <ul>
                  <li>
                    <n-icon color="#006cff" size="24"
                      ><CheckmarkCircleOutline />
                    </n-icon>
                    <span>在线互通交流平台</span>
                  </li>
                  <li>
                    <n-icon color="#006cff" size="24"
                      ><CheckmarkCircleOutline />
                    </n-icon>
                    <span>用户异地互动聊天，轻松参与</span>
                  </li>
                  <li>
                    <n-icon color="#006cff" size="24"
                      ><CheckmarkCircleOutline />
                    </n-icon>
                    <span>满足业务接洽的场景需要 </span>
                  </li>
                </ul>
              </div>
              <div class="tab-content-img">
                <n-image
                  lazy
                  width="600"
                  height="390"
                  src="https://static1.weizan.cn/zhibo/static/img/vzan/pc/index_image/block2-img3.png"
                />
              </div>
            </div>
          </n-tab-pane>
          <n-tab-pane name="2">
            <template #tab>
              <div class="tab-title">
                <n-icon class="icon" size="40"><VideocamOutline /> </n-icon>
                <span>线上直播</span>
              </div>
            </template>
            <div class="tab-content">
              <div class="tab-content-text">
                <h2><span>02</span>&nbsp;线上直播</h2>
                <p></p>
                <n-divider />
                <ul>
                  <li>
                    <n-icon color="#006cff" size="24"
                      ><CheckmarkCircleOutline />
                    </n-icon>
                    <span>快速搭建直播会议</span>
                  </li>
                  <li>
                    <n-icon color="#006cff" size="24"
                      ><CheckmarkCircleOutline />
                    </n-icon>
                    <span> 完整留存直播内容，随时回放观看 </span>
                  </li>
                  <li>
                    <n-icon color="#006cff" size="24"
                      ><CheckmarkCircleOutline />
                    </n-icon>
                    <span> 不同直播布局，一键无缝切换 </span>
                  </li>
                </ul>
              </div>
              <div class="tab-content-img">
                <n-image
                  lazy
                  width="600"
                  height="390"
                  src="https://static1.weizan.cn/zhibo/static/img/vzan/pc/index_image/block2-img1-2.png"
                />
              </div>
            </div>
          </n-tab-pane>
          <n-tab-pane name="3">
            <template #tab>
              <div class="tab-title">
                <n-icon class="icon" size="40"><Contrast /> </n-icon>
                <span>圆桌会议</span>
              </div>
            </template>
            <div class="tab-content">
              <div class="tab-content-text">
                <h2><span>03</span>&nbsp;圆桌会议</h2>
                <p></p>
                <n-divider />
                <ul>
                  <li>
                    <n-icon color="#006cff" size="24"
                      ><CheckmarkCircleOutline />
                    </n-icon>
                    <span>稳定互动，超低延迟</span>
                  </li>
                  <li>
                    <n-icon color="#006cff" size="24"
                      ><CheckmarkCircleOutline />
                    </n-icon>
                    <span> 小程序、网页、App、客户端多平台轻松加入</span>
                  </li>
                  <li>
                    <n-icon color="#006cff" size="24"
                      ><CheckmarkCircleOutline />
                    </n-icon>
                    <span>跨区域连线参会，一键分享，轻松入会</span>
                  </li>
                </ul>
              </div>
              <div class="tab-content-img">
                <n-image
                  lazy
                  width="600"
                  height="390"
                  src="https://static1.weizan.cn/zhibo/static/img/vzan/pc/index_image/block2-img2.png"
                />
              </div>
            </div>
          </n-tab-pane>
        </n-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  ArrowForward,
  ChatbubblesOutline,
  People,
  VideocamOutline,
  ShareSocialOutline,
  Contrast,
  CheckmarkCircleOutline,
} from "@vicons/ionicons5";
import router from "@/router";
// 跳转登录
const goLogin = () => {
  router.push({ path: "/login" });
};
</script>

<style scoped lang="scss">
.wrapper {
  .background {
    display: table;
    width: 100%;
    height: 700px;
    padding: 0;
    background: url("http://cdn.cunese.com.cn/FvamDqod5TV8c4f4u4JQjWYk9umz")
      center center no-repeat;
    background-color: #e5e5e5;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    background-size: cover;
    -o-background-size: cover;
    .contanier {
      display: flex;
      background: rgba(0, 0, 0, 0.2);
      height: 700px;
      margin: auto;
      .text {
        margin: auto auto;
        text-align: center;
        width: 750px;
        color: white;
        h1 {
          font-family: "Raleway", sans-serif;
          color: #fff;
          font-size: 78px;
          font-weight: 600;
          text-transform: uppercase;
          margin-top: 0;
          margin-bottom: 10px;
        }
        p {
          color: #fff;
          font-size: 22px;
          font-weight: 300;
          line-height: 30px;
          margin: 0 auto;
          margin-bottom: 60px;
        }
        .button {
          height: 50px;
        }
      }
    }
  }
  .features {
    height: 600px;
    background-color: #f8f5f5;
    .title {
      display: flex;
      flex-direction: column;
      text-align: center;
      h1 {
        font-family: "Raleway", sans-serif;
        margin-top: 2em;
        margin-bottom: 0;
      }
      p {
        color: #60646b;
        font-size: 1.2em;
      }
    }
    .row {
      margin: 4em 10em;
      display: flex;
      .item {
        margin: 0.1em 0.8em;
        text-align: center;
        .fa {
          display: flex;
          margin: 0 auto;
          color: #fff;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(to right, #6372ff 0%, #5ca9fb 100%);
          box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.05);
        }
        .icon {
          margin: auto auto;
        }
      }
    }
  }
  .about {
    height: 700px;
    // margin: 0em 20em;
    // background: url("https://www.vzan.com/_nuxt/img/bg.3933428.png");
    background: url("http://cdn.cunese.com.cn/FqfVLPCbr-v8A8vxHg_svE4jvVjS");
    .title {
      display: flex;
      flex-direction: column;
      text-align: center;
      margin-bottom: 2em;
      h1 {
        font-family: "Raleway", sans-serif;
        margin-top: 2em;
        margin-bottom: 0em;
      }
      p {
        color: #60646b;
        font-size: 1.2em;
      }
    }
    .tab {
      margin: 0em 18em;
      .tab-title {
        display: flex;
        margin: auto 5.5em;
        font-size: 16px;
        span {
          margin: auto 0.3em;
        }
      }
      .tab-content {
        display: flex;
        .tab-content-text {
          margin-top: 2em;
          width: 45%;
          span {
            color: #006cff;
          }
          ul {
            margin-top: 3em;
            padding: 0 0 0 1em;
            li {
              display: flex;
              list-style: none;
              margin-bottom: 2em;
              span {
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 450;
                font-size: 1.2em;
                color: #202124;
                margin-left: 0.5em;
              }
            }
          }
        }
        .tab-content-img {
          padding: 1em;
          width: 55%;
        }
      }
    }
  }
}
</style>
