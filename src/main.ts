import { createApp, DirectiveBinding } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "./style.css";
import App from "./App.vue";
import router from "./router";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

createApp(App)
  .directive("intersect", {
    mounted(el, binding: DirectiveBinding<IntersectionObserver>) {
      binding.value.observe(el);
    },
  })
  .use(router)
  .use(pinia)
  .mount("#app");
