const express = require('express');
const webhookRouter = require('./server/webhook');

const app = express();
const port = 3000; // Chọn cổng lắng nghe của server

// Sử dụng router để lắng nghe webhook
app.use('/', webhookRouter);

// Khởi động server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
