import { createApp } from "vue";
import { createPinia } from "pinia";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHome, faSave, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);

// Register the Font Awesome icons
library.add(faHome, faSave, faTrashAlt);

// Register the FontAwesomeIcon component
app.component("font-awesome-icon", FontAwesomeIcon);

app.use(createPinia());
app.use(router);

app.mount("#app");
