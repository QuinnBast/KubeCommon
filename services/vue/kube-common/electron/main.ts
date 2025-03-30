import { app, BrowserWindow, ipcMain } from 'electron';
import { fileURLToPath } from "url";
import path from "path";
import {ConfigHandler} from "./apis/configApi.js";
import {KubeApi} from "./apis/kubernetesApi.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            devTools: true,
            preload: path.join(__dirname, "preload.js"),
        },
    })

    win.webContents.openDevTools();

    // win.removeMenu()


    // This requires having the vue application already built and ready to be served.
    // You can develop with `npm run dev` and then build to electron after.
    // !!! This is being called from the project root
    win.loadFile(__dirname + '\\..\\dist\\index.html').then(r => {
        console.log("App ready!")
    })
}

app.whenReady().then(() => {
    const configHandler = new ConfigHandler();
    configHandler.registerIpc(ipcMain);

    const kubeApi = new KubeApi(configHandler);
    kubeApi.registerIpcHandlers(ipcMain);

    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})