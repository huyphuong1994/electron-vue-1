const express = require('express');
const path = require("path");

const webhookRouter = require(path.resolve(__dirname, 'webhook'));
const apiRouter = require(path.resolve(__dirname, 'api'));
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3000; // Chọn cổng lắng nghe của server

// Sử dụng router để lắng nghe webhook
app.use('/', webhookRouter, apiRouter);

// Khởi động server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
