import {ApplicationConfig} from "../../types/configTypes.js";
import {app} from "electron";
import path from "path";
import * as fs from "node:fs";
import IpcMain = Electron.IpcMain;

export class ConfigHandler {
    // Default Configuration Value
    config: ApplicationConfig = {
        k8sConfig: {
            kubeconfigPaths: ["default"],
            helmPath: "default",
            helmChartDir: path.join(app.getPath("userData"), "helm/charts")
        }
    }

    CONFIG_PATH = path.join(app.getPath("userData"), "config.json");

    constructor() {
        // Try to load the app configuration to override the default
        console.log(`Loading config from ${this.CONFIG_PATH}`);
        if(fs.existsSync(this.CONFIG_PATH)) {
            const configMaybe = fs.readFileSync(this.CONFIG_PATH, 'utf8');
            this.config = JSON.parse(configMaybe);
        } else {
            console.log(`No config file exists. Creating default.`);
            fs.writeFileSync(this.CONFIG_PATH, JSON.stringify(this.config));
        }
        console.log(`Loaded config: ${JSON.stringify(this.config)}`);
    }

    // MUST register IPCs after constructor!
    // Otherwise things are undefined! DUH.
    registerIpc(ipcMain: IpcMain) {
        ipcMain.handle('config:getConfig', () => this.getConfig())
        ipcMain.on('config:setConfig', (event, config: ApplicationConfig) => this.setConfig(config))
    }

    getConfig() {
        return this.config;
    }

    setConfig(config: ApplicationConfig): void {
        console.log(`Updating config to: ${config}`);
        this.config = config;
        fs.writeFileSync(this.CONFIG_PATH, JSON.stringify(this.config));
        return;
    }
}