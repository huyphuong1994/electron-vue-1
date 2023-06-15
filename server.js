const express = require('express');
const webhookRouter = require('./server/webhook');
const apiRouter = require('./server/api');
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
