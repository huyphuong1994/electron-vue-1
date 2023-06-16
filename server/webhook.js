const express = require('express');
const bodyParser = require('body-parser');
const {BrowserWindow} = require('electron');
const dataUtils = require('../database/database')
const responseUtils = require('./responseUtils');
const telegram = require('./telegram');

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

router.post('/api/connect-webhook', (req, res) => {
    dataUtils.getListGroup((err, data) => {
        if (err) {
            res.json(responseUtils.createResponse('Error', 'Lỗi khi kết nối với webhook teltegram!', [], 400));
            // res.status(400).send('Internal Server Error');
        } else {
            if (data.length) {
                data.forEach(async (item) => {
                    const tokenBot = item.token_bot;
                    // Gọi hàm set webhook từ module telegram để gửi tin nhắn
                    const response = await telegram.setWebhook(item, `${global.ngrokUrl}/webhook`);

                    if (response.ok) {
                        dataUtils.updateGroup([
                            item.name_group,
                            item.token_bot,
                            item.chat_id,
                            item.admins,
                            true,
                            item.id,
                        ], (err, data) => {
                        })
                    } else {
                        dataUtils.updateGroup([
                            item.name_group,
                            item.token_bot,
                            item.chat_id,
                            item.admins,
                            false,
                            item.id,
                        ], (err, data) => {
                        })
                    }
                })
                res.json(responseUtils.createResponse('Success', 'Kết nối webhook thành công!', [], 200));
            } else {
                res.json(responseUtils.createResponse('Error', 'Chưa có group nào được thêm vào!', [], 200));
            }
        }
    });
})

router.post('/api/delete-webhook', (req, res) => {
    dataUtils.getListGroup((err, data) => {
        if (err) {
            res.json(responseUtils.createResponse('Error', 'Lỗi khi kết nối với webhook teltegram!', [], 400));
            // res.status(400).send('Internal Server Error');
        } else {
            if (data.length) {
                data.forEach(async (item) => {
                    const tokenBot = item.token_bot;
                    // Gọi hàm set webhook từ module telegram để gửi tin nhắn
                    const response = await telegram.deleteWebhook(tokenBot);

                    console.log('ádf', response)
                    if (response.ok) {
                        dataUtils.updateGroup([
                            item.name_group,
                            item.token_bot,
                            item.chat_id,
                            item.admins,
                            false,
                            item.id,
                        ], (err, data) => {
                        })
                    }
                })
                res.json(responseUtils.createResponse('Success', 'Kết nối webhook thành công!', [], 200));
            } else {
                res.json(responseUtils.createResponse('Error', 'Chưa có group nào được thêm vào!', [], 200));
            }
        }
    })
})

module.exports = router;
