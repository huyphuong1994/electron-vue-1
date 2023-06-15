const express = require('express');
const bodyParser = require('body-parser');
const {BrowserWindow} = require('electron');
const dataUtils = require('../database/database')

const router = express.Router();

// Sử dụng body-parser để xử lý dữ liệu webhook
router.use(bodyParser.json());

// Route để lắng nghe webhook
router.post('/webhook', (req, res) => {
    const webhookData = req.body;

    const mainWindow = BrowserWindow.getAllWindows()[0];

    // Gửi dữ liệu tới quy trình chính của ứng dụng Electron
    mainWindow.webContents.send('webhookData', webhookData);

    // Trả về phản hồi cho webhook
    res.sendStatus(200);
});

router.get('/api/list-group', (req, res) => {
    // Truy vấn dữ liệu từ bảng users
    dataUtils.getListGroup((err, data) => {
        if (err) {
            console.error(err);
            res.status(400).send('Internal Server Error');
        } else {
            res.json(data);
        }
    });
})

router.post('/api/create-group', (req, res) => {
    const {values} = req.body;

    // Sử dụng hàm tạo dữ liệu từ dataUtils
    dataUtils.createGroup(values);

    res.send('Dữ liệu đã được tạo');
})

module.exports = router;
