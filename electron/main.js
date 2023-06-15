import {app, BrowserWindow, ipcMain} from 'electron'
import path from 'node:path'

require('../server');
require('../database/database')
const ngrok = require('ngrok')

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

// Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
    win = new BrowserWindow({
        icon: path.join(process.env.PUBLIC, 'electron-vite.svg'),
        width: 1200,
        minWidth: 1200,
        minHeight: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
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
    createWindow();
    startNgrok()

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
})

async function startNgrok() {
    try {
        const url = await ngrok.connect(3000);

        // Gửi URL công khai qua IPC
        ipcMain.on('getNgrokUrl', (event) => {
            event.reply('ngrokUrl', url);
        });

        console.log('Url công khai', url);
    } catch (e) {
        console.log('Lỗi khi khởi động ngrok:', e);
    }
}

// module.exports = ipcMain
