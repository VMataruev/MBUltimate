"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const api = {
  getMonitors: () => electron.ipcRenderer.invoke("get-monitors"),
  updateBrightness: (id, value) => electron.ipcRenderer.send("update-brightness", { id, value })
};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = api;
}
