const {app, ipcMain} = require('electron');

const sqlite3 = require('sqlite3');
const path = require('path')

let db

app.whenReady().then(() => {
    const dbPath = path.join(__dirname, '../database/database.db');

    db = new sqlite3.Database(dbPath); // Đường dẫn đến file SQLite (':memory:' sẽ lưu trữ dữ liệu trong bộ nhớ)

    // db.run('CREATE TABLE IF NOT EXISTS groups_a (id INTEGER PRIMARY KEY, name_group TEXT NOT NULL, token_bot TEXT NOT NULL, chat_id TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS groups (id INTEGER PRIMARY KEY, name_group TEXT NOT NULL, token_bot TEXT NOT NULL, chat_id TEXT, admins TEXT, topic_id INTEGER, status_chat BLOB)');
    db.run('CREATE TABLE IF NOT EXISTS connect_group (id INTEGER PRIMARY KEY, group_a_id INTEGER NOT NULL, group_b_id INTEGER NOT NULL)');
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
    db.run('INSERT INTO groups_a (name_group, token_bot, chat_id) VALUES (?, ?, ?)', data, function (err) {
        if (err) {
            console.error(err);
        } else {
            console.log('User added successfully');
        }
    });
})
