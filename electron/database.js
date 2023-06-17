const {app, ipcMain} = require('electron');

const sqlite3 = require('sqlite3');
const path = require('path')
const dbPath = path.resolve(__dirname, 'database.db').replace('app.asar', 'app.asar.unpacked');
const db = new sqlite3.Database(dbPath);

// app.whenReady().then(() => {
// const dbPath = path.join(__dirname, '../database/database.db');

// db = new sqlite3.Database(dbPath); // Đường dẫn đến file SQLite (':memory:' sẽ lưu trữ dữ liệu trong bộ nhớ)
//
// db.run('CREATE TABLE IF NOT EXISTS topic (id INTEGER PRIMARY KEY, group_id INTEGER NOT NULL, name_topic TEXT NOT NULL, message_thread_id INTEGER NOT NULL, status_chat BLOB)');
// db.run('CREATE TABLE IF NOT EXISTS groups (id INTEGER PRIMARY KEY, name_group TEXT NOT NULL, token_bot TEXT NOT NULL, chat_id TEXT UNIQUE, admins TEXT, status_webhook BLOB)');
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

//Bảng connect-group
function createConnectGroup(data, callback) {
    const sql = 'INSERT INTO connect_group (group_a_id, group_b_id) VALUES (?, ?)';
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

function getListTopicByGroup(data, callback) {
    const groupId = data.group_id;
    const sql = `SELECT *
                 FROM topic
                 WHERE group_id = ?`;

    db.all(sql, [groupId], (err, rows) => {
        if (err) {
            callback(err, null)
            console.error(err.message);
            // Xử lý lỗi
        } else {
            if (rows) {
                callback(null, rows)
            } else {
                callback(null, null)
                console.log('Không tìm thấy bản ghi theo group id');
            }
        }
    });
}

function getDetailGroupByChatId(data, callback) {
    const chatId = data.chat_id  + "";
    const sql = `SELECT *
                 FROM groups
                 WHERE chat_id = ?`;

    db.get(sql, [chatId], (err, row) => {
        if (err) {
            callback(err, null)
            console.error(err.message);
            // Xử lý lỗi
        } else {
            if (row) {
                callback(null, row)
                // Sử dụng dữ liệu của bản ghi tìm được
            } else {
                callback(null, null)
                console.log('Không tìm thấy bản ghi topic theo chat id');
            }
        }
    });
}

function createTopicByChatId(data, callback) {
    const sql = 'INSERT INTO topic (group_id, name_topic, message_thread_id, status_chat) VALUES (?, ?, ?, ?)';

    db.run(sql, data, (err) => {
        if (err) {
            callback(err, null);
            console.error('Lỗi khi tạo dữ liệu topic:', err);
        } else {
            callback(null, rows);
            console.log('Đã tạo dữ liệu topic thành công');
        }
    });
}

module.exports = {
    createGroup,
    getListGroup,
    updateGroup,
    getListTopicByGroup,
    getDetailGroupByChatId,
    createTopicByChatId
};
