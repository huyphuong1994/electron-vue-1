const {app, ipcMain} = require('electron');

const sqlite3 = require('sqlite3');
const path = require('path')
const dbPath = path.join(__dirname, '../database/database.db');
const db = new sqlite3.Database(dbPath);

// app.whenReady().then(() => {
// const dbPath = path.join(__dirname, '../database/database.db');

// db = new sqlite3.Database(dbPath); // Đường dẫn đến file SQLite (':memory:' sẽ lưu trữ dữ liệu trong bộ nhớ)
//
// db.run('CREATE TABLE IF NOT EXISTS topic (id INTEGER PRIMARY KEY, group_id INTEGER NOT NULL, name_topic TEXT NOT NULL, message_thread_id INTEGER NOT NULL, status_chat BLOB)');
// db.run('CREATE TABLE IF NOT EXISTS groups (id INTEGER PRIMARY KEY, name_group TEXT NOT NULL, token_bot TEXT NOT NULL, chat_id TEXT, admins TEXT, status_webhook BLOB)');
// db.run('CREATE TABLE IF NOT EXISTS connect_group (id INTEGER PRIMARY KEY, group_a_id INTEGER NOT NULL, group_b_id INTEGER NOT NULL)');
// })

function createGroup(data, callback) {
    const sql = 'INSERT INTO groups (name_group, token_bot, chat_id, admins, status_webhook) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, data, (err) => {
        if (err) {
            callback(err, null);
            console.error('Lỗi khi tạo dữ liệu:', err);
        } else {
            callback(null, rows);
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

function updateGroup(data, callback) {
    const sql = `UPDATE groups
                 SET name_group     = ?,
                     token_bot      = ?,
                     chat_id        = ?,
                     admins         = ?,
                     status_webhook = ?
                 WHERE id = ?`;

    db.run(sql, data, function (err, rows) {
        if (err) {
            callback(err, null);
        } else {
            getListGroup(() => {
            })
            callback(null, rows);
        }
    });
}

module.exports = {
    createGroup,
    getListGroup,
    updateGroup
};
