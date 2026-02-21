"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 400,
    height: 600,
    show: false,
    title: "MBUltimate",
    autoHideMenuBar: true,
    // ...(process.platform === 'linux' ? { icon } : {}),
    icon: process.platform === "win32" ? path.join(__dirname, "../../resources/icon.ico") : path.join(__dirname, "../../resources/icon.png"),
    // Для Linux
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
const lumi = require("lumi-control");
const monitors = lumi.monitors();
console.log(monitors);
console.log(monitors.length);
async function getMonitorBrightness() {
  let monitor_brightness = [];
  for (let i = 0; i < monitors.length; i++) {
    const monitorId = monitors[i]["id"];
    const { success: _, brightness } = await lumi.get(monitorId);
    monitor_brightness.push({
      id: monitors[i]["id"],
      name: monitors[i]["name"],
      brightness
    });
  }
  return monitor_brightness;
}
getMonitorBrightness().then((result) => {
  console.log(result);
});
electron.ipcMain.handle("get-monitors", async () => {
  const res = getMonitorBrightness().then((result) => {
    return result;
  });
  return res;
});
electron.ipcMain.on("update-brightness", (_event, { id, value }) => {
  lumi.set(id, value);
});
