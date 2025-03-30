import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createBootstrap } from 'bootstrap-vue-next'
import router from './router'
import type {IpcApi} from "../types/apiType";

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'vue3-json-viewer/dist/index.css'

const app = createApp(App)

// Declare the window electron API so that frontend files are aware of it's existence in typescript.
declare global {
    interface Window {
        electron: IpcApi;
    }
}

app.use(router)
app.use(createBootstrap())

router.push("/")

app.mount('#app')
