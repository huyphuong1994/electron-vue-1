const {app, ipcMain} = require('electron');

const sqlite3 = require('sqlite3');
const path = require('path')
const dbPath = path.join(__dirname, '../database/database.db');
const db = new sqlite3.Database(dbPath);

// app.whenReady().then(() => {
//     const dbPath = path.join(__dirname, '../database/database.db');
//
//     db = new sqlite3.Database(dbPath); // Đường dẫn đến file SQLite (':memory:' sẽ lưu trữ dữ liệu trong bộ nhớ)
//
//     // db.run('CREATE TABLE IF NOT EXISTS groups_a (id INTEGER PRIMARY KEY, name_group TEXT NOT NULL, token_bot TEXT NOT NULL, chat_id TEXT)');
//     db.run('CREATE TABLE IF NOT EXISTS groups (id INTEGER PRIMARY KEY, name_group TEXT NOT NULL, token_bot TEXT NOT NULL, chat_id TEXT, admins TEXT, topic_id INTEGER, status_chat BLOB)');
//     db.run('CREATE TABLE IF NOT EXISTS connect_group (id INTEGER PRIMARY KEY, group_a_id INTEGER NOT NULL, group_b_id INTEGER NOT NULL)');
// })

function createGroup(data) {
    const sql = 'INSERT INTO groups (name_group, token_bot, chat_id) VALUES (?, ?, ?)';
    db.run(sql, data, (err) => {
        if (err) {
            console.error('Lỗi khi tạo dữ liệu:', err);
        } else {
            console.log('Đã tạo dữ liệu thành công');
        }
    });
}

function getListGroup(callback) {
    db.all('SELECT * FROM groups', (err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
}

module.exports = {
    createGroup,
    getListGroup
};
