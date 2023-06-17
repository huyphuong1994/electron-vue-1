const express = require('express');
const bodyParser = require('body-parser');
const dataUtils = require('./database');
const responseUtils = require('./responseUtils');
const telegram = require('./telegram');

const router = express.Router();

// Sử dụng body-parser để xử lý dữ liệu webhook
router.use(bodyParser.json());

router.get('/api/list-group', (req, res) => {
    // Truy vấn dữ liệu từ bảng users
    dataUtils.getListGroup((err, data) => {
        if (err) {
            // res.status(400).send('Internal Server Error');
            res.json(responseUtils.createResponse('Error', 'Lỗi khi lấy danh sách group!', [], 400));
        } else {
            res.json(responseUtils.createResponse('Success', '', data, 200));
        }
    });
})

router.post('/api/create-group', async (req, res) => {
    try {
        const {values} = req.body;

        const admins = await telegram.getAdminList(values);

        if (admins.ok) {
            values.push(JSON.stringify(admins.result.map((item) => item.user.id)));
            values.push(1);
        }

        // Sử dụng hàm tạo dữ liệu từ dataUtils
        await dataUtils.createGroup(values, (err, data) => {
            if (err) {
                res.json(responseUtils.createResponse('Error', 'Tạo mới group thất bại!', [], 400));
            } else {
                res.json(responseUtils.createResponse('Success', '', data, 200));
            }
        });
    } catch (e) {
        res.json(responseUtils.createResponse('Error', 'Tạo mới group thất bại!', [], 400));
    }
});

router.get('/api/list-topic/:group_id', (req, res) => {
    dataUtils.getListTopicByGroup({group_id: req.params.group_id}, (err, data) => {
        if (err) {
            // res.status(400).send('Internal Server Error');
            res.json(responseUtils.createResponse('Error', 'Lỗi khi lấy danh sách topic!', [], 400));
        } else {
            res.json(responseUtils.createResponse('Success', '', data, 200));
        }
    })
})

module.exports = router;
