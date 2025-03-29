import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { fileURLToPath } from "url";
import path from "path";
import {registerKubernetesIpc} from './kubernetesIpc.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    })

    // This requires having the vue application already built and ready to be served.
    // You can develop with `npm run dev` and then build to electron after.
    win.loadFile('dist/index.html')
}

app.whenReady().then(() => {
    registerKubernetesIpc(ipcMain)
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})