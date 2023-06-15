const express = require('express');
const bodyParser = require('body-parser');
const dataUtils = require('../database/database');
const responseUtils = require('./responseUtils');

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

router.post('/api/create-group', (req, res) => {
    const {values} = req.body;

    // Sử dụng hàm tạo dữ liệu từ dataUtils
    dataUtils.createGroup(values, (err, data) => {
        if (err) {
            // res.status(400).send('Internal Server Error');
            res.json(responseUtils.createResponse('Error', 'Tạo mới group thất bại!', [], 400));
        } else {
            res.json(responseUtils.createResponse('Success', '', data, 200));
        }
    });
});

module.exports = router;
