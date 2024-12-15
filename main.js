const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const fs = require('fs');



async function main() {
  await app.whenReady();
  ipcMain.handle('read-notes', () => {
    try {
      const notesPath = path.join(__dirname, 'notes.json');
      const data = fs.readFileSync(notesPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to read the file:', error);
      return [];
    }
  });
  
  ipcMain.handle('write-notes', (event, notes) => {
    try {
      const notesPath = path.join(__dirname, 'notes.json');
      fs.writeFileSync(notesPath, JSON.stringify(notes, null, 2), 'utf-8');
      return { success: true };
    } catch (error) {
      console.error('Failed to save the file:', error);
      return { success: false, message: 'Failed to save the notes file' };
    }
  });
  
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),  // 指定 preload 文件
      contextIsolation: true,  // 启用上下文隔离
      nodeIntegration: false,  // 禁用 Node.js 集成
  },
  });
  win.loadURL('http://localhost:5173/'); // 在 Vite 开发模式下，Electron 会加载 Vite 提供的开发服务器地址



  app.on('window-all-closed', () => app.quit());
}

  
main();

