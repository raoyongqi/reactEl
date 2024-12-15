const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const os = require('os');

const fs = require('fs');



async function main() {
  await app.whenReady();
  const fs = require('fs');
const path = require('path');
const os = require('os');

ipcMain.handle('read-notes', () => {
  try {
    const localPath = path.join(os.homedir(), 'AppData', 'Roaming', 'local_s');  // 指定保存路径
    const notesPath = path.join(localPath, 'notes.json');

    // 检查文件夹是否存在，如果不存在则创建它
    if (!fs.existsSync(localPath)) {
      console.log('Directory not found, creating directory');
      fs.mkdirSync(localPath, { recursive: true });  // 创建目录（包括父目录）
    }

    // 检查文件是否存在
    if (!fs.existsSync(notesPath)) {
      console.log('File not found, returning empty array');
      return [];
    }

    const data = fs.readFileSync(notesPath, 'utf-8');

    // 如果文件为空，返回空数组
    if (!data) {
      return [];
    }

    // 解析 JSON 数据，若失败则返回空数组
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to parse JSON:', error);
      return [];
    }
  } catch (error) {
    console.error('Failed to read the file:', error);
    return [];
  }
});


  ipcMain.handle('write-notes', (event, notes) => {
    try {
      const localPath = path.join(os.homedir(), 'AppData', 'Roaming', 'local_s');  // 指定保存路径

      const notesPath = path.join(localPath, 'notes.json');
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

