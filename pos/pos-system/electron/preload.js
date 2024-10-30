const { contextBridge, ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});

// Expose ipcRenderer to the renderer process (React)
contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    send: (channel, data) => {
      ipcRenderer.send(channel, data);
    },
    on: (channel, func) => {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
    removeListener: (channel, func) => ipcRenderer.removeListener(channel, func),
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  },
});
