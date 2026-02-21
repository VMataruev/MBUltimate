import { ElectronAPI, IpcRenderer } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      ping: () => Promise<string>;
      onMonitorsData: (callback: (data: any) => void) => void;
      getMonitors: () => any[];
      updateBrightness: (monitorId, newValue) => any;
    }
  }
}
