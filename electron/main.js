import {app, BrowserWindow, ipcMain} from 'electron'
import path from 'node:path'
const sqlite3 = require('sqlite3');
const server = require('../server');

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │

process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win
let db

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }

  win.webContents.openDevTools()
}

app.on('window-all-closed', () => {
  win = null
})

app.whenReady().then(() => {
  const dbPath = path.join(__dirname, '../database/database.db');

  db = new sqlite3.Database(dbPath); // Đường dẫn đến file SQLite (':memory:' sẽ lưu trữ dữ liệu trong bộ nhớ)

  db.run('CREATE TABLE IF NOT EXISTS groups_a (id INTEGER PRIMARY KEY, name_group TEXT NOT NULL, token_bot TEXT NOT NULL, chat_id TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS groups_b (id INTEGER PRIMARY KEY, name_group TEXT NOT NULL, token_bot TEXT NOT NULL, chat_id TEXT, admins TEXT, topic_id INTEGER, status_chat BLOB)');
  db.run('CREATE TABLE IF NOT EXISTS connect_group (id INTEGER PRIMARY KEY, group_a_id INTEGER NOT NULL, group_b_id INTEGER NOT NULL)');

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
})

ipcMain.on('getUsers', (event) => {
  // Truy vấn dữ liệu từ bảng users
  db.all('SELECT * FROM groups_a', (err, rows) => {
    if (err) {
      console.error(err);
    } else {
      console.log('123', rows)

      // Gửi dữ liệu về quy trình render
      event.reply('users', rows);
    }
  });
});

ipcMain.on('create_group_a', (event, data) => {
  db.run('INSERT INTO groups_a (name_group, token_bot, chat_id) VALUES (?, ?, ?)', data, function(err) {
    if (err) {
      console.error(err);
    } else {
      console.log('User added successfully');
    }
  });
})
