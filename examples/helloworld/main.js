import { createApp } from "../../lib/guide-mini-vue.esm.js";
import { App } from "./App.js";
// 如何将字符串封装到框架内，例如#app
const rootContainer = document.querySelector("#app");
createApp(App).mount(rootContainer);
