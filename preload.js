const { contextBridge, ipcRenderer } = require('electron');

// 通过 contextBridge 暴露 API 给渲染进程
contextBridge.exposeInMainWorld('electron', {
  readNotes: () => ipcRenderer.invoke('read-notes'),  // 读取笔记文件
  writeNotes: (notes) => ipcRenderer.invoke('write-notes', notes),  // 写入笔记文件
});
