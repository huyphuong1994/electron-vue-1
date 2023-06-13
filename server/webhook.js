const express = require('express');
const bodyParser = require('body-parser');
const { BrowserWindow } = require('electron');

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

module.exports = router;
